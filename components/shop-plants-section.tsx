"use client"

import { useState } from "react"
import Image from "next/image"
import { Heart } from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

const products = [
  {
    name: "White Phalaenopsis Orchid",
    price: 285,
    image: "/images/product-white-orchid.jpg",
    category: "Rare Plants",
    tag: "Bestseller",
  },
  {
    name: "Fiddle Leaf Fig",
    price: 340,
    image: "/images/product-fiddle-leaf.jpg",
    category: "Rare Plants",
    tag: "New",
  },
  {
    name: "Monstera Deliciosa",
    price: 420,
    image: "/images/product-monstera.jpg",
    category: "Rare Plants",
    tag: "Limited",
  },
  {
    name: "Blush Peony Arrangement",
    price: 195,
    image: "/images/product-blush-peony.jpg",
    category: "Rare Plants",
    tag: null,
  },
  {
    name: "Garden Rose Collection",
    price: 225,
    image: "/images/product-rose-garden.jpg",
    category: "Rare Plants",
    tag: "Seasonal",
  },
  {
    name: "Preserved Pampas Bouquet",
    price: 165,
    image: "/images/product-dried-bouquet.jpg",
    category: "Rare Plants",
    tag: null,
  },
  {
    name: "Alocasia Maharani Starter",
    price: 45,
    image: "/placeholder.svg",
    category: "Tissue Culture",
    tag: "New",
  },
  {
    name: "Philodendron Pink Princess TC",
    price: 38,
    image: "/placeholder.svg",
    category: "Tissue Culture",
    tag: null,
  },
  {
    name: "Monstera Albo Node",
    price: 55,
    image: "/placeholder.svg",
    category: "Tissue Culture",
    tag: "Limited",
  },
  {
    name: "Aroid Potting Mix",
    price: 24,
    image: "/placeholder.svg",
    category: "Substrate & Pots",
    tag: null,
  },
  {
    name: "Terracotta Pot — 6\"",
    price: 18,
    image: "/placeholder.svg",
    category: "Substrate & Pots",
    tag: null,
  },
  {
    name: "Ceramic Planter — Medium",
    price: 32,
    image: "/placeholder.svg",
    category: "Substrate & Pots",
    tag: "Bestseller",
  },
]

const categories = ["All", "Rare Plants", "Tissue Culture", "Substrate & Pots"]

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
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
        />
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

export function ShopPlantsSection() {
  const [category, setCategory] = useState("All")

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

        <Tabs value={category} onValueChange={setCategory} className="w-full">
          <TabsList className="w-full flex flex-wrap justify-start gap-2 h-auto p-0 bg-transparent border-b border-border rounded-none">
            {categories.map((cat) => (
              <TabsTrigger
                key={cat}
                value={cat}
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent data-[state=active]:shadow-none font-sans text-sm tracking-wide uppercase"
              >
                {cat}
              </TabsTrigger>
            ))}
          </TabsList>
          {categories.map((cat) => (
            <TabsContent key={cat} value={cat} className="mt-10 border-0 p-0">
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-x-4 gap-y-10 lg:gap-x-6 lg:gap-y-12">
                {(cat === "All" ? products : products.filter((p) => p.category === cat)).map((product) => (
                  <ProductCard key={product.name} product={product} />
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  )
}
