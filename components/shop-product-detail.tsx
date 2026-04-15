"use client"

import { useState, type MouseEvent } from "react"
import Link from "next/link"
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react"
import type { ShopProductPayload } from "@/lib/shop-product"
import { ProductFrameImage, ProductThumbImage } from "@/components/product-frame-image"
import { useCart } from "@/contexts/cart-context"

type Props = {
  product: ShopProductPayload
}

export function ShopProductDetail({ product }: Props) {
  const [imageIndex, setImageIndex] = useState(0)
  const { addItem } = useCart()
  const images = product.images?.length ? product.images : [product.image]
  const currentImage = images[imageIndex] || product.image || "/placeholder.svg"
  const cartThumb = images[0] || product.image || "/placeholder.svg"

  const goPrev = (e: MouseEvent) => {
    e.preventDefault()
    setImageIndex((i) => (i <= 0 ? images.length - 1 : i - 1))
  }
  const goNext = (e: MouseEvent) => {
    e.preventDefault()
    setImageIndex((i) => (i >= images.length - 1 ? 0 : i + 1))
  }

  return (
    <div className="bg-card pb-16 pt-6 sm:pt-10">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 font-sans text-sm text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to shop
        </Link>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-14 lg:items-start">
          <div className="min-w-0 w-full">
            <div className="relative w-full aspect-[4/5] overflow-hidden rounded-2xl border border-border">
              <ProductFrameImage
                src={currentImage}
                alt={product.name}
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
                unoptimized={currentImage.startsWith("http")}
                className="absolute inset-0 rounded-2xl"
              />
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={goPrev}
                    className="absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-card/90 p-2 shadow-sm backdrop-blur-sm hover:bg-card"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-6 w-6 text-foreground" />
                  </button>
                  <button
                    type="button"
                    onClick={goNext}
                    className="absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-card/90 p-2 shadow-sm backdrop-blur-sm hover:bg-card"
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-6 w-6 text-foreground" />
                  </button>
                </>
              )}
              <div className="absolute top-3 right-3 z-20 flex max-w-[calc(100%-4rem)] flex-col items-end gap-1.5 pointer-events-none">
                {!product.inStock ? (
                  <span className="rounded-md border border-border/80 bg-background/95 px-2.5 py-1 font-sans text-[10px] font-semibold tracking-[0.14em] uppercase text-foreground shadow-sm backdrop-blur-sm">
                    Sold out
                  </span>
                ) : null}
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
            </div>
            {images.length > 1 && (
              <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
                {images.map((url, i) => (
                  <button
                    key={`${url}-${i}`}
                    type="button"
                    onClick={() => setImageIndex(i)}
                    className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${i === imageIndex ? "border-primary" : "border-border opacity-80 hover:opacity-100"}`}
                    aria-label={`Image ${i + 1}`}
                  >
                    <span className="absolute inset-0 rounded-lg overflow-hidden">
                      <ProductThumbImage
                        src={url}
                        sizes="64px"
                        unoptimized={url.startsWith("http")}
                      />
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="min-w-0 space-y-6">
            <div>
              <p className="font-sans text-xs tracking-[0.25em] uppercase text-accent mb-2">{product.category}</p>
              <h1 className="font-serif text-3xl sm:text-4xl tracking-tight text-foreground">{product.name}</h1>
            </div>
            <p className="font-sans text-2xl text-foreground">
              {product.currency === "USD" ? "$" : `${product.currency} `}
              {product.price.toFixed(2)}
            </p>
            <p className="font-sans text-sm text-muted-foreground">
              {product.inStock
                ? typeof product.inventoryQuantity === "number"
                  ? `In stock: ${product.inventoryQuantity}`
                  : "In stock"
                : "Sold out"}
            </p>
            {product.description ? (
              <p className="font-sans text-base leading-relaxed text-muted-foreground whitespace-pre-wrap max-w-prose">
                {product.description}
              </p>
            ) : (
              <p className="font-sans text-sm text-muted-foreground italic">More about this plant will appear here when a description is added in the catalog.</p>
            )}
            <button
              type="button"
              disabled={!product.priceId || !product.inStock}
              onClick={() => {
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
              className="w-full max-w-md rounded-md bg-primary px-6 py-3.5 font-sans text-sm tracking-[0.12em] uppercase text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {product.inStock ? "Add to bag" : "Sold out"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
