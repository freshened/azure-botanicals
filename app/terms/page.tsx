export const metadata = {
  title: "Terms of Service | Azure Botanicals",
  description: "Terms of service for Azure Botanicals.",
}

export default function TermsPage() {
  return (
    <div className="py-24 lg:py-32">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        <p className="font-sans text-xs tracking-[0.3em] uppercase text-accent mb-4">
          Legal
        </p>
        <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl tracking-tight">
          Terms of Service
        </h1>
        <div className="mt-10 space-y-6 font-sans text-base leading-relaxed text-muted-foreground">
          <p>
            By using this website and placing orders, you agree to these terms. Azure Botanicals reserves the right to update these terms at any time.
          </p>
          <p>
            All product descriptions and imagery are for illustration. We do our best to represent plants accurately but natural variation may occur.
          </p>
          <p>
            Prices and availability are subject to change. We reserve the right to limit quantities and to refuse or cancel orders.
          </p>
          <p>
            For shipping, returns, and cancellations, please see our Shipping & FAQs and Refund & Cancellation Policy pages.
          </p>
        </div>
      </div>
    </div>
  )
}
