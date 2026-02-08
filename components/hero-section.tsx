import Image from "next/image"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-botanical.jpg"
          alt="Luxurious floral arrangement with blush peonies and garden roses"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[#FFF1E8]/60" />
      </div>

      {/* Content */}
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8 pt-20">
        <div className="max-w-2xl">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-accent mb-6">
            Curated Botanical Luxury
          </p>
          <h2 className="font-serif text-5xl md:text-6xl lg:text-7xl leading-[1.1] tracking-tight text-balance">
            Nature{"'"}s most exquisite creations, delivered
          </h2>
          <p className="mt-8 font-sans text-base md:text-lg leading-relaxed text-foreground max-w-lg">
            Discover rare botanicals and artisan arrangements crafted for those
            who appreciate the extraordinary beauty of the natural world.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="#products"
              className="inline-flex items-center justify-center px-8 py-3.5 bg-primary text-primary-foreground font-sans text-sm tracking-wide uppercase hover:bg-foreground/80 transition-colors"
            >
              Shop Collection
            </Link>
            <Link
              href="#story"
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
