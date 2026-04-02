"use client"

import { FormEvent, useEffect, useMemo, useState } from "react"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js"
import { useCart } from "@/contexts/cart-context"

type CheckoutIntent = {
  clientSecret: string
  publishableKey: string
  stripeAccountId?: string
  checkoutMode?: "platform_only" | "connect_direct_charge"
}

function CheckoutInner({ onPaid }: { onPaid: () => void }) {
  const stripe = useStripe()
  const elements = useElements()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [elementReady, setElementReady] = useState(false)

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (!stripe || !elements) return
    setSubmitting(true)
    setError(null)

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/success`,
      },
      redirect: "if_required",
    })

    if (result.error) {
      setError(result.error.message || "Payment failed.")
      setSubmitting(false)
      return
    }

    onPaid()
    window.location.href = "/success"
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <PaymentElement
        onReady={() => {
          setElementReady(true)
          setError(null)
        }}
        onLoadError={() => {
          setElementReady(false)
          setError(
            "Payment form could not load for this connected account. Complete onboarding and enable card payments on the connected account, then try again."
          )
        }}
      />
      {error && <p className="font-sans text-sm text-destructive">{error}</p>}
      <button
        type="submit"
        disabled={!stripe || !elements || !elementReady || submitting}
        className="w-full py-3 rounded-md bg-primary text-primary-foreground font-sans text-sm hover:bg-primary/90 disabled:opacity-50"
      >
        {submitting ? "Processing..." : "Pay now"}
      </button>
    </form>
  )
}

export function CheckoutForm() {
  const { items, total, clear } = useCart()
  const [intent, setIntent] = useState<CheckoutIntent | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (items.length === 0) {
      setLoading(false)
      return
    }

    fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lineItems: items.map((item) => ({ priceId: item.priceId, quantity: item.quantity })),
      }),
    })
      .then(async (res) => {
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || "Failed to initialize checkout.")
        setIntent({
          clientSecret: data.clientSecret,
          publishableKey: data.publishableKey,
          stripeAccountId: data.stripeAccountId,
          checkoutMode: data.checkoutMode,
        })
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to initialize checkout."))
      .finally(() => setLoading(false))
  }, [items])

  const stripePromise = useMemo(() => {
    if (!intent?.publishableKey) return null
    if (intent.checkoutMode === "connect_direct_charge" && intent.stripeAccountId) {
      return loadStripe(intent.publishableKey, {
        stripeAccount: intent.stripeAccountId,
      })
    }
    return loadStripe(intent.publishableKey)
  }, [intent?.publishableKey, intent?.checkoutMode, intent?.stripeAccountId])

  if (items.length === 0) {
    return <p className="font-sans text-sm text-muted-foreground">Your bag is empty.</p>
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <section className="rounded-lg border border-border bg-card p-6">
        <h2 className="font-serif text-2xl tracking-tight mb-4">Order</h2>
        <ul className="space-y-3 mb-4">
          {items.map((item) => (
            <li key={item.priceId} className="flex justify-between font-sans text-sm">
              <span>
                {item.name} x {item.quantity}
              </span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </li>
          ))}
        </ul>
        <div className="border-t border-border pt-3 flex justify-between font-sans text-sm font-medium">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </section>

      <section className="rounded-lg border border-border bg-card p-6">
        <h2 className="font-serif text-2xl tracking-tight mb-4">Payment</h2>
        {loading && <p className="font-sans text-sm text-muted-foreground">Loading payment form...</p>}
        {error && <p className="font-sans text-sm text-destructive">{error}</p>}
        {intent && stripePromise && (
          <Elements stripe={stripePromise} options={{ clientSecret: intent.clientSecret }}>
            <CheckoutInner onPaid={clear} />
          </Elements>
        )}
      </section>
    </div>
  )
}
