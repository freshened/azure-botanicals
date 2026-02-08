import Image from "next/image"
import Link from "next/link"

const collections = [
  {
    name: "Rare Plants",
    description: "Exotic specimens for the discerning collector",
    image: "/images/collection-rare-plants.jpg",
    count: "24 pieces",
  },
  {
    name: "Fresh Flowers",
    description: "Seasonal blooms, artfully arranged",
    image: "/images/collection-fresh-flowers.jpg",
    count: "18 pieces",
  },
  {
    name: "Dried & Preserved",
    description: "Eternal beauty, thoughtfully curated",
    image: "/images/collection-dried-preserved.jpg",
    count: "12 pieces",
  },
]

export function CollectionsSection() {
  return (
    <section className="py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16 lg:mb-20">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-accent mb-4">
            Curated For You
          </p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl tracking-tight">
            Our Collections
          </h2>
        </div>

        {/* Collections grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {collections.map((collection) => (
            <Link
              key={collection.name}
              href="#"
              className="group relative block overflow-hidden"
            >
              <div className="aspect-[3/4] relative overflow-hidden">
                <Image
                  src={collection.image || "/placeholder.svg"}
                  alt={collection.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-[#5E6368]/20 group-hover:bg-[#5E6368]/30 transition-colors duration-500" />
              </div>
              <div className="mt-5">
                <p className="font-sans text-[11px] tracking-[0.2em] uppercase text-accent mb-1">
                  {collection.count}
                </p>
                <h3 className="font-serif text-xl lg:text-2xl tracking-tight">
                  {collection.name}
                </h3>
                <p className="mt-1 font-sans text-sm text-muted-foreground">
                  {collection.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
