import { CheckoutForm } from "@/components/checkout-form"

export default function CheckoutPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 lg:px-8 py-12">
      <p className="font-sans text-xs tracking-[0.2em] uppercase text-accent mb-2">Checkout</p>
      <h1 className="font-serif text-3xl tracking-tight mb-8">Complete your order</h1>
      <CheckoutForm />
    </main>
  )
}
