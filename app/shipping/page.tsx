import { ShippingFaqContent } from "./shipping-faq-content"

export const metadata = {
  title: "Shipping & FAQs | Azure Botanicals",
  description: "Shipping information and frequently asked questions for Azure Botanicals.",
}

export default function ShippingPage() {
  return (
    <div className="py-24 lg:py-32">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        <p className="font-sans text-xs tracking-[0.3em] uppercase text-accent mb-4">
          Support
        </p>
        <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl tracking-tight">
          Shipping & FAQs
        </h1>

        <div className="mt-8 p-4 bg-secondary/40 border border-border">
          <p className="font-sans text-sm text-foreground">
            Before you checkout, please take a moment to read the information below.
          </p>
        </div>

        <div className="mt-12">
          <ShippingFaqContent />
        </div>
      </div>
    </div>
  )
}
