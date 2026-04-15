import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { readPortalTokenFromCookieHeader, verifyPortalSessionToken } from "@/lib/portal-session"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (!pathname.startsWith("/portal")) {
    return NextResponse.next()
  }

  let session: { emailNorm: string } | null = null
  const token = readPortalTokenFromCookieHeader(request.headers.get("cookie"))
  if (token) {
    try {
      session = await verifyPortalSessionToken(token)
    } catch {
      session = null
    }
  }

  if (pathname === "/portal/login") {
    if (session) {
      return NextResponse.redirect(new URL("/portal", request.url))
    }
    return NextResponse.next()
  }

  if (!session) {
    return NextResponse.redirect(new URL("/portal/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/portal", "/portal/:path*"],
}
