import { NextResponse } from "next/server"
import { isDatabaseConfigured, prisma } from "@/lib/prisma"
import {
  getPlatformFeePercent,
  getStripeAccountOptions,
  requireStripeSecretKey,
  stripe,
  stripeConnectEnabled,
} from "@/lib/stripe-connect"

type RequestLineItem = {
  priceId: string
  quantity: number
}

export async function POST(request: Request) {
  try {
    requireStripeSecretKey()
    const acctOpts = getStripeAccountOptions()
    const connectOn = stripeConnectEnabled()
    const usePlatformOnly = !connectOn || process.env.CHECKOUT_USE_PLATFORM_ONLY === "true"
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    if (!publishableKey) {
      return NextResponse.json(
        { error: "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set." },
        { status: 500 }
      )
    }

    const body = await request.json()
    const lineItems = body?.lineItems as RequestLineItem[] | undefined
    if (!Array.isArray(lineItems) || lineItems.length === 0) {
      return NextResponse.json(
        { error: "lineItems required (array of { priceId, quantity })" },
        { status: 400 }
      )
    }

    let amount = 0
    const metadata: Record<string, string> = {}

    for (const item of lineItems) {
      const quantity = Math.max(1, Math.floor(item.quantity))
      const price = await stripe.prices.retrieve(item.priceId, {}, acctOpts)
      if (price.unit_amount === null) {
        return NextResponse.json(
          { error: `Price ${item.priceId} does not have unit_amount.` },
          { status: 400 }
        )
      }
      amount += price.unit_amount * quantity
      metadata[`price_${item.priceId}`] = String(quantity)
      metadata[`product_${item.priceId}`] = String(price.product)

      if (isDatabaseConfigured()) {
        const productId = String(price.product)
        const inv = await prisma.productInventory.findUnique({
          where: { stripeProductId: productId },
          select: { quantity: true },
        })
        if (inv && inv.quantity < quantity) {
          return NextResponse.json(
            {
              error: inv.quantity <= 0 ? "One or more items are sold out." : "Some items no longer have enough stock.",
            },
            { status: 409 }
          )
        }
      }
    }

    const feePercent = getPlatformFeePercent()
    const applicationFeeAmount = Math.round(amount * (feePercent / 100))

    const intentPayload: Parameters<typeof stripe.paymentIntents.create>[0] = {
      amount,
      currency: "usd",
      payment_method_types: ["card"],
      metadata,
    }

    if (connectOn && !usePlatformOnly) {
      intentPayload.application_fee_amount = applicationFeeAmount
    }

    const intent = await stripe.paymentIntents.create(
      intentPayload,
      connectOn && !usePlatformOnly ? acctOpts : undefined
    )

    if (!intent.client_secret) {
      return NextResponse.json(
        { error: "Failed to create payment intent." },
        { status: 500 }
      )
    }

    return NextResponse.json({
      clientSecret: intent.client_secret,
      publishableKey,
      stripeAccountId: connectOn && !usePlatformOnly ? acctOpts.stripeAccount : undefined,
      checkoutMode: connectOn && !usePlatformOnly ? "connect_direct_charge" : "platform_only",
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Checkout error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
