import { SuccessOrderStatus } from "@/components/success-order-status"

export default function SuccessPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 lg:px-8 py-16">
      <h1 className="font-serif text-3xl tracking-tight mb-3">Thanks for your purchase</h1>
      <p className="font-sans text-sm text-muted-foreground">
        Payment received. We are confirming your order details now.
      </p>
      <SuccessOrderStatus />
    </main>
  )
}
