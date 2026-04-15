"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, LogOut, Package, Settings, Tags } from "lucide-react"
import { usePortalSignOut } from "@/components/use-portal-sign-out"
import { cn } from "@/lib/utils"

const nav = [
  { href: "/portal", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/portal/products", label: "Products", icon: Package, exact: false },
  { href: "/portal/catalog", label: "Catalog", icon: Tags, exact: false },
  { href: "/portal/settings", label: "Settings", icon: Settings, exact: false },
]

export function PortalSidebar() {
  const pathname = usePathname()
  const signOut = usePortalSignOut()

  const active = (href: string, exact: boolean) => {
    if (exact) return pathname === href
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  return (
    <aside className="hidden lg:flex w-52 xl:w-56 shrink-0 flex-col border-r border-border bg-card min-h-screen sticky top-0">
      <div className="p-6 border-b border-border">
        <p className="font-serif text-lg tracking-tight text-foreground">Azure</p>
        <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-muted-foreground mt-0.5">
          Admin
        </p>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {nav.map((item) => {
          const Icon = item.icon
          const isOn = active(item.href, item.exact)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 font-sans text-sm transition-colors",
                isOn
                  ? "bg-primary/10 text-foreground font-medium"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4 shrink-0 opacity-80" />
              {item.label}
            </Link>
          )
        })}
      </nav>
      <div className="p-4 border-t border-border space-y-2">
        <button
          type="button"
          onClick={() => void signOut()}
          className="flex items-center gap-2 w-full rounded-lg px-3 py-2 font-sans text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <LogOut className="h-4 w-4 shrink-0 opacity-80" />
          Sign out
        </button>
        <Link href="/" className="block font-sans text-xs text-accent hover:underline px-3">
          ← Back to site
        </Link>
      </div>
    </aside>
  )
}
