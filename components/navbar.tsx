"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ShoppingBag, Search, Menu, X, User, ChevronDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const shopCategories = [
  { label: "Rare Plants", href: "/#shop" },
  { label: "Tissue Culture", href: "/#shop" },
  { label: "Substrate & Pots", href: "/#shop" },
]

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [shopDropdownOpen, setShopDropdownOpen] = useState(false)

  useEffect(() => {
    if (!mobileOpen) setShopDropdownOpen(false)
  }, [mobileOpen])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <nav className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between lg:h-20">
          {/* Mobile menu button */}
          <button
            type="button"
            className="lg:hidden text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <div className="hidden lg:flex items-center gap-8">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-sans tracking-wide text-foreground hover:text-accent transition-colors uppercase outline-none">
                Shop
                <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="min-w-[180px]">
                {shopCategories.map((cat) => (
                  <DropdownMenuItem key={cat.label} asChild>
                    <Link href={cat.href} className="font-sans uppercase cursor-pointer">
                      {cat.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Link
              href="/about"
              className="text-sm font-sans tracking-wide text-foreground hover:text-accent transition-colors uppercase"
            >
              About
            </Link>
            <Link
              href="/shipping"
              className="text-sm font-sans tracking-wide text-foreground hover:text-accent transition-colors uppercase"
            >
              Shipping & FAQs
            </Link>
          </div>

          <Link href="/" className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center">
            <Image
              src="/images/logo.png"
              alt="Azure Botanicals"
              width={180}
              height={60}
              className="h-12 w-auto lg:h-14"
              priority
            />
          </Link>

          {/* Right nav */}
          <div className="flex items-center gap-5">
            <button type="button" aria-label="Search" className="text-foreground hover:text-accent transition-colors">
              <Search className="h-4 w-4 lg:h-[18px] lg:w-[18px]" />
            </button>
            <button type="button" aria-label="Account" className="hidden lg:block text-foreground hover:text-accent transition-colors">
              <User className="h-[18px] w-[18px]" />
            </button>
            <button type="button" aria-label="Shopping bag" className="relative text-foreground hover:text-accent transition-colors">
              <ShoppingBag className="h-4 w-4 lg:h-[18px] lg:w-[18px]" />
              <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-sans font-medium text-accent-foreground">
                0
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-border/50 bg-background/95 backdrop-blur-md">
          <div className="flex flex-col gap-1 px-6 py-6">
            <div>
              <button
                type="button"
                onClick={() => setShopDropdownOpen(!shopDropdownOpen)}
                className="flex w-full items-center justify-between py-3 text-sm font-sans tracking-wide text-foreground hover:text-accent transition-colors uppercase"
              >
                Shop
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${shopDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>
              {shopDropdownOpen && (
                <div className="flex flex-col gap-0 pl-3 pb-2">
                  {shopCategories.map((cat) => (
                    <Link
                      key={cat.label}
                      href={cat.href}
                      className="py-2.5 text-sm font-sans text-muted-foreground hover:text-accent transition-colors"
                      onClick={() => setMobileOpen(false)}
                    >
                      {cat.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <Link
              href="/about"
              className="py-3 text-sm font-sans tracking-wide text-foreground hover:text-accent transition-colors uppercase"
              onClick={() => setMobileOpen(false)}
            >
              About
            </Link>
            <Link
              href="/shipping"
              className="py-3 text-sm font-sans tracking-wide text-foreground hover:text-accent transition-colors uppercase"
              onClick={() => setMobileOpen(false)}
            >
              Shipping & FAQs
            </Link>
            <Link
              href="/contact"
              className="py-3 text-sm font-sans tracking-wide text-foreground hover:text-accent transition-colors uppercase"
              onClick={() => setMobileOpen(false)}
            >
              Contact
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
