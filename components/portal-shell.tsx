import Link from "next/link"
import { PortalMobileMenu } from "@/components/portal-mobile-menu"
import { PortalSidebar } from "@/components/portal-sidebar"

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
            <PortalMobileMenu />
          </div>
        </header>
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 xl:p-10 w-full max-w-full mx-auto">{children}</main>
      </div>
    </div>
  )
}
