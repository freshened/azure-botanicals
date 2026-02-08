"use client"

import { useState } from "react"
import Image from "next/image"
import { Heart } from "lucide-react"

const products = [
  {
    name: "White Phalaenopsis Orchid",
    price: 285,
    image: "/images/product-white-orchid.jpg",
    category: "Rare Plants",
    tag: "Bestseller",
  },
  {
    name: "Blush Peony Arrangement",
    price: 195,
    image: "/images/product-blush-peony.jpg",
    category: "Fresh Flowers",
    tag: null,
  },
  {
    name: "Fiddle Leaf Fig",
    price: 340,
    image: "/images/product-fiddle-leaf.jpg",
    category: "Rare Plants",
    tag: "New",
  },
  {
    name: "Preserved Pampas Bouquet",
    price: 165,
    image: "/images/product-dried-bouquet.jpg",
    category: "Dried & Preserved",
    tag: null,
  },
  {
    name: "Monstera Deliciosa",
    price: 420,
    image: "/images/product-monstera.jpg",
    category: "Rare Plants",
    tag: "Limited",
  },
  {
    name: "Garden Rose Collection",
    price: 225,
    image: "/images/product-rose-garden.jpg",
    category: "Fresh Flowers",
    tag: "Seasonal",
  },
]

function ProductCard({
  product,
}: {
  product: (typeof products)[0]
}) {
  const [liked, setLiked] = useState(false)

  return (
    <div className="group">
      <div className="relative aspect-[3/4] overflow-hidden bg-card mb-4">
        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {/* Wishlist */}
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
        {/* Tag */}
        {product.tag && (
          <span className="absolute top-4 left-4 font-sans text-[10px] tracking-[0.15em] uppercase px-3 py-1.5 bg-accent text-accent-foreground">
            {product.tag}
          </span>
        )}
        {/* Quick add */}
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
          <button
            type="button"
            className="w-full py-3 bg-primary text-primary-foreground font-sans text-xs tracking-[0.15em] uppercase hover:bg-foreground/80 transition-colors"
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
          ${product.price}
        </p>
      </div>
    </div>
  )
}

export function ProductsSection() {
  return (
    <section id="products" className="py-24 lg:py-32 bg-card">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16 lg:mb-20 gap-4">
          <div>
            <p className="font-sans text-xs tracking-[0.3em] uppercase text-accent mb-4">
              The Edit
            </p>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl tracking-tight">
              Featured Botanicals
            </h2>
          </div>
          <button
            type="button"
            className="self-start md:self-auto font-sans text-sm tracking-wide text-foreground hover:text-accent transition-colors gold-underline"
          >
            View All
          </button>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12 lg:gap-x-8 lg:gap-y-16">
          {products.map((product) => (
            <ProductCard key={product.name} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
