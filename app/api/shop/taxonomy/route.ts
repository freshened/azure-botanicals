import { NextResponse } from "next/server"
import { getShopTaxonomy } from "@/lib/shop-taxonomy"

export async function GET() {
  try {
    const data = await getShopTaxonomy()
    return NextResponse.json(data)
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load taxonomy"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
