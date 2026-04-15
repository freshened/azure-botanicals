"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import type { TaxonomyItem } from "@/lib/shop-taxonomy"

export function FooterShopLinks() {
  const [categories, setCategories] = useState<TaxonomyItem[]>([])

  useEffect(() => {
    fetch("/api/shop/taxonomy")
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d?.categories)) setCategories(d.categories)
      })
      .catch(() => {})
  }, [])

  const links = [
    { label: "Shop all", href: "/shop" },
    ...categories.map((c) => ({
      label: c.name,
      href: `/shop?category=${encodeURIComponent(c.slug)}`,
    })),
  ]

  return (
    <ul className="space-y-3">
      {links.map((link) => (
        <li key={link.href + link.label}>
          <Link
            href={link.href}
            className="font-sans text-sm text-muted-foreground hover:text-accent transition-colors"
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  )
}
