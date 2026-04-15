import { NextResponse } from "next/server"
import { isDatabaseConfigured, prisma } from "@/lib/prisma"
import { requirePortalSession } from "@/lib/require-portal-session"

export const dynamic = "force-dynamic"

const NO_STORE = { "Cache-Control": "no-store, max-age=0" } as const

const DEFAULT_TARGET = "2026-03-15T12:00:00"
const COUNTDOWN_ID = "default"

let storedTarget: string | null = null
let countdownEnabled = true

export async function GET() {
  if (isDatabaseConfigured()) {
    try {
      const row = await prisma.siteCountdown.findUnique({
        where: { id: COUNTDOWN_ID },
      })
      if (row) {
        return NextResponse.json(
          {
            target: row.targetIso,
            countdownEnabled: Boolean(row.countdownEnabled),
          },
          { headers: NO_STORE }
        )
      }
    } catch {
      // fall through
    }
  }
  const target = storedTarget ?? DEFAULT_TARGET
  return NextResponse.json(
    { target, countdownEnabled: Boolean(countdownEnabled) },
    { headers: NO_STORE }
  )
}

export async function POST(request: Request) {
  try {
    const gate = await requirePortalSession(request)
    if (gate instanceof NextResponse) return gate
    const body = await request.json()
    const targetRaw = typeof body?.target === "string" ? body.target.trim() : null
    const hasEnabled = typeof body?.countdownEnabled === "boolean"

    if (!targetRaw && !hasEnabled) {
      return NextResponse.json(
        { error: "Provide target (ISO date) and/or countdownEnabled." },
        { status: 400 }
      )
    }

    let nextTarget = storedTarget ?? DEFAULT_TARGET
    let nextEnabled = countdownEnabled

    if (isDatabaseConfigured()) {
      try {
        const existing = await prisma.siteCountdown.findUnique({
          where: { id: COUNTDOWN_ID },
        })
        if (existing) {
          nextTarget = existing.targetIso
          nextEnabled = existing.countdownEnabled
        }
      } catch {
        // use module fallbacks
      }
    }

    if (hasEnabled) {
      nextEnabled = body.countdownEnabled
    }

    if (targetRaw) {
      const date = new Date(targetRaw)
      if (Number.isNaN(date.getTime())) {
        return NextResponse.json({ error: "invalid date" }, { status: 400 })
      }
      nextTarget = date.toISOString().slice(0, 19)
    }

    if (isDatabaseConfigured()) {
      try {
        await prisma.siteCountdown.upsert({
          where: { id: COUNTDOWN_ID },
          create: {
            id: COUNTDOWN_ID,
            targetIso: nextTarget,
            countdownEnabled: nextEnabled,
          },
          update: {
            targetIso: nextTarget,
            countdownEnabled: nextEnabled,
          },
        })
        return NextResponse.json(
          {
            target: nextTarget,
            countdownEnabled: Boolean(nextEnabled),
          },
          { headers: NO_STORE }
        )
      } catch {
        // fall through to memory
      }
    }

    storedTarget = nextTarget
    countdownEnabled = nextEnabled
    return NextResponse.json(
      {
        target: storedTarget ?? DEFAULT_TARGET,
        countdownEnabled: Boolean(countdownEnabled),
      },
      { headers: NO_STORE }
    )
  } catch {
    return NextResponse.json({ error: "invalid request" }, { status: 400 })
  }
}
