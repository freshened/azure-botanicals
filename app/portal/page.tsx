import Link from "next/link"

export default function PortalPage() {
  return (
    <div className="space-y-10">
      <div>
        <p className="font-sans text-xs tracking-[0.2em] uppercase text-accent mb-2">Dashboard</p>
        <h1 className="font-serif text-2xl lg:text-3xl tracking-tight">Overview</h1>
        <p className="font-sans text-sm text-muted-foreground mt-2 max-w-lg">
          Manage products and site settings from the sidebar.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <Link
          href="/portal/products"
          className="group rounded-2xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md hover:border-accent/30"
        >
          <h2 className="font-sans text-sm font-medium tracking-wide text-foreground mb-2">
            Products
          </h2>
          <p className="font-sans text-sm text-muted-foreground mb-4">
            Create and edit catalog items, prices, and gallery images.
          </p>
          <span className="font-sans text-xs text-accent group-hover:underline">Open →</span>
        </Link>
        <Link
          href="/portal/settings"
          className="group rounded-2xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md hover:border-accent/30"
        >
          <h2 className="font-sans text-sm font-medium tracking-wide text-foreground mb-2">
            Settings
          </h2>
          <p className="font-sans text-sm text-muted-foreground mb-4">
            Banner countdown visibility and date.
          </p>
          <span className="font-sans text-xs text-accent group-hover:underline">Open →</span>
        </Link>
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="font-sans text-sm font-medium tracking-wide text-foreground mb-2">
            Storefront
          </h2>
          <p className="font-sans text-sm text-muted-foreground mb-4">
            Preview how customers see the shop.
          </p>
          <Link href="/#shop" className="font-sans text-xs text-accent hover:underline">
            View shop →
          </Link>
        </div>
      </div>
    </div>
  )
}
