import { NextResponse } from "next/server"
import { inventoryByProductIds } from "@/lib/product-inventory"
import { mapStripeProductToShopPayload } from "@/lib/shop-product"
import { isDatabaseConfigured, prisma } from "@/lib/prisma"
import { requirePortalSession } from "@/lib/require-portal-session"
import {
  buildCategoryNameBySlugMap,
  buildTagNameBySlugMap,
  getShopTaxonomy,
} from "@/lib/shop-taxonomy"
import { getStripeAccountOptions, requireStripeSecretKey, stripe } from "@/lib/stripe-connect"

async function assertCategoryAndTagAllowed(category: string, tag: string) {
  if (!isDatabaseConfigured()) return null as string | null
  try {
    const catOk = await prisma.shopCategory.findFirst({ where: { name: category } })
    if (!catOk) {
      return "Unknown category. Add it under Portal → Catalog or pick an existing category."
    }
    if (tag.trim()) {
      const tagOk = await prisma.shopTag.findFirst({ where: { name: tag.trim() } })
      if (!tagOk) {
        return "Unknown tag. Add it under Portal → Catalog or pick an existing tag."
      }
    }
  } catch {
    return null
  }
  return null
}

async function dbGalleryUrlsByProductIds(ids: string[]) {
  if (!isDatabaseConfigured() || ids.length === 0) {
    return new Map<string, string[]>()
  }
  try {
    const rows = await prisma.productExtraImage.findMany({
      where: { stripeProductId: { in: ids } },
      orderBy: [{ stripeProductId: "asc" }, { sortOrder: "asc" }],
    })
    const map = new Map<string, string[]>()
    for (const row of rows) {
      const list = map.get(row.stripeProductId) ?? []
      list.push(row.imageUrl)
      map.set(row.stripeProductId, list)
    }
    return map
  } catch {
    return new Map<string, string[]>()
  }
}

function parseInventory(value: unknown) {
  if (value === null || value === undefined || value === "") return null
  const n = Number(value)
  if (!Number.isFinite(n)) return Number.NaN
  return Math.max(0, Math.floor(n))
}

export async function GET(request: Request) {
  try {
    requireStripeSecretKey()
    const acctOpts = getStripeAccountOptions()
    const { data: products } = await stripe.products.list(
      {
        active: true,
        expand: ["data.default_price"],
      },
      acctOpts
    )

    const ids = products.map((p) => p.id)
    const dbMap = await dbGalleryUrlsByProductIds(ids)
    const invMap = isDatabaseConfigured() ? await inventoryByProductIds(ids) : new Map<string, number>()

    let items = products.map((p) => {
      const dbUrls = dbMap.get(p.id) ?? []
      const inventoryQuantity = invMap.get(p.id)
      const base = mapStripeProductToShopPayload(p, dbUrls, inventoryQuantity)
      return {
        ...base,
        extraImageUrls: dbUrls,
      }
    })

    const { searchParams } = new URL(request.url)
    const categorySlug = searchParams.get("category")?.trim().toLowerCase() ?? ""
    const tagSlug = searchParams.get("tag")?.trim().toLowerCase() ?? ""

    if (categorySlug || tagSlug) {
      const taxonomy = await getShopTaxonomy()
      const catMap = buildCategoryNameBySlugMap(taxonomy.categories)
      const tagMap = buildTagNameBySlugMap(taxonomy.tags)
      if (categorySlug) {
        const catName = catMap.get(categorySlug)
        if (catName) {
          const want = catName.trim().toLowerCase()
          items = items.filter((p) => p.category.trim().toLowerCase() === want)
        } else {
          items = []
        }
      }
      if (tagSlug) {
        const tagName = tagMap.get(tagSlug)
        if (tagName) {
          const want = tagName.trim().toLowerCase()
          items = items.filter((p) => (p.tag || "").trim().toLowerCase() === want)
        } else {
          items = []
        }
      }
    }

    return NextResponse.json(items)
  } catch (err) {
    let message = "Stripe error"
    if (err instanceof Error) {
      message = err.message
    } else if (typeof err === "object" && err !== null && "message" in err) {
      message = String((err as { message: unknown }).message)
    }
    if (process.env.NODE_ENV === "development") {
      console.error("[GET /api/products]", message)
    }
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const gate = await requirePortalSession(request)
    if (gate instanceof NextResponse) return gate
    requireStripeSecretKey()
    const acctOpts = getStripeAccountOptions()
    const body = (await request.json()) as {
      name?: string
      description?: string
      priceInCents?: number
      category?: string
      tag?: string
      imageUrl?: string
      inventoryQuantity?: number | null
    }

    const name = body.name?.trim()
    const description = body.description?.trim() || ""
    const category = body.category?.trim() || "Shop"
    const tag = body.tag?.trim() || ""
    const imageUrl = body.imageUrl?.trim() || ""
    const inventoryQuantity = parseInventory(body.inventoryQuantity)
    const currency = "usd"
    const priceInCents = Number.isFinite(body.priceInCents) ? Math.floor(Number(body.priceInCents)) : NaN

    if (!name) {
      return NextResponse.json({ error: "name is required." }, { status: 400 })
    }
    if (Number.isNaN(priceInCents) || priceInCents < 50) {
      return NextResponse.json({ error: "priceInCents must be an integer of at least 50." }, { status: 400 })
    }
    if (Number.isNaN(inventoryQuantity)) {
      return NextResponse.json({ error: "inventoryQuantity must be a non-negative integer." }, { status: 400 })
    }

    const taxErr = await assertCategoryAndTagAllowed(category, tag)
    if (taxErr) {
      return NextResponse.json({ error: taxErr }, { status: 400 })
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
      acctOpts
    )

    if (isDatabaseConfigured() && inventoryQuantity !== null) {
      await prisma.productInventory.upsert({
        where: { stripeProductId: product.id },
        create: { stripeProductId: product.id, quantity: inventoryQuantity },
        update: { quantity: inventoryQuantity },
      })
    }

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
    const gate = await requirePortalSession(request)
    if (gate instanceof NextResponse) return gate
    requireStripeSecretKey()
    const acctOpts = getStripeAccountOptions()
    const body = (await request.json()) as {
      productId?: string
      name?: string
      description?: string
      priceInCents?: number
      category?: string
      tag?: string
      inventoryQuantity?: number | null
    }

    const productId = body.productId?.trim()
    const name = body.name?.trim()
    const description = body.description?.trim() || ""
    const category = body.category?.trim() || "Shop"
    const tag = body.tag?.trim() || ""
    const inventoryQuantity = parseInventory(body.inventoryQuantity)
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
    if (Number.isNaN(inventoryQuantity)) {
      return NextResponse.json({ error: "inventoryQuantity must be a non-negative integer." }, { status: 400 })
    }

    const taxErr = await assertCategoryAndTagAllowed(category, tag)
    if (taxErr) {
      return NextResponse.json({ error: taxErr }, { status: 400 })
    }

    const product = await stripe.products.update(
      productId,
      {
        name,
        description,
        metadata: {
          category,
          tag,
        },
      },
      acctOpts
    )

    if (priceInCents !== null) {
      const newPrice = await stripe.prices.create(
        {
          product: product.id,
          unit_amount: priceInCents,
          currency,
        },
        acctOpts
      )

      await stripe.products.update(
        product.id,
        {
          default_price: newPrice.id,
        },
        acctOpts
      )
    }

    if (isDatabaseConfigured() && inventoryQuantity !== null) {
      await prisma.productInventory.upsert({
        where: { stripeProductId: productId },
        create: { stripeProductId: productId, quantity: inventoryQuantity },
        update: { quantity: inventoryQuantity },
      })
    }

    return NextResponse.json({ id: product.id, name: product.name })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Stripe error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const gate = await requirePortalSession(request)
    if (gate instanceof NextResponse) return gate
    requireStripeSecretKey()
    const acctOpts = getStripeAccountOptions()
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
      acctOpts
    )

    if (isDatabaseConfigured()) {
      try {
        await prisma.productExtraImage.deleteMany({
          where: { stripeProductId: productId },
        })
        await prisma.productInventory.deleteMany({
          where: { stripeProductId: productId },
        })
      } catch {
        // ignore
      }
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Stripe error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
