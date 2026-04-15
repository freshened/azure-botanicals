"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"

type State = "no_intent" | "pending" | "paid" | "failed" | "unknown"

export function SuccessOrderStatus() {
  const params = useSearchParams()
  const paymentIntentId = params.get("payment_intent")?.trim() || ""
  const [state, setState] = useState<State>(paymentIntentId ? "pending" : "no_intent")
  const [orderId, setOrderId] = useState<string | null>(null)

  useEffect(() => {
    if (!paymentIntentId) return
    let stop = false
    let tries = 0
    const maxTries = 20
    const run = async () => {
      if (stop) return
      tries += 1
      try {
        const res = await fetch(
          `/api/checkout/status?payment_intent=${encodeURIComponent(paymentIntentId)}`
        )
        const data = await res.json()
        if (!res.ok) throw new Error(data?.error || "Unable to verify order.")
        if (data?.status === "paid") {
          setState("paid")
          setOrderId(typeof data.orderId === "string" ? data.orderId : null)
          return
        }
        if (data?.status === "failed") {
          setState("failed")
          return
        }
        setState("pending")
      } catch {
        setState("unknown")
      }
      if (tries < maxTries && !stop) {
        setTimeout(run, 1500)
      }
    }
    run()
    return () => {
      stop = true
    }
  }, [paymentIntentId])

  if (state === "paid") {
    return (
      <p className="mt-3 font-sans text-sm text-muted-foreground">
        Order confirmed{orderId ? ` · ${orderId}` : ""}. We are preparing your shipment.
      </p>
    )
  }
  if (state === "failed") {
    return (
      <p className="mt-3 font-sans text-sm text-destructive">
        Payment was not completed. Please try checkout again.
      </p>
    )
  }
  if (state === "pending") {
    return (
      <p className="mt-3 font-sans text-sm text-muted-foreground">
        Payment received. Finalizing your order confirmation...
      </p>
    )
  }
  if (state === "unknown") {
    return (
      <p className="mt-3 font-sans text-sm text-muted-foreground">
        Payment received. We are syncing your order now. If this message remains, contact support.
      </p>
    )
  }
  return null
}
