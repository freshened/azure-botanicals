import { NextResponse } from "next/server"
import { requireConnectedAccountId, requireStripeSecretKey, stripe } from "@/lib/stripe-connect"

export async function POST(request: Request) {
  try {
    requireStripeSecretKey()
    const accountId = requireConnectedAccountId()
    const body = await request.json()
    const productId = typeof body?.productId === "string" ? body.productId.trim() : null
    const imageUrl = typeof body?.imageUrl === "string" ? body.imageUrl.trim() : null
    if (!productId || !imageUrl) {
      return NextResponse.json(
        { error: "productId and imageUrl required" },
        { status: 400 }
      )
    }

    const product = await stripe.products.retrieve(
      productId,
      {},
      {
        stripeAccount: accountId,
      }
    )
    const images = Array.isArray(product.images) ? product.images : []
    const nextImages = images.includes(imageUrl) ? images : [...images, imageUrl]

    const updated = await stripe.products.update(
      productId,
      {
        images: nextImages,
      },
      {
        stripeAccount: accountId,
      }
    )
    return NextResponse.json({ images: updated.images || [] })
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}

export async function DELETE(request: Request) {
  try {
    requireStripeSecretKey()
    const accountId = requireConnectedAccountId()
    const body = await request.json()
    const productId = typeof body?.productId === "string" ? body.productId.trim() : null
    const imageUrl = typeof body?.imageUrl === "string" ? body.imageUrl.trim() : null
    if (!productId || !imageUrl) {
      return NextResponse.json(
        { error: "productId and imageUrl required" },
        { status: 400 }
      )
    }

    const product = await stripe.products.retrieve(
      productId,
      {},
      {
        stripeAccount: accountId,
      }
    )
    const images = Array.isArray(product.images) ? product.images : []
    const nextImages = images.filter((url) => url !== imageUrl)

    const updated = await stripe.products.update(
      productId,
      {
        images: nextImages,
      },
      {
        stripeAccount: accountId,
      }
    )
    return NextResponse.json({ images: updated.images || [] })
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}
