import { NextResponse } from "next/server"
import {
  isValidEmailShape,
  normalizeEmail,
  verifyOtpCode,
} from "@/lib/portal-crypto"
import {
  PORTAL_SESSION_COOKIE,
  portalSessionCookieMaxAge,
  signPortalSessionToken,
} from "@/lib/portal-session"
import { isDatabaseConfigured, prisma } from "@/lib/prisma"

const FAIL = { error: "Invalid or expired code." as const }
const MAX_ATTEMPTS = 5
const MIN_MS = 350

export async function POST(request: Request) {
  const started = Date.now()
  if (!isDatabaseConfigured()) {
    await stall(started)
    return NextResponse.json({ error: "Database is not configured." }, { status: 503 })
  }

  let body: { email?: unknown; code?: unknown }
  try {
    body = (await request.json()) as { email?: unknown; code?: unknown }
  } catch {
    await stall(started)
    return NextResponse.json(FAIL, { status: 400 })
  }

  const rawEmail = typeof body.email === "string" ? body.email : ""
  const rawCode = typeof body.code === "string" ? body.code.trim().replace(/\s/g, "") : ""

  if (!isValidEmailShape(rawEmail) || !/^\d{6}$/.test(rawCode)) {
    await stall(started)
    return NextResponse.json(FAIL, { status: 400 })
  }

  const emailNorm = normalizeEmail(rawEmail)

  const challenge = await prisma.portalOtpChallenge.findFirst({
    where: { emailNorm, expiresAt: { gt: new Date() } },
    orderBy: { createdAt: "desc" },
  })

  if (!challenge) {
    await stall(started)
    return NextResponse.json(FAIL, { status: 400 })
  }

  if (challenge.attemptCount >= MAX_ATTEMPTS) {
    await prisma.portalOtpChallenge.delete({ where: { id: challenge.id } })
    await stall(started)
    return NextResponse.json(FAIL, { status: 400 })
  }

  const ok = await verifyOtpCode(rawCode, challenge.saltB64, challenge.codeHash)
  if (!ok) {
    await prisma.portalOtpChallenge.update({
      where: { id: challenge.id },
      data: { attemptCount: { increment: 1 } },
    })
    await stall(started)
    return NextResponse.json(FAIL, { status: 400 })
  }

  await prisma.portalOtpChallenge.deleteMany({ where: { emailNorm } })

  let token: string
  try {
    token = await signPortalSessionToken(emailNorm)
  } catch (e) {
    const message = e instanceof Error ? e.message : "Server misconfiguration."
    await stall(started)
    return NextResponse.json({ error: message }, { status: 500 })
  }

  await stall(started)
  const res = NextResponse.json({ ok: true })
  res.cookies.set(PORTAL_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: portalSessionCookieMaxAge(),
  })
  return res
}

async function stall(started: number) {
  const elapsed = Date.now() - started
  const wait = MIN_MS - elapsed
  if (wait > 0) {
    await new Promise((r) => setTimeout(r, wait))
  }
}
