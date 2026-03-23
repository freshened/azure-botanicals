import { NextResponse } from "next/server"
import type Stripe from "stripe"
import { requireConnectedAccountId, requireStripeSecretKey, stripe } from "@/lib/stripe-connect"

export async function GET() {
  try {
    requireStripeSecretKey()
    const accountId = requireConnectedAccountId()
    const { data: products } = await stripe.products.list(
      {
        active: true,
        expand: ["data.default_price"],
      },
      {
        stripeAccount: accountId,
      }
    )

    const items = products.map((p) => {
      const defaultPrice = p.default_price as Stripe.Price | null
      const amount = defaultPrice?.unit_amount ?? 0
      const currency = (defaultPrice?.currency ?? "usd").toUpperCase()
      const images = Array.isArray(p.images) && p.images.length > 0 ? p.images : []
      const image = images[0] || "/placeholder.svg"
      const metadata = (p.metadata || {}) as Record<string, string>

      return {
        id: p.id,
        priceId: defaultPrice?.id ?? null,
        name: p.name,
        price: amount / 100,
        currency,
        image,
        images: images.length > 0 ? images : ["/placeholder.svg"],
        category: metadata.category ?? "Shop",
        tag: metadata.tag || null,
      }
    })

    return NextResponse.json(items)
  } catch (err) {
    const message = err instanceof Error ? err.message : "Stripe error"
    return NextResponse.json(
      { error: message },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    requireStripeSecretKey()
    const accountId = requireConnectedAccountId()
    const body = (await request.json()) as {
      name?: string
      description?: string
      priceInCents?: number
      category?: string
      tag?: string
      imageUrl?: string
    }

    const name = body.name?.trim()
    const description = body.description?.trim() || ""
    const category = body.category?.trim() || "Shop"
    const tag = body.tag?.trim() || ""
    const imageUrl = body.imageUrl?.trim() || ""
    const currency = "usd"
    const priceInCents = Number.isFinite(body.priceInCents) ? Math.floor(Number(body.priceInCents)) : NaN

    if (!name) {
      return NextResponse.json({ error: "name is required." }, { status: 400 })
    }
    if (Number.isNaN(priceInCents) || priceInCents < 50) {
      return NextResponse.json({ error: "priceInCents must be an integer of at least 50." }, { status: 400 })
    }

    const product = await stripe.products.create(
      {
        name,
        description,
        images: imageUrl ? [imageUrl] : [],
        metadata: {
          category,
          tag,
        },
        default_price_data: {
          unit_amount: priceInCents,
          currency,
        },
      },
      {
        stripeAccount: accountId,
      }
    )

    return NextResponse.json({
      id: product.id,
      name: product.name,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Stripe error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    requireStripeSecretKey()
    const accountId = requireConnectedAccountId()
    const body = (await request.json()) as {
      productId?: string
      name?: string
      description?: string
      priceInCents?: number
      category?: string
      tag?: string
      imageUrl?: string
    }

    const productId = body.productId?.trim()
    const name = body.name?.trim()
    const description = body.description?.trim() || ""
    const category = body.category?.trim() || "Shop"
    const tag = body.tag?.trim() || ""
    const imageUrl = body.imageUrl?.trim() || ""
    const currency = "usd"
    const priceInCents =
      Number.isFinite(body.priceInCents) && body.priceInCents !== undefined
        ? Math.floor(Number(body.priceInCents))
        : null

    if (!productId) {
      return NextResponse.json({ error: "productId is required." }, { status: 400 })
    }
    if (!name) {
      return NextResponse.json({ error: "name is required." }, { status: 400 })
    }
    if (priceInCents !== null && priceInCents < 50) {
      return NextResponse.json({ error: "priceInCents must be at least 50 when provided." }, { status: 400 })
    }

    const product = await stripe.products.update(
      productId,
      {
        name,
        description,
        images: imageUrl ? [imageUrl] : [],
        metadata: {
          category,
          tag,
        },
      },
      {
        stripeAccount: accountId,
      }
    )

    if (priceInCents !== null) {
      const newPrice = await stripe.prices.create(
        {
          product: product.id,
          unit_amount: priceInCents,
          currency,
        },
        {
          stripeAccount: accountId,
        }
      )

      await stripe.products.update(
        product.id,
        {
          default_price: newPrice.id,
        },
        {
          stripeAccount: accountId,
        }
      )
    }

    return NextResponse.json({ id: product.id, name: product.name })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Stripe error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    requireStripeSecretKey()
    const accountId = requireConnectedAccountId()
    const body = (await request.json()) as { productId?: string }
    const productId = body.productId?.trim()

    if (!productId) {
      return NextResponse.json({ error: "productId is required." }, { status: 400 })
    }

    await stripe.products.update(
      productId,
      {
        active: false,
      },
      {
        stripeAccount: accountId,
      }
    )

    return NextResponse.json({ ok: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Stripe error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
