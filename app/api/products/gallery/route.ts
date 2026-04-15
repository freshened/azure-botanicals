import { NextResponse } from "next/server"
import { MAX_GALLERY_IMAGES, resolveOrderedGallery } from "@/lib/product-gallery"
import { isDatabaseConfigured, prisma } from "@/lib/prisma"
import { requirePortalSession } from "@/lib/require-portal-session"
import { getStripeAccountOptions, requireStripeSecretKey, stripe } from "@/lib/stripe-connect"

export async function PUT(request: Request) {
  try {
    const gate = await requirePortalSession(request)
    if (gate instanceof NextResponse) return gate
    requireStripeSecretKey()
    const acctOpts = getStripeAccountOptions()
    const body = (await request.json()) as { productId?: string; imageUrls?: unknown }

    const productId = typeof body.productId === "string" ? body.productId.trim() : ""
    const raw = body.imageUrls
    const imageUrls = Array.isArray(raw)
      ? [...new Set(raw.filter((u): u is string => typeof u === "string").map((u) => u.trim()).filter(Boolean))]
      : []

    if (!productId) {
      return NextResponse.json({ error: "productId is required." }, { status: 400 })
    }
    if (imageUrls.length > MAX_GALLERY_IMAGES) {
      return NextResponse.json(
        { error: `At most ${MAX_GALLERY_IMAGES} images per product.` },
        { status: 400 }
      )
    }

    if (!isDatabaseConfigured() && imageUrls.length > 1) {
      return NextResponse.json(
        {
          error:
            "DATABASE_URL is required to store multiple images. You can set a single image on Stripe without a database.",
        },
        { status: 503 }
      )
    }

    if (isDatabaseConfigured()) {
      await prisma.productExtraImage.deleteMany({
        where: { stripeProductId: productId },
      })
      if (imageUrls.length > 0) {
        await prisma.productExtraImage.createMany({
          data: imageUrls.map((imageUrl, sortOrder) => ({
            stripeProductId: productId,
            imageUrl,
            sortOrder,
          })),
        })
      }
    }

    const stripeFirst = imageUrls[0] ?? ""
    await stripe.products.update(
      productId,
      {
        images: stripeFirst ? [stripeFirst] : [],
      },
      acctOpts
    )

    return NextResponse.json({ ok: true, imageUrls })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to update gallery"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const gate = await requirePortalSession(request)
    if (gate instanceof NextResponse) return gate
    requireStripeSecretKey()
    const acctOpts = getStripeAccountOptions()
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get("productId")?.trim()
    if (!productId) {
      return NextResponse.json({ error: "productId is required." }, { status: 400 })
    }

    const p = await stripe.products.retrieve(productId, {}, acctOpts)
    const stripeMain = Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : ""

    let dbUrls: string[] = []
    if (isDatabaseConfigured()) {
      const rows = await prisma.productExtraImage.findMany({
        where: { stripeProductId: productId },
        orderBy: { sortOrder: "asc" },
        select: { imageUrl: true },
      })
      dbUrls = rows.map((r) => r.imageUrl)
    }

    const imageUrls = resolveOrderedGallery(stripeMain || undefined, dbUrls)
    return NextResponse.json({ imageUrls })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load gallery"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
