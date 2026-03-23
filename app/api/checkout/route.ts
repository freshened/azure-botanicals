import { NextResponse } from "next/server"
import {
  getPlatformFeePercent,
  requireConnectedAccountId,
  requireStripeSecretKey,
  stripe,
} from "@/lib/stripe-connect"

export async function POST(request: Request) {
  try {
    requireStripeSecretKey()
    const accountId = requireConnectedAccountId()
    const usePlatformOnly = process.env.CHECKOUT_USE_PLATFORM_ONLY === "true"
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    if (!publishableKey) {
      return NextResponse.json(
        { error: "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set." },
        { status: 500 }
      )
    }

    const body = await request.json()
    const lineItems = body?.lineItems as Array<{ priceId: string; quantity: number }> | undefined
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
      const price = await stripe.prices.retrieve(
        item.priceId,
        {},
        {
          stripeAccount: accountId,
        }
      )
      if (price.unit_amount === null) {
        return NextResponse.json(
          { error: `Price ${item.priceId} does not have unit_amount.` },
          { status: 400 }
        )
      }
      amount += price.unit_amount * quantity
      metadata[`price_${item.priceId}`] = String(quantity)
    }

    const feePercent = getPlatformFeePercent()
    const applicationFeeAmount = Math.round(amount * (feePercent / 100))

    const intentPayload: Parameters<typeof stripe.paymentIntents.create>[0] = {
      amount,
      currency: "usd",
      payment_method_types: ["card"],
      metadata,
    }

    if (!usePlatformOnly) {
      intentPayload.application_fee_amount = applicationFeeAmount
    }

    const intent = await stripe.paymentIntents.create(
      intentPayload,
      usePlatformOnly
        ? undefined
        : {
            stripeAccount: accountId,
          }
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
      stripeAccountId: accountId,
      checkoutMode: usePlatformOnly ? "platform_only" : "connect_direct_charge",
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Checkout error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
