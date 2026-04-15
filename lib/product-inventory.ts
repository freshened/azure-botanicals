import { prisma } from "@/lib/prisma"

export type InventoryStatus = {
  inventoryQuantity: number | null
  inStock: boolean
}

export async function inventoryByProductIds(ids: string[]) {
  if (ids.length === 0) return new Map<string, number>()
  const rows = await prisma.productInventory.findMany({
    where: { stripeProductId: { in: ids } },
    select: { stripeProductId: true, quantity: true },
  })
  const map = new Map<string, number>()
  for (const row of rows) {
    map.set(row.stripeProductId, row.quantity)
  }
  return map
}

export function toInventoryStatus(quantity: number | null | undefined): InventoryStatus {
  if (typeof quantity !== "number") {
    return { inventoryQuantity: null, inStock: true }
  }
  return {
    inventoryQuantity: quantity,
    inStock: quantity > 0,
  }
}
