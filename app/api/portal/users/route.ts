import { NextResponse } from "next/server"
import { isValidEmailShape, normalizeEmail } from "@/lib/portal-crypto"
import { isDatabaseConfigured, prisma } from "@/lib/prisma"
import { requirePortalSession } from "@/lib/require-portal-session"

export async function GET(request: Request) {
  const gate = await requirePortalSession(request)
  if (gate instanceof NextResponse) return gate
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ error: "DATABASE_URL is required." }, { status: 503 })
  }
  const rows = await prisma.portalAllowedEmail.findMany({
    orderBy: { createdAt: "asc" },
  })
  return NextResponse.json({
    selfEmail: gate.emailNorm,
    users: rows.map((r) => ({
      id: r.id,
      email: r.emailNorm,
      createdAt: r.createdAt.toISOString(),
    })),
  })
}

export async function POST(request: Request) {
  const gate = await requirePortalSession(request)
  if (gate instanceof NextResponse) return gate
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ error: "DATABASE_URL is required." }, { status: 503 })
  }
  let body: { email?: unknown }
  try {
    body = (await request.json()) as { email?: unknown }
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 })
  }
  const raw = typeof body.email === "string" ? body.email.trim() : ""
  if (!isValidEmailShape(raw)) {
    return NextResponse.json({ error: "A valid email address is required." }, { status: 400 })
  }
  const emailNorm = normalizeEmail(raw)
  try {
    const row = await prisma.portalAllowedEmail.create({
      data: { emailNorm },
    })
    return NextResponse.json({
      user: {
        id: row.id,
        email: row.emailNorm,
        createdAt: row.createdAt.toISOString(),
      },
    })
  } catch (e: unknown) {
    if (
      typeof e === "object" &&
      e !== null &&
      "code" in e &&
      (e as { code: string }).code === "P2002"
    ) {
      return NextResponse.json({ error: "That email is already allowed." }, { status: 409 })
    }
    const message = e instanceof Error ? e.message : "Failed to add user."
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  const gate = await requirePortalSession(request)
  if (gate instanceof NextResponse) return gate
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ error: "DATABASE_URL is required." }, { status: 503 })
  }
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")?.trim()
  if (!id) {
    return NextResponse.json({ error: "id query parameter is required." }, { status: 400 })
  }
  const total = await prisma.portalAllowedEmail.count()
  if (total <= 1) {
    return NextResponse.json(
      {
        error:
          "At least one portal user is required. Add another email before removing this one.",
      },
      { status: 409 }
    )
  }
  const row = await prisma.portalAllowedEmail.findUnique({ where: { id } })
  if (!row) {
    return NextResponse.json({ error: "User not found." }, { status: 404 })
  }
  await prisma.portalAllowedEmail.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
