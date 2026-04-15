import type Stripe from "stripe"
import { toInventoryStatus } from "@/lib/product-inventory"
import { resolveOrderedGallery } from "@/lib/product-gallery"
import { isDatabaseConfigured, prisma } from "@/lib/prisma"
import { getStripeAccountOptions, requireStripeSecretKey, stripe } from "@/lib/stripe-connect"

export type ShopProductPayload = {
  id: string
  priceId: string | null
  name: string
  description: string | null
  price: number
  currency: string
  image: string
  images: string[]
  category: string
  tag: string | null
  inventoryQuantity: number | null
  inStock: boolean
}

export function mapStripeProductToShopPayload(
  p: Stripe.Product,
  dbUrls: string[],
  inventoryQuantity?: number | null
): ShopProductPayload {
  const defaultPrice = p.default_price as Stripe.Price | null
  const amount = defaultPrice?.unit_amount ?? 0
  const currency = (defaultPrice?.currency ?? "usd").toUpperCase()
  const stripeImages = Array.isArray(p.images) && p.images.length > 0 ? p.images : []
  const stripeMain = stripeImages[0] || ""
  const merged = resolveOrderedGallery(stripeMain || undefined, dbUrls)
  const images = merged.length > 0 ? merged : ["/placeholder.svg"]
  const metadata = (p.metadata || {}) as Record<string, string>
  const inventory = toInventoryStatus(inventoryQuantity)
  return {
    id: p.id,
    priceId: defaultPrice?.id ?? null,
    name: p.name,
    description: p.description ? p.description : null,
    price: amount / 100,
    currency,
    image: images[0],
    images,
    category: metadata.category ?? "Shop",
    tag: metadata.tag || null,
    inventoryQuantity: inventory.inventoryQuantity,
    inStock: inventory.inStock,
  }
}

export async function getDbGalleryUrlsForProduct(stripeProductId: string): Promise<string[]> {
  if (!isDatabaseConfigured()) return []
  try {
    const rows = await prisma.productExtraImage.findMany({
      where: { stripeProductId },
      orderBy: { sortOrder: "asc" },
    })
    return rows.map((r) => r.imageUrl)
  } catch {
    return []
  }
}

export async function getShopProductById(productId: string): Promise<ShopProductPayload | null> {
  try {
    requireStripeSecretKey()
    const acctOpts = getStripeAccountOptions()
    const p = await stripe.products.retrieve(productId, { expand: ["default_price"] }, acctOpts)
    if (!p.active) return null
    const dbUrls = await getDbGalleryUrlsForProduct(productId)
    let inventoryQuantity: number | null = null
    if (isDatabaseConfigured()) {
      const row = await prisma.productInventory.findUnique({
        where: { stripeProductId: productId },
        select: { quantity: true },
      })
      if (row) inventoryQuantity = row.quantity
    }
    return mapStripeProductToShopPayload(p, dbUrls, inventoryQuantity)
  } catch {
    return null
  }
}
