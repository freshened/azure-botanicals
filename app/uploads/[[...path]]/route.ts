import { readFile } from "fs/promises"
import path from "path"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

function safePathUnderRoot(root: string, segments: string[]) {
  if (!segments.length) return null
  for (const s of segments) {
    if (s === ".." || s.includes("/") || s.includes("\\")) return null
  }
  const resolved = path.resolve(root, ...segments)
  const rootResolved = path.resolve(root)
  if (resolved !== rootResolved && !resolved.startsWith(rootResolved + path.sep)) {
    return null
  }
  return resolved
}

export async function GET(
  _request: Request,
  ctx: { params: Promise<{ path?: string[] }> }
) {
  const { path: segments } = await ctx.params
  if (!segments?.length) {
    return new NextResponse(null, { status: 404 })
  }
  const roots = [
    path.join(process.cwd(), "storage"),
    path.join(process.cwd(), "public", "uploads"),
  ]
  for (const root of roots) {
    const filePath = safePathUnderRoot(root, segments)
    if (!filePath) continue
    try {
      const buf = await readFile(filePath)
      const ext = path.extname(filePath).toLowerCase()
      const contentType =
        ext === ".png"
          ? "image/png"
          : ext === ".webp"
            ? "image/webp"
            : ext === ".gif"
              ? "image/gif"
              : "image/jpeg"
      return new NextResponse(new Uint8Array(buf), {
        headers: {
          "Content-Type": contentType,
          "Cache-Control": "public, max-age=300",
        },
      })
    } catch {
      continue
    }
  }
  return new NextResponse(null, { status: 404 })
}
