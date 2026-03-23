import { NextResponse } from "next/server"

const DEFAULT_TARGET = "2026-03-15T12:00:00"

let storedTarget: string | null = null

export function GET() {
  const target = storedTarget ?? DEFAULT_TARGET
  return NextResponse.json({ target })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const target = typeof body?.target === "string" ? body.target.trim() : null
    if (!target) {
      return NextResponse.json(
        { error: "target is required (ISO date string)" },
        { status: 400 }
      )
    }
    const date = new Date(target)
    if (Number.isNaN(date.getTime())) {
      return NextResponse.json(
        { error: "invalid date" },
        { status: 400 }
      )
    }
    storedTarget = date.toISOString().slice(0, 19)
    return NextResponse.json({ target: storedTarget })
  } catch {
    return NextResponse.json(
      { error: "invalid request" },
      { status: 400 }
    )
  }
}
