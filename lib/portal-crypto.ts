import { createHmac, randomInt, randomBytes, scrypt, timingSafeEqual } from "node:crypto"
import { promisify } from "node:util"

const scryptAsync = promisify(scrypt)

const SCRYPT_PARAMS = { N: 16384, r: 8, p: 1, maxmem: 64 * 1024 * 1024 } as const

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

export function isValidEmailShape(email: string) {
  const e = normalizeEmail(email)
  if (e.length < 3 || e.length > 254) return false
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) return false
  return true
}

export function emailRateLimitKey(secret: string, emailNorm: string) {
  return createHmac("sha256", secret).update(`rl:${emailNorm}`).digest("hex")
}

export function generateOtpSalt() {
  return randomBytes(16)
}

export async function hashOtpCode(plain: string, salt: Buffer) {
  const buf = (await scryptAsync(plain, salt, 32, SCRYPT_PARAMS)) as Buffer
  return buf
}

export async function verifyOtpCode(plain: string, saltB64: string, expectedHashB64: string) {
  let salt: Buffer
  let expected: Buffer
  try {
    salt = Buffer.from(saltB64, "base64url")
    expected = Buffer.from(expectedHashB64, "base64url")
  } catch {
    return false
  }
  if (salt.length < 8 || expected.length < 16) return false
  const actual = (await scryptAsync(plain, salt, 32, SCRYPT_PARAMS)) as Buffer
  if (actual.length !== expected.length) return false
  return timingSafeEqual(actual, expected)
}

export function generateSixDigitCode() {
  return String(randomInt(100_000, 1_000_000))
}
