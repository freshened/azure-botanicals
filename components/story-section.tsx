import Image from "next/image"
import Link from "next/link"

export function StorySection() {
  return (
    <section id="story" className="py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image */}
          <div className="relative aspect-[4/5] overflow-hidden">
            <Image
              src="/images/story-botanical.jpg"
              alt="Botanical styling tools and fresh flowers arranged on cream linen"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

          {/* Content */}
          <div className="lg:pl-4">
            <p className="font-sans text-xs tracking-[0.3em] uppercase text-accent mb-6">
              Our Story
            </p>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl tracking-tight leading-[1.15]">
              Rooted in passion, grown with purpose
            </h2>
            <div className="mt-8 space-y-5 font-sans text-base leading-relaxed text-muted-foreground">
              <p>
                Azure Botanicals was born from a deep reverence for the natural
                world and a belief that exceptional plants and flowers deserve to
                be presented with the care and artistry they inspire.
              </p>
              <p>
                Every botanical in our collection is hand-selected from trusted
                growers and artisan nurseries around the world. We seek out the
                rare, the extraordinary, and the breathtakingly beautiful.
              </p>
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-8">
              <div>
                <p className="font-serif text-3xl lg:text-4xl" style={{ color: "hsl(38 41% 59%)" }}>
                  200+
                </p>
                <p className="mt-1 font-sans text-xs tracking-wide text-muted-foreground uppercase">
                  Rare Species
                </p>
              </div>
              <div>
                <p className="font-serif text-3xl lg:text-4xl" style={{ color: "hsl(38 41% 59%)" }}>
                  12
                </p>
                <p className="mt-1 font-sans text-xs tracking-wide text-muted-foreground uppercase">
                  Countries
                </p>
              </div>
              <div>
                <p className="font-serif text-3xl lg:text-4xl" style={{ color: "hsl(38 41% 59%)" }}>
                  5k+
                </p>
                <p className="mt-1 font-sans text-xs tracking-wide text-muted-foreground uppercase">
                  Happy Homes
                </p>
              </div>
            </div>

            <Link
              href="#"
              className="inline-flex items-center justify-center mt-10 px-8 py-3.5 bg-primary text-primary-foreground font-sans text-sm tracking-wide uppercase hover:bg-foreground/80 transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
