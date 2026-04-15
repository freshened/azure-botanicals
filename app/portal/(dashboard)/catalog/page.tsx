import { PortalCatalogTaxonomy } from "@/components/portal-catalog-taxonomy"

export const metadata = {
  title: "Catalog | Azure Botanicals",
}

export default function PortalCatalogPage() {
  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <p className="font-sans text-xs tracking-[0.2em] uppercase text-accent mb-2">Catalog</p>
        <h1 className="font-serif text-2xl lg:text-3xl tracking-tight">Categories &amp; tags</h1>
        <p className="font-sans text-sm text-muted-foreground mt-2 max-w-xl">
          Manage what appears in the storefront filters and navbar. Products reference these by exact name.
        </p>
      </div>
      <PortalCatalogTaxonomy />
    </div>
  )
}
