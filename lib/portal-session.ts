import { SignJWT, jwtVerify } from "jose"

export const PORTAL_SESSION_COOKIE = "ab_portal_session"

const SESSION_MAX_AGE_SEC = 7 * 24 * 60 * 60

export function getPortalAuthSecretBytes() {
  const s = process.env.PORTAL_AUTH_SECRET?.trim()
  if (!s || s.length < 32) {
    throw new Error(
      "PORTAL_AUTH_SECRET must be set to at least 32 characters (use a long random string in production)."
    )
  }
  return new TextEncoder().encode(s)
}

export async function signPortalSessionToken(emailNorm: string) {
  const key = getPortalAuthSecretBytes()
  return new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(emailNorm)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(key)
}

export async function verifyPortalSessionToken(token: string) {
  const key = getPortalAuthSecretBytes()
  const { payload } = await jwtVerify(token, key, { algorithms: ["HS256"] })
  const sub = typeof payload.sub === "string" ? payload.sub.trim() : ""
  if (!sub) return null
  return { emailNorm: sub }
}

export function portalSessionCookieMaxAge() {
  return SESSION_MAX_AGE_SEC
}

export function readPortalTokenFromCookieHeader(cookieHeader: string | null) {
  if (!cookieHeader) return null
  const parts = cookieHeader.split(";")
  for (const part of parts) {
    const [name, ...rest] = part.trim().split("=")
    if (name === PORTAL_SESSION_COOKIE && rest.length > 0) {
      return decodeURIComponent(rest.join("=").trim())
    }
  }
  return null
}
