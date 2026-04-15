import { PortalProductsManager } from "@/components/portal-products-manager"

export const metadata = {
  title: "Products | Azure Botanicals",
}

export default function PortalProductsPage() {
  return (
    <div className="space-y-6 sm:space-y-8 min-w-0 max-w-full">
      <div className="min-w-0">
        <p className="font-sans text-xs tracking-[0.2em] uppercase text-accent mb-2">Catalog</p>
        <h1 className="font-serif text-2xl lg:text-3xl tracking-tight">Products</h1>
        <p className="font-sans text-sm text-muted-foreground mt-2 max-w-xl">
          Create, edit, and archive products. Main image is stored on Stripe; additional gallery images are stored in your database.
        </p>
      </div>
      <PortalProductsManager />
    </div>
  )
}
