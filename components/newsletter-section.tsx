"use client"

import { useState } from "react"
import { ArrowRight } from "lucide-react"

export function NewsletterSection() {
  const [email, setEmail] = useState("")

  return (
    <section className="py-24 lg:py-32">
      <div className="mx-auto max-w-3xl px-6 lg:px-8 text-center">
        <p className="font-sans text-xs tracking-[0.3em] uppercase text-accent mb-4">
          Stay Connected
        </p>
        <h2 className="font-serif text-3xl md:text-4xl tracking-tight">
          Join Our Garden
        </h2>
        <p className="mt-4 font-sans text-base text-muted-foreground max-w-md mx-auto leading-relaxed">
          Receive 10% off your first order, exclusive updates on rare arrivals,
          and seasonal inspiration delivered to your inbox.
        </p>

        <form
          onSubmit={(e) => e.preventDefault()}
          className="mt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 max-w-md mx-auto"
        >
          <input
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 px-5 py-3.5 bg-card border border-border font-sans text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent transition-colors"
            required
          />
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-primary text-primary-foreground font-sans text-sm tracking-wide uppercase hover:bg-foreground/80 transition-colors"
          >
            Subscribe
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>
      </div>
    </section>
  )
}
