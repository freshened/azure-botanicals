"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

const testimonials = [
  {
    quote:
      "I had been looking for an Alocasia maharani lemon lime for a while and this seller had one with such a beautiful var. She communicates very quickly and even gives instructions on how to care and acclimate the plant once you receive it! Shipping was quick and the plant was packaged with great care 🙂 I will definitely be buying again from her 💕💕",
    author: "Kathy",
    location: "",
  },
  {
    quote:
      "Very responsive, great prices. Plant arrived quickly and packaged perfectly.",
    author: "Melissa",
    location: "",
  },
  {
    quote:
      "April is quick to respond. When I received my plants they were meticulously well packaged.",
    author: "Ixela",
    location: "",
  },
]

export function TestimonialsSection() {
  const [current, setCurrent] = useState(0)

  const prev = () => setCurrent((c) => (c === 0 ? testimonials.length - 1 : c - 1))
  const next = () => setCurrent((c) => (c === testimonials.length - 1 ? 0 : c + 1))

  return (
    <section className="py-24 lg:py-32 bg-secondary/30">
      <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
        <p className="font-sans text-xs tracking-[0.3em] uppercase text-accent mb-12">
          Recognition
        </p>

        <div className="relative min-h-[200px] flex items-center justify-center">
          <div className="px-8 md:px-16">
            <blockquote className="font-serif text-2xl md:text-3xl lg:text-4xl leading-snug tracking-tight italic">
              {`"${testimonials[current].quote}"`}
            </blockquote>
            <div className="mt-8">
              <p className="font-sans text-sm font-medium tracking-wide text-foreground">
                {testimonials[current].author}
              </p>
              {testimonials[current].location && (
                <p className="font-sans text-xs text-muted-foreground mt-1">
                  {testimonials[current].location}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-6 mt-12">
          <button
            type="button"
            onClick={prev}
            className="p-2 border border-border rounded-full text-foreground hover:border-accent hover:text-accent transition-colors bg-transparent"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-2">
            {testimonials.map((_, i) => (
              <button
                key={`dot-${i}`}
                type="button"
                onClick={() => setCurrent(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === current ? "w-8 bg-accent" : "w-1.5 bg-border"
                }`}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={next}
            className="p-2 border border-border rounded-full text-foreground hover:border-accent hover:text-accent transition-colors bg-transparent"
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  )
}
