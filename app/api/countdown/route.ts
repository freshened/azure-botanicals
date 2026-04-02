import { NextResponse } from "next/server"

const DEFAULT_TARGET = "2026-03-15T12:00:00"

let storedTarget: string | null = null
let countdownEnabled = true

export function GET() {
  const target = storedTarget ?? DEFAULT_TARGET
  return NextResponse.json({ target, countdownEnabled })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const targetRaw = typeof body?.target === "string" ? body.target.trim() : null
    const hasEnabled = typeof body?.countdownEnabled === "boolean"

    if (!targetRaw && !hasEnabled) {
      return NextResponse.json(
        { error: "Provide target (ISO date) and/or countdownEnabled." },
        { status: 400 }
      )
    }

    if (hasEnabled) {
      countdownEnabled = body.countdownEnabled
    }

    if (targetRaw) {
      const date = new Date(targetRaw)
      if (Number.isNaN(date.getTime())) {
        return NextResponse.json(
          { error: "invalid date" },
          { status: 400 }
        )
      }
      storedTarget = date.toISOString().slice(0, 19)
    }

    return NextResponse.json({
      target: storedTarget ?? DEFAULT_TARGET,
      countdownEnabled,
    })
  } catch {
    return NextResponse.json(
      { error: "invalid request" },
      { status: 400 }
    )
  }
}
