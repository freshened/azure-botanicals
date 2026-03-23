import Link from "next/link"
import { CountdownForm } from "@/components/countdown-form"
import { PortalExtraImages } from "@/components/portal-extra-images"
import { PortalProductsManager } from "@/components/portal-products-manager"

export default function PortalPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-8 py-12">
      <p className="font-sans text-xs tracking-[0.2em] uppercase text-accent mb-2">
        Admin
      </p>
      <h2 className="font-serif text-2xl lg:text-3xl tracking-tight mb-8">
        Dashboard
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="font-sans text-sm font-medium tracking-wide text-foreground mb-2">
            Overview
          </h3>
          <p className="font-sans text-sm text-muted-foreground">
            Site stats and activity will appear here.
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="font-sans text-sm font-medium tracking-wide text-foreground mb-2">
            Content
          </h3>
          <p className="font-sans text-sm text-muted-foreground mb-4">
            Manage products, collections, and copy.
          </p>
          <Link
            href="/#shop"
            className="font-sans text-xs text-accent hover:underline"
          >
            View shop →
          </Link>
        </div>
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="font-sans text-sm font-medium tracking-wide text-foreground mb-2">
            Settings
          </h3>
          <p className="font-sans text-sm text-muted-foreground">
            Banner, policies, and site settings (coming later).
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-6 md:col-span-2 lg:col-span-1">
          <h3 className="font-sans text-sm font-medium tracking-wide text-foreground mb-2">
            New plant drop countdown
          </h3>
          <p className="font-sans text-sm text-muted-foreground mb-4">
            Set the date and time shown in the banner countdown.
          </p>
          <CountdownForm />
        </div>
        <div className="rounded-lg border border-border bg-card p-6 md:col-span-2">
          <h3 className="font-sans text-sm font-medium tracking-wide text-foreground mb-2">
            Product manager
          </h3>
          <p className="font-sans text-sm text-muted-foreground mb-4">
            Create, edit, search, and archive products.
          </p>
          <PortalProductsManager />
        </div>
        <div className="rounded-lg border border-border bg-card p-6 md:col-span-2">
          <h3 className="font-sans text-sm font-medium tracking-wide text-foreground mb-2">
            Extra product images
          </h3>
          <p className="font-sans text-sm text-muted-foreground mb-4">
            Add image URLs to Stripe products for your storefront catalog.
          </p>
          <PortalExtraImages />
        </div>
      </div>
    </div>
  )
}
