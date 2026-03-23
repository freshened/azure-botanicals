import Link from "next/link"

export const metadata = {
  title: "Portal | Azure Botanicals",
  description: "Site admin dashboard for Azure Botanicals.",
}

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-[60vh]">
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="font-serif text-xl tracking-tight">Portal</h1>
          <Link
            href="/"
            className="font-sans text-sm text-muted-foreground hover:text-accent transition-colors"
          >
            Back to site
          </Link>
        </div>
      </div>
      {children}
    </div>
  )
}
