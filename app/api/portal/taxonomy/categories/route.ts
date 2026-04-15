import { NextResponse } from "next/server"
import { isDatabaseConfigured, prisma } from "@/lib/prisma"
import { requirePortalSession } from "@/lib/require-portal-session"
import { slugify, uniqueCategorySlug } from "@/lib/slugify"
import { isCategoryNameInUseOnStripe } from "@/lib/taxonomy-stripe-usage"

export async function POST(request: Request) {
  const gate = await requirePortalSession(request)
  if (gate instanceof NextResponse) return gate
  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      { error: "DATABASE_URL is required to manage categories." },
      { status: 503 }
    )
  }
  try {
    let body: { name?: unknown }
    try {
      body = (await request.json()) as { name?: unknown }
    } catch {
      return NextResponse.json({ error: "Invalid JSON." }, { status: 400 })
    }
    const name = typeof body.name === "string" ? body.name.trim() : ""
    if (!name || name.length > 120) {
      return NextResponse.json({ error: "name is required (max 120 characters)." }, { status: 400 })
    }
    const base = slugify(name)
    const slug = await uniqueCategorySlug(prisma, base)
    const maxRow = await prisma.shopCategory.aggregate({ _max: { sortOrder: true } })
    const sortOrder = (maxRow._max.sortOrder ?? -1) + 1
    let row
    try {
      row = await prisma.shopCategory.create({
        data: { name, slug, sortOrder },
      })
    } catch (e: unknown) {
      if (
        typeof e === "object" &&
        e !== null &&
        "code" in e &&
        (e as { code: string }).code === "P2002"
      ) {
        return NextResponse.json(
          { error: "A category with that name or slug already exists." },
          { status: 409 }
        )
      }
      throw e
    }
    return NextResponse.json({ slug: row.slug, name: row.name, sortOrder: row.sortOrder })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create category"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  const gate = await requirePortalSession(request)
  if (gate instanceof NextResponse) return gate
  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      { error: "DATABASE_URL is required to manage categories." },
      { status: 503 }
    )
  }
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get("slug")?.trim().toLowerCase()
  if (!slug) {
    return NextResponse.json({ error: "slug query parameter is required." }, { status: 400 })
  }
  try {
    const row = await prisma.shopCategory.findUnique({ where: { slug } })
    if (!row) {
      return NextResponse.json({ error: "Category not found." }, { status: 404 })
    }
    const inUse = await isCategoryNameInUseOnStripe(row.name)
    if (inUse) {
      return NextResponse.json(
        { error: "Cannot delete: at least one active product uses this category." },
        { status: 409 }
      )
    }
    await prisma.shopCategory.delete({ where: { slug } })
    return NextResponse.json({ ok: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to delete category"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
