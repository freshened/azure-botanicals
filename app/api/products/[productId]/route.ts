import { NextResponse } from "next/server"
import { getShopProductById } from "@/lib/shop-product"

export async function GET(
  _request: Request,
  context: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await context.params
    const id = productId?.trim()
    if (!id) {
      return NextResponse.json({ error: "productId is required." }, { status: 400 })
    }
    const product = await getShopProductById(id)
    if (!product) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 })
    }
    return NextResponse.json(product)
  } catch (err) {
    const message = err instanceof Error ? err.message : "Stripe error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
