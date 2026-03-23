import Stripe from "stripe"

// Pin the Stripe API version used by this demo so requests are stable over time.
export const STRIPE_API_VERSION: Stripe.LatestApiVersion = "2026-02-25.clover"

// Create one reusable Stripe client for all Connect sample routes.
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: STRIPE_API_VERSION,
})

export function requireStripeSecretKey() {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key || key.includes("__REPLACE_WITH_STRIPE_SECRET_KEY__")) {
    throw new Error(
      "Missing STRIPE_SECRET_KEY. Add it to your environment configuration before using Stripe routes."
    )
  }
}

export function getBaseUrl(request: Request) {
  return process.env.NEXT_PUBLIC_APP_URL || request.headers.get("origin") || "http://localhost:3000"
}

export function getApplicationFeeAmount() {
  const raw = process.env.STRIPE_CONNECT_APPLICATION_FEE_AMOUNT
  if (!raw) {
    return 123
  }

  const parsed = Number.parseInt(raw, 10)
  if (Number.isNaN(parsed) || parsed < 0) {
    throw new Error(
      "Invalid STRIPE_CONNECT_APPLICATION_FEE_AMOUNT. Use a non-negative integer amount in cents."
    )
  }

  return parsed
}

export function requireConnectedAccountId() {
  const accountId = process.env.STRIPE_CONNECTED_ACCOUNT_ID?.trim()
  if (!accountId) {
    throw new Error(
      "Missing STRIPE_CONNECTED_ACCOUNT_ID. Add your seller connected account ID to environment configuration."
    )
  }
  return accountId
}

export function getPlatformFeePercent() {
  const raw = process.env.STRIPE_PLATFORM_FEE_PERCENT
  if (!raw) return 2
  const parsed = Number.parseFloat(raw)
  if (!Number.isFinite(parsed) || parsed < 0 || parsed > 100) {
    throw new Error("Invalid STRIPE_PLATFORM_FEE_PERCENT. Use a number between 0 and 100.")
  }
  return parsed
}
