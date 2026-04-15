"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ProductThumbImage } from "@/components/product-frame-image"
import { useRouter } from "next/navigation"
import { ShoppingBag, Search, Menu, X, User, ChevronDown } from "lucide-react"
import type { TaxonomyItem } from "@/lib/shop-taxonomy"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useCart } from "@/contexts/cart-context"

const shopNavFallback: { label: string; href: string }[] = [
  { label: "Shop all", href: "/shop" },
  { label: "Rare Plants", href: "/shop?category=rare-plants" },
  { label: "Tissue Culture", href: "/shop?category=tissue-culture" },
  { label: "Substrate & Pots", href: "/shop?category=substrate-pots" },
]

export function Navbar() {
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [shopDropdownOpen, setShopDropdownOpen] = useState(false)
  const [shopNavLinks, setShopNavLinks] = useState<{ label: string; href: string }[]>(shopNavFallback)
  const { items, removeItem, total, count, updateQuantity } = useCart()

  useEffect(() => {
    if (!mobileOpen) setShopDropdownOpen(false)
  }, [mobileOpen])

  useEffect(() => {
    fetch("/api/shop/taxonomy")
      .then((r) => r.json())
      .then((d) => {
        const cats = (d?.categories as TaxonomyItem[] | undefined) ?? []
        setShopNavLinks([
          { label: "Shop all", href: "/shop" },
          ...cats.map((c) => ({
            label: c.name,
            href: `/shop?category=${encodeURIComponent(c.slug)}`,
          })),
        ])
      })
      .catch(() => setShopNavLinks(shopNavFallback))
  }, [])

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
                {shopNavLinks.map((cat) => (
                  <DropdownMenuItem key={cat.href + cat.label} asChild>
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button type="button" aria-label="Shopping bag" className="relative text-foreground hover:text-accent transition-colors">
                  <ShoppingBag className="h-4 w-4 lg:h-[18px] lg:w-[18px]" />
                  <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-sans font-medium text-accent-foreground">
                    {count}
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 p-0">
                <div className="p-3 border-b border-border">
                  <p className="font-sans text-sm font-medium">Bag ({count})</p>
                </div>
                {items.length === 0 ? (
                  <div className="p-4 font-sans text-sm text-muted-foreground">
                    Your bag is empty.
                  </div>
                ) : (
                  <>
                    <div className="max-h-60 overflow-y-auto">
                      {items.map((item) => (
                        <div key={item.priceId} className="flex gap-3 p-3 border-b border-border/50">
                          <div className="relative w-12 h-12 shrink-0 rounded overflow-hidden bg-muted">
                            <span className="absolute inset-0">
                              <ProductThumbImage
                                src={item.image}
                                sizes="48px"
                                unoptimized={item.image.startsWith("http")}
                              />
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-sans text-sm truncate">{item.name}</p>
                            <p className="font-sans text-xs text-muted-foreground">
                              ${item.price} × {item.quantity}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <button type="button" onClick={() => updateQuantity(item.priceId, item.quantity - 1)} className="text-xs text-muted-foreground hover:text-foreground">−</button>
                              <span className="text-xs">{item.quantity}</span>
                              <button type="button" onClick={() => updateQuantity(item.priceId, item.quantity + 1)} className="text-xs text-muted-foreground hover:text-foreground">+</button>
                              <button type="button" onClick={() => removeItem(item.priceId)} className="text-xs text-destructive hover:underline ml-1">Remove</button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 border-t border-border flex justify-between items-center">
                      <span className="font-sans text-sm font-medium">Total</span>
                      <span className="font-sans text-sm">${total.toFixed(2)}</span>
                    </div>
                    <div className="p-3">
                      <button
                        type="button"
                        disabled={items.length === 0}
                        onClick={() => router.push("/checkout")}
                        className="w-full py-2.5 bg-primary text-primary-foreground font-sans text-sm font-medium rounded-md hover:bg-primary/90 disabled:opacity-50"
                      >
                        Checkout
                      </button>
                    </div>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
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
                  {shopNavLinks.map((cat) => (
                    <Link
                      key={cat.href + cat.label}
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
