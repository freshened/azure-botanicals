"use client"

import { useState, useEffect, type MouseEvent } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Heart } from "lucide-react"
import { useCart } from "@/contexts/cart-context"

export type ShopProduct = {
  id: string
  priceId: string | null
  name: string
  price: number
  currency: string
  image: string
  images: string[]
  category: string
  tag: string | null
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
    <div className="group">
      <div
        className={`relative aspect-[3/4] overflow-hidden bg-card ${images.length > 1 ? "mb-2" : "mb-4"}`}
      >
        <Image
          src={currentImage}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          unoptimized={currentImage.startsWith("http")}
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
            <p className="absolute top-3 right-3 z-20 rounded bg-card/85 px-2 py-0.5 font-sans text-[10px] text-foreground backdrop-blur-sm">
              {imageIndex + 1} / {images.length}
            </p>
          </>
        )}
        <button
          type="button"
          onClick={() => setLiked(!liked)}
          className="absolute top-4 left-4 z-20 p-2 bg-card/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            className={`h-4 w-4 transition-colors ${liked ? "fill-secondary text-secondary" : "text-foreground"}`}
          />
        </button>
        {product.tag && (
          <span className="absolute top-4 left-14 z-20 font-sans text-[10px] tracking-[0.15em] uppercase px-3 py-1.5 bg-accent text-accent-foreground">
            {product.tag}
          </span>
        )}
        <div className="absolute bottom-0 left-0 right-0 z-10 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
          <button
            type="button"
            disabled={!product.priceId}
            onClick={(e) => {
              e.preventDefault()
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
            Add to Bag
          </button>
        </div>
      </div>
      {images.length > 1 && (
        <div className="flex gap-1.5 mb-4 overflow-x-auto pb-1 -mx-0.5 px-0.5">
          {images.map((url, i) => (
            <button
              key={`${url}-${i}`}
              type="button"
              onClick={() => setImageIndex(i)}
              className={`relative h-11 w-11 shrink-0 overflow-hidden rounded-md border-2 transition-colors ${i === imageIndex ? "border-primary" : "border-border opacity-70 hover:opacity-100"}`}
              aria-label={`Show image ${i + 1}`}
            >
              <Image
                src={url}
                alt=""
                fill
                className="object-cover"
                sizes="44px"
                unoptimized={url.startsWith("http")}
              />
            </button>
          ))}
        </div>
      )}
      <div>
        <p className="font-sans text-[11px] tracking-[0.2em] uppercase text-accent mb-1">
          {product.category}
        </p>
        <h3 className="font-serif text-base lg:text-lg tracking-tight">
          {product.name}
        </h3>
        <p className="mt-1 font-sans text-sm text-foreground">
          {product.currency === "USD" ? "$" : product.currency + " "}
          {product.price}
        </p>
      </div>
    </div>
  )
}

export function ShopPlantsSection() {
  const [products, setProducts] = useState<ShopProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/products")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load products")
        return res.json()
      })
      .then(setProducts)
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <section id="shop" className="py-24 lg:py-32 bg-card">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-12 lg:mb-16">
            <p className="font-sans text-xs tracking-[0.3em] uppercase text-accent mb-4">
              Shop
            </p>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl tracking-tight">
              Shop Plants
            </h2>
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

  if (error) {
    return (
      <section id="shop" className="py-24 lg:py-32 bg-card">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-12 lg:mb-16">
            <p className="font-sans text-xs tracking-[0.3em] uppercase text-accent mb-4">
              Shop
            </p>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl tracking-tight">
              Shop Plants
            </h2>
          </div>
          <p className="font-sans text-muted-foreground">{error}</p>
        </div>
      </section>
    )
  }

  return (
    <section id="shop" className="py-24 lg:py-32 bg-card">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-12 lg:mb-16">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-accent mb-4">
            Shop
          </p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl tracking-tight">
            Shop Plants
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-x-4 gap-y-10 lg:gap-x-6 lg:gap-y-12">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
