import Image from "next/image"

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

          <div className="lg:pl-4">
            <p className="font-sans text-xs tracking-[0.3em] uppercase text-accent mb-6">
              Our Story
            </p>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl tracking-tight leading-[1.15]">
              Heritage, symbolism, and reverence for nature
            </h2>
            <div className="mt-8 space-y-5 font-sans text-base leading-relaxed text-muted-foreground">
              <p>
                The name Azure Botanicals is rooted in heritage, symbolism, and reverence for nature. Drawing from Chinese mythology, it is inspired by the Azure Dragon (Qīnglóng), one of the Four Sacred Beasts and a powerful celestial guardian.
              </p>
              <p>
                The Azure Dragon represents the East, the spring season, and the Wood element, embodying renewal, growth, and life&apos;s continual unfolding. Revered as a divine protector, it is believed to command rain, wind, and the changing seasons, forces essential to the vitality of the natural world.
              </p>
              <p>
                As a symbol of strength, longevity, and balance, the Azure Dragon reflects the philosophy behind Azure Botanicals: honoring nature&apos;s intelligence, cultivating resilience, and nurturing growth with intention. The name serves as a bridge between ancestral wisdom and modern botanical care. Where tradition, protection, and the living world are deeply intertwined.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
