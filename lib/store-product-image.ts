import { randomUUID } from "crypto"
import { mkdir, writeFile } from "fs/promises"
import path from "path"
import { put } from "@vercel/blob"
import { getBaseUrl } from "@/lib/stripe-connect"

const MAX_BYTES = 5 * 1024 * 1024
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"])

function extForMime(mime: string) {
  if (mime === "image/png") return ".png"
  if (mime === "image/webp") return ".webp"
  if (mime === "image/gif") return ".gif"
  return ".jpg"
}

export function validateImageBuffer(buffer: Buffer, contentType: string) {
  if (!ALLOWED.has(contentType)) {
    throw new Error("Use JPEG, PNG, WebP, or GIF.")
  }
  if (buffer.length > MAX_BYTES) {
    throw new Error("Image must be 5MB or smaller.")
  }
}

export async function storeProductImage(
  buffer: Buffer,
  contentType: string,
  request: Request
): Promise<string> {
  validateImageBuffer(buffer, contentType)
  const ext = extForMime(contentType)
  const key = `products/${randomUUID()}${ext}`
  const token = process.env.BLOB_READ_WRITE_TOKEN?.trim()

  if (token) {
    const blob = await put(key, buffer, {
      access: "public",
      token,
      contentType,
    })
    return blob.url
  }

  if (process.env.VERCEL === "1") {
    throw new Error(
      "Set BLOB_READ_WRITE_TOKEN in the project environment to upload images on Vercel."
    )
  }

  const dir = path.join(process.cwd(), "storage", "product-images")
  await mkdir(dir, { recursive: true })
  const filename = `${randomUUID()}${ext}`
  await writeFile(path.join(dir, filename), buffer)
  const base = getBaseUrl(request).replace(/\/$/, "")
  return `${base}/uploads/product-images/${filename}`
}
