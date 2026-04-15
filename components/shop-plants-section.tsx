"use client"

import { useState, useEffect, type MouseEvent } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { ChevronLeft, ChevronRight, Heart } from "lucide-react"
import type { ShopProductPayload } from "@/lib/shop-product"
import type { TaxonomyItem } from "@/lib/shop-taxonomy"
import { ProductFrameImage, ProductThumbImage } from "@/components/product-frame-image"
import { useCart } from "@/contexts/cart-context"

export type ShopProduct = ShopProductPayload & { extraImageUrls?: string[] }

function buildShopHref(categorySlug?: string, tagSlug?: string) {
  const p = new URLSearchParams()
  if (categorySlug) p.set("category", categorySlug)
  if (tagSlug) p.set("tag", tagSlug)
  const q = p.toString()
  return q ? `/shop?${q}` : "/shop"
}

function ProductCard({ product }: { product: ShopProduct }) {
  const [liked, setLiked] = useState(false)
  const [imageIndex, setImageIndex] = useState(0)
  const { addItem } = useCart()
  const images = product.images?.length ? product.images : [product.image]
  const currentImage = images[imageIndex] || product.image || "/placeholder.svg"
  const cartThumb = images[0] || product.image || "/placeholder.svg"

  const goPrev = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setImageIndex((i) => (i <= 0 ? images.length - 1 : i - 1))
  }
  const goNext = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setImageIndex((i) => (i >= images.length - 1 ? 0 : i + 1))
  }

  return (
    <Link href={`/shop/${product.id}`} className="group block w-full min-w-0">
      <div
        className={`relative w-full aspect-[3/4] overflow-hidden ${images.length > 1 ? "mb-2" : "mb-4"}`}
      >
        <ProductFrameImage
          src={currentImage}
          alt={product.name}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          unoptimized={currentImage.startsWith("http")}
          withHover
          className="absolute inset-0"
        />
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={goPrev}
              className="absolute left-1 top-1/2 z-20 -translate-y-1/2 rounded-full bg-card/90 p-1.5 shadow-sm backdrop-blur-sm hover:bg-card"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5 text-foreground" />
            </button>
            <button
              type="button"
              onClick={goNext}
              className="absolute right-1 top-1/2 z-20 -translate-y-1/2 rounded-full bg-card/90 p-1.5 shadow-sm backdrop-blur-sm hover:bg-card"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5 text-foreground" />
            </button>
            <div className="absolute bottom-3 left-0 right-0 z-20 flex justify-center gap-1 pointer-events-auto">
              {images.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Image ${i + 1} of ${images.length}`}
                  aria-current={i === imageIndex ? "true" : undefined}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setImageIndex(i)
                  }}
                  className={`h-1.5 rounded-full transition-all pointer-events-auto ${i === imageIndex ? "w-4 bg-primary-foreground" : "w-1.5 bg-primary-foreground/50"}`}
                />
              ))}
            </div>
          </>
        )}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setLiked(!liked)
          }}
          className="absolute top-3 left-3 z-20 p-2 rounded-full bg-card/90 shadow-sm border border-border/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-card"
          aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            className={`h-4 w-4 transition-colors ${liked ? "fill-secondary text-secondary" : "text-foreground"}`}
          />
        </button>
        <div className="absolute top-3 right-3 z-20 flex max-w-[calc(100%-3rem)] flex-col items-end gap-1.5 pointer-events-none">
          {!product.inStock && (
            <span className="rounded-md border border-border/80 bg-background/95 px-2.5 py-1 font-sans text-[10px] font-semibold tracking-[0.14em] uppercase text-foreground shadow-sm backdrop-blur-sm">
              Sold out
            </span>
          )}
          {product.tag ? (
            <span className="rounded-md bg-accent px-2.5 py-1 font-sans text-[10px] font-semibold tracking-[0.14em] uppercase text-accent-foreground shadow-sm ring-1 ring-black/5 dark:ring-white/10">
              {product.tag}
            </span>
          ) : null}
          {images.length > 1 ? (
            <span className="rounded-md border border-border/80 bg-background/90 px-2 py-0.5 font-sans text-[10px] tabular-nums text-muted-foreground backdrop-blur-sm">
              {imageIndex + 1} / {images.length}
            </span>
          ) : null}
        </div>
        <div className="absolute bottom-0 left-0 right-0 z-10 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
          <button
            type="button"
            disabled={!product.priceId || !product.inStock}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              if (product.priceId) {
                addItem({
                  priceId: product.priceId,
                  productId: product.id,
                  name: product.name,
                  image: cartThumb,
                  price: product.price,
                  currency: product.currency,
                })
              }
            }}
            className="w-full py-3 bg-primary text-primary-foreground font-sans text-xs tracking-[0.15em] uppercase hover:bg-foreground/80 transition-colors disabled:opacity-50"
          >
            {product.inStock ? "Add to Bag" : "Sold out"}
          </button>
        </div>
      </div>
      {images.length > 1 && (
        <div className="flex gap-1.5 mb-4 overflow-x-auto pb-1 -mx-0.5 px-0.5">
          {images.map((url, i) => (
            <button
              key={`${url}-${i}`}
              type="button"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setImageIndex(i)
              }}
              className={`relative h-11 w-11 shrink-0 overflow-hidden rounded-md border-2 transition-colors ${i === imageIndex ? "border-primary" : "border-border opacity-70 hover:opacity-100"}`}
              aria-label={`Show image ${i + 1}`}
            >
              <span className="absolute inset-0">
                <ProductThumbImage
                  src={url}
                  sizes="44px"
                  unoptimized={url.startsWith("http")}
                />
              </span>
            </button>
          ))}
        </div>
      )}
      <div>
        <p className="font-sans text-[11px] tracking-[0.2em] uppercase text-accent mb-1">
          {product.category}
        </p>
        <h3 className="font-serif text-base lg:text-lg tracking-tight">{product.name}</h3>
        <p className="mt-1 font-sans text-sm text-foreground">
          {product.currency === "USD" ? "$" : product.currency + " "}
          {product.price}
        </p>
      </div>
    </Link>
  )
}

export function ShopPlantsLoading() {
  return (
    <section id="shop" className="py-24 lg:py-32 bg-card">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-12 lg:mb-16">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-accent mb-4">Shop</p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl tracking-tight">Shop Plants</h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-x-4 gap-y-10 lg:gap-x-6 lg:gap-y-12">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[3/4] bg-muted rounded-lg mb-4" />
              <div className="h-3 bg-muted rounded w-1/3 mb-2" />
              <div className="h-5 bg-muted rounded w-2/3 mb-1" />
              <div className="h-4 bg-muted rounded w-1/4" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function ShopPlantsSection({ variant = "home" }: { variant?: "home" | "shop" }) {
  const searchParams = useSearchParams()
  const categorySlug =
    variant === "shop" ? (searchParams.get("category") || "").trim().toLowerCase() : ""
  const tagSlug = variant === "shop" ? (searchParams.get("tag") || "").trim().toLowerCase() : ""

  const [products, setProducts] = useState<ShopProduct[]>([])
  const [taxonomy, setTaxonomy] = useState<{ categories: TaxonomyItem[]; tags: TaxonomyItem[] }>({
    categories: [],
    tags: [],
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/shop/taxonomy")
      .then((r) => r.json())
      .then((d) => {
        if (d?.categories && d?.tags) {
          setTaxonomy({ categories: d.categories, tags: d.tags })
        }
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    setLoading(true)
    setError(null)
    const qs = new URLSearchParams()
    if (variant === "shop") {
      if (categorySlug) qs.set("category", categorySlug)
      if (tagSlug) qs.set("tag", tagSlug)
    }
    const suffix = qs.toString() ? `?${qs.toString()}` : ""
    fetch(`/api/products${suffix}`)
      .then(async (res) => {
        const data = await res.json()
        if (!res.ok) {
          const msg =
            typeof data?.error === "string" && data.error.trim()
              ? data.error
              : `Failed to load products (${res.status})`
          throw new Error(msg)
        }
        return data
      })
      .then(setProducts)
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"))
      .finally(() => setLoading(false))
  }, [variant, categorySlug, tagSlug])

  const activeCategoryName = taxonomy.categories.find((c) => c.slug === categorySlug)?.name
  const activeTagName = taxonomy.tags.find((t) => t.slug === tagSlug)?.name

  if (loading) {
    return <ShopPlantsLoading />
  }

  if (error) {
    return (
      <section id="shop" className="py-24 lg:py-32 bg-card">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-12 lg:mb-16">
            <p className="font-sans text-xs tracking-[0.3em] uppercase text-accent mb-4">Shop</p>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl tracking-tight">Shop Plants</h2>
          </div>
          <p className="font-sans text-muted-foreground">{error}</p>
        </div>
      </section>
    )
  }

  const sectionTitle =
    variant !== "shop"
      ? "Shop Plants"
      : activeCategoryName && activeTagName
        ? `${activeCategoryName} · ${activeTagName}`
        : activeCategoryName || activeTagName || "Shop Plants"

  const sectionSubtitle =
    variant === "shop" && (categorySlug || tagSlug) ? (
      <p className="font-sans text-sm text-muted-foreground mt-3 max-w-2xl">
        {activeCategoryName && activeTagName
          ? `${activeCategoryName} · ${activeTagName}`
          : activeCategoryName || activeTagName || "Filtered results"}
        {" · "}
        <Link href="/shop" className="text-accent hover:underline">
          Clear filters
        </Link>
      </p>
    ) : variant === "home" ? (
      <p className="font-sans text-sm text-muted-foreground mt-3 max-w-xl">
        <Link href="/shop" className="text-accent hover:underline">
          Browse by category or tag →
        </Link>
      </p>
    ) : null

  return (
    <section id="shop" className="py-24 lg:py-32 bg-card">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-8 lg:mb-10">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-accent mb-4">Shop</p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl tracking-tight">{sectionTitle}</h2>
          {sectionSubtitle}
        </div>

        {variant === "shop" && (taxonomy.categories.length > 0 || taxonomy.tags.length > 0) && (
          <div className="mb-10 space-y-4">
            <div>
              <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-2">
                Category
              </p>
              <div className="flex flex-wrap gap-2">
                <Link
                  href={buildShopHref(undefined, tagSlug || undefined)}
                  className={`rounded-full border px-3 py-1.5 font-sans text-xs transition-colors ${!categorySlug ? "border-accent bg-accent/10 text-foreground" : "border-border text-muted-foreground hover:border-accent/50"}`}
                >
                  All
                </Link>
                {taxonomy.categories.map((c) => (
                  <Link
                    key={c.slug}
                    href={buildShopHref(c.slug, tagSlug || undefined)}
                    className={`rounded-full border px-3 py-1.5 font-sans text-xs transition-colors ${categorySlug === c.slug ? "border-accent bg-accent/10 text-foreground" : "border-border text-muted-foreground hover:border-accent/50"}`}
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-2">
                Tag
              </p>
              <div className="flex flex-wrap gap-2">
                <Link
                  href={buildShopHref(categorySlug || undefined, undefined)}
                  className={`rounded-full border px-3 py-1.5 font-sans text-xs transition-colors ${!tagSlug ? "border-accent bg-accent/10 text-foreground" : "border-border text-muted-foreground hover:border-accent/50"}`}
                >
                  Any tag
                </Link>
                {taxonomy.tags.map((t) => (
                  <Link
                    key={t.slug}
                    href={buildShopHref(categorySlug || undefined, t.slug)}
                    className={`rounded-full border px-3 py-1.5 font-sans text-xs transition-colors ${tagSlug === t.slug ? "border-accent bg-accent/10 text-foreground" : "border-border text-muted-foreground hover:border-accent/50"}`}
                  >
                    {t.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {products.length === 0 ? (
          <p className="font-sans text-muted-foreground">
            No products match these filters.{" "}
            <Link href="/shop" className="text-accent hover:underline">
              View all products
            </Link>
          </p>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-x-4 gap-y-10 lg:gap-x-6 lg:gap-y-12">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
