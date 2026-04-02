import Link from "next/link"
import { PortalSidebar } from "@/components/portal-sidebar"
import { Menu } from "lucide-react"

export function PortalShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen min-w-0 max-w-[100vw] overflow-x-hidden bg-gradient-to-br from-background via-card/40 to-muted/20">
      <PortalSidebar />
      <div className="flex-1 flex flex-col min-w-0 max-w-full overflow-x-hidden">
        <header className="lg:hidden border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-40">
          <div className="flex items-center justify-between px-4 py-3">
            <Link href="/portal" className="font-serif text-lg tracking-tight">
              Admin
            </Link>
            <details className="relative">
              <summary className="list-none cursor-pointer p-2 rounded-md border border-border">
                <Menu className="h-5 w-5" />
              </summary>
              <div className="absolute right-0 mt-1 w-48 rounded-lg border border-border bg-card shadow-lg py-1 z-50">
                <Link href="/portal" className="block px-4 py-2 font-sans text-sm hover:bg-muted">
                  Overview
                </Link>
                <Link href="/portal/products" className="block px-4 py-2 font-sans text-sm hover:bg-muted">
                  Products
                </Link>
                <Link href="/portal/settings" className="block px-4 py-2 font-sans text-sm hover:bg-muted">
                  Settings
                </Link>
                <Link href="/" className="block px-4 py-2 font-sans text-sm text-accent border-t border-border">
                  Back to site
                </Link>
              </div>
            </details>
          </div>
        </header>
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 xl:p-10 w-full max-w-full mx-auto">{children}</main>
      </div>
    </div>
  )
}
