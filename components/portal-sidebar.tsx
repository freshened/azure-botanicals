"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Package, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

const nav = [
  { href: "/portal", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/portal/products", label: "Products", icon: Package, exact: false },
  { href: "/portal/settings", label: "Settings", icon: Settings, exact: false },
]

export function PortalSidebar() {
  const pathname = usePathname()

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
      <div className="p-4 border-t border-border">
        <Link
          href="/"
          className="font-sans text-xs text-accent hover:underline"
        >
          ← Back to site
        </Link>
      </div>
    </aside>
  )
}
