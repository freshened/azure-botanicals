import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative flex items-center overflow-hidden bg-[#FFF1E8]/50 py-12 lg:py-20 min-h-0 lg:min-h-[70vh]">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 w-full">
        <div className="max-w-2xl">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-accent mb-6">
            Curated Botanical Luxury
          </p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-[1.1] tracking-tight text-balance">
            Nature{"'"}s most exquisite creations, delivered
          </h2>
          <p className="mt-8 font-sans text-base md:text-lg leading-relaxed text-foreground max-w-lg">
            Discover rare botanicals and artisan arrangements crafted for those who appreciate the extraordinary beauty of the natural world.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="#shop"
              className="inline-flex items-center justify-center px-8 py-3.5 bg-primary text-primary-foreground font-sans text-sm tracking-wide uppercase hover:bg-foreground/80 transition-colors"
            >
              Shop Plants
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center justify-center px-8 py-3.5 border border-foreground text-foreground font-sans text-sm tracking-wide uppercase hover:bg-foreground hover:text-primary-foreground transition-colors bg-transparent"
            >
              Our Story
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
