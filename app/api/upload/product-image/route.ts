import { NextResponse } from "next/server"
import { storeProductImage } from "@/lib/store-product-image"
import { requireStripeSecretKey } from "@/lib/stripe-connect"

export async function POST(request: Request) {
  try {
    requireStripeSecretKey()
    const form = await request.formData()
    const file = form.get("file")
    if (!(file instanceof Blob) || file.size === 0) {
      return NextResponse.json({ error: "file is required." }, { status: 400 })
    }
    const contentType = file.type || "application/octet-stream"
    const buffer = Buffer.from(await file.arrayBuffer())
    const url = await storeProductImage(buffer, contentType, request)
    return NextResponse.json({ url })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed"
    const status = message.includes("BLOB_READ_WRITE_TOKEN") ? 503 : 400
    return NextResponse.json({ error: message }, { status })
  }
}
