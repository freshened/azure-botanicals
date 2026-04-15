import type Stripe from "stripe"
import { NextResponse } from "next/server"
import { isDatabaseConfigured, prisma } from "@/lib/prisma"
import { requireStripeSecretKey, stripe } from "@/lib/stripe-connect"

function getWebhookSecret() {
  const s = process.env.STRIPE_WEBHOOK_SECRET?.trim()
  if (!s) throw new Error("Missing STRIPE_WEBHOOK_SECRET.")
  return s
}

async function hydrateItemsFromIntent(intent: Stripe.PaymentIntent, stripeAccount?: string) {
  const out: Array<{
    stripeProductId: string
    stripePriceId: string
    quantity: number
    unitAmount: number
    currency: string
    productName: string
  }> = []

  for (const [key, value] of Object.entries(intent.metadata || {})) {
    if (!key.startsWith("product_price_")) continue
    const priceId = key.replace("product_", "")
    const stripeProductId = String(value || "").trim()
    const quantity = Number.parseInt(String(intent.metadata?.[`price_${priceId}`] ?? "0"), 10)
    if (!stripeProductId || !Number.isFinite(quantity) || quantity <= 0) continue
    const price = await stripe.prices.retrieve(
      priceId,
      { expand: ["product"] },
      stripeAccount ? { stripeAccount } : undefined
    )
    const unitAmount = price.unit_amount ?? 0
    const currency = (price.currency ?? intent.currency ?? "usd").toUpperCase()
    const productName =
      typeof price.product === "object" && price.product && "name" in price.product
        ? (price.product.name as string)
        : "Product"
    out.push({
      stripeProductId,
      stripePriceId: priceId,
      quantity,
      unitAmount,
      currency,
      productName,
    })
  }

  return out
}

async function handlePaymentIntentSucceeded(intent: Stripe.PaymentIntent, stripeAccount?: string) {
  if (!isDatabaseConfigured()) return
  const paymentIntentId = intent.id
  const existingOrder = await prisma.order.findUnique({
    where: { paymentIntentId },
    select: { id: true },
  })
  if (existingOrder) return

  const items = await hydrateItemsFromIntent(intent, stripeAccount)
  const amountTotal = intent.amount_received || intent.amount || 0
  const currency = (intent.currency ?? "usd").toUpperCase()
  const customerEmail = intent.receipt_email || null

  await prisma.$transaction(async (tx) => {
    const order = await tx.order.create({
      data: {
        paymentIntentId,
        status: "paid",
        currency,
        amountTotal,
        customerEmail,
      },
    })

    if (items.length > 0) {
      await tx.orderItem.createMany({
        data: items.map((item) => ({
          orderId: order.id,
          stripeProductId: item.stripeProductId,
          stripePriceId: item.stripePriceId,
          quantity: item.quantity,
          unitAmount: item.unitAmount,
          currency: item.currency,
          productName: item.productName,
        })),
      })
    }

    for (const item of items) {
      const inv = await tx.productInventory.findUnique({
        where: { stripeProductId: item.stripeProductId },
        select: { quantity: true },
      })
      if (!inv) continue
      await tx.productInventory.update({
        where: { stripeProductId: item.stripeProductId },
        data: { quantity: Math.max(0, inv.quantity - item.quantity) },
      })
    }
  })
}

async function handlePaymentIntentFailed(intent: Stripe.PaymentIntent) {
  if (!isDatabaseConfigured()) return
  await prisma.order.upsert({
    where: { paymentIntentId: intent.id },
    create: {
      paymentIntentId: intent.id,
      status: "failed",
      currency: (intent.currency ?? "usd").toUpperCase(),
      amountTotal: intent.amount || 0,
      customerEmail: intent.receipt_email || null,
    },
    update: {
      status: "failed",
    },
  })
}

export async function POST(request: Request) {
  try {
    requireStripeSecretKey()
    const webhookSecret = getWebhookSecret()
    const signature = request.headers.get("stripe-signature")
    if (!signature) {
      return NextResponse.json({ error: "Missing stripe-signature header." }, { status: 400 })
    }
    const body = await request.text()
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    const stripeAccount =
      typeof event.account === "string" && event.account.trim() ? event.account.trim() : undefined

    switch (event.type) {
      case "payment_intent.succeeded": {
        const intent = event.data.object as Stripe.PaymentIntent
        await handlePaymentIntentSucceeded(intent, stripeAccount)
        break
      }
      case "payment_intent.payment_failed": {
        const intent = event.data.object as Stripe.PaymentIntent
        await handlePaymentIntentFailed(intent)
        break
      }
      default:
        break
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Webhook error"
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
