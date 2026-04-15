"use client"

import Link from "next/link"
import { Menu } from "lucide-react"
import { usePortalSignOut } from "@/components/use-portal-sign-out"

export function PortalMobileMenu() {
  const signOut = usePortalSignOut()

  return (
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
        <Link href="/portal/catalog" className="block px-4 py-2 font-sans text-sm hover:bg-muted">
          Catalog
        </Link>
        <Link href="/portal/settings" className="block px-4 py-2 font-sans text-sm hover:bg-muted">
          Settings
        </Link>
        <button
          type="button"
          onClick={() => void signOut()}
          className="w-full text-left block px-4 py-2 font-sans text-sm hover:bg-muted border-t border-border"
        >
          Sign out
        </button>
        <Link href="/" className="block px-4 py-2 font-sans text-sm text-accent border-t border-border">
          Back to site
        </Link>
      </div>
    </details>
  )
}
