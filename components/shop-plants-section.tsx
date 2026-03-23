"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Heart } from "lucide-react"
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

  return (
    <div className="group">
      <div className="relative aspect-[3/4] overflow-hidden bg-card mb-4">
        <Image
          src={currentImage}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          unoptimized={currentImage.startsWith("http")}
        />
        {images.length > 1 && (
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Image ${i + 1}`}
                onClick={(e) => { e.preventDefault(); setImageIndex(i) }}
                className={`h-1.5 rounded-full transition-all ${i === imageIndex ? "w-4 bg-primary-foreground" : "w-1.5 bg-primary-foreground/40"}`}
              />
            ))}
          </div>
        )}
        <button
          type="button"
          onClick={() => setLiked(!liked)}
          className="absolute top-4 right-4 p-2 bg-card/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            className={`h-4 w-4 transition-colors ${liked ? "fill-secondary text-secondary" : "text-foreground"}`}
          />
        </button>
        {product.tag && (
          <span className="absolute top-4 left-4 font-sans text-[10px] tracking-[0.15em] uppercase px-3 py-1.5 bg-accent text-accent-foreground">
            {product.tag}
          </span>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
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
                  image: product.image,
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
