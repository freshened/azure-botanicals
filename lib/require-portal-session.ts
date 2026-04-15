import { NextResponse } from "next/server"
import { readPortalTokenFromCookieHeader, verifyPortalSessionToken } from "@/lib/portal-session"

export async function requirePortalSession(request: Request) {
  try {
    const raw = readPortalTokenFromCookieHeader(request.headers.get("cookie"))
    if (!raw) {
      return NextResponse.json({ error: "Sign in required." }, { status: 401 })
    }
    const session = await verifyPortalSessionToken(raw)
    if (!session) {
      return NextResponse.json({ error: "Sign in required." }, { status: 401 })
    }
    return { emailNorm: session.emailNorm }
  } catch {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 })
  }
}
