import { NextResponse } from "next/server"
import {
  emailRateLimitKey,
  generateOtpSalt,
  generateSixDigitCode,
  hashOtpCode,
  isValidEmailShape,
  normalizeEmail,
} from "@/lib/portal-crypto"
import { isSmtpConfigured, sendPortalOtpEmail } from "@/lib/portal-mail"
import { getPortalAuthSecretBytes } from "@/lib/portal-session"
import { isDatabaseConfigured, prisma } from "@/lib/prisma"

const REQUESTS_PER_HOUR = 12
const MIN_DELAY_MS = 400

const SAME_RESPONSE = {
  ok: true as const,
  message:
    "If that address can receive a sign-in code, an email was sent. It may take a minute to arrive.",
}

export async function POST(request: Request) {
  const start = Date.now()
  try {
    getPortalAuthSecretBytes()
  } catch (e) {
    const message = e instanceof Error ? e.message : "Server misconfiguration."
    return NextResponse.json({ error: message }, { status: 500 })
  }

  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      { error: "Database is not configured. Portal sign-in requires DATABASE_URL." },
      { status: 503 }
    )
  }

  if (!isSmtpConfigured()) {
    return NextResponse.json(
      { error: "Email is not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, and SMTP_FROM." },
      { status: 503 }
    )
  }

  let body: { email?: unknown }
  try {
    body = (await request.json()) as { email?: unknown }
  } catch {
    await delayToMin(start)
    return NextResponse.json(SAME_RESPONSE)
  }

  const rawEmail = typeof body.email === "string" ? body.email : ""
  if (!isValidEmailShape(rawEmail)) {
    await delayToMin(start)
    return NextResponse.json(SAME_RESPONSE)
  }

  const emailNorm = normalizeEmail(rawEmail)
  const secret = process.env.PORTAL_AUTH_SECRET!.trim()
  const emailKey = emailRateLimitKey(secret, emailNorm)

  await prisma.portalAuthRequestLog.create({
    data: { emailKey },
  })

  const hourAgo = new Date(Date.now() - 60 * 60 * 1000)
  const recent = await prisma.portalAuthRequestLog.count({
    where: { emailKey, createdAt: { gte: hourAgo } },
  })

  if (recent > REQUESTS_PER_HOUR) {
    await delayToMin(start)
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    )
  }

  const allowed = await prisma.portalAllowedEmail.findUnique({
    where: { emailNorm },
  })

  if (!allowed) {
    await delayToMin(start)
    return NextResponse.json(SAME_RESPONSE)
  }

  await prisma.portalOtpChallenge.deleteMany({ where: { emailNorm } })

  const code = generateSixDigitCode()
  const salt = generateOtpSalt()
  const codeHash = await hashOtpCode(code, salt)
  const saltB64 = salt.toString("base64url")
  const hashB64 = codeHash.toString("base64url")
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

  await prisma.portalOtpChallenge.create({
    data: {
      emailNorm,
      codeHash: hashB64,
      saltB64,
      expiresAt,
    },
  })

  try {
    await sendPortalOtpEmail(emailNorm, code)
  } catch {
    await prisma.portalOtpChallenge.deleteMany({ where: { emailNorm } })
    await delayToMin(start)
    return NextResponse.json(
      { error: "We could not send email right now. Try again in a few minutes." },
      { status: 503 }
    )
  }

  await delayToMin(start)
  return NextResponse.json(SAME_RESPONSE)
}

async function delayToMin(start: number) {
  const elapsed = Date.now() - start
  const wait = MIN_DELAY_MS - elapsed
  if (wait > 0) {
    await new Promise((r) => setTimeout(r, wait))
  }
}
