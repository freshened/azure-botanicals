import { NextResponse } from "next/server"

export async function POST() {
  return NextResponse.json(
    { error: "This endpoint has been removed from the portal flow." },
    { status: 410 }
  )
}
