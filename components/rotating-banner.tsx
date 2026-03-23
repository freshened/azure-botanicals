"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

const INSTAGRAM_URL = "https://instagram.com/azurebotanicals"

const DEFAULT_TARGET = new Date("2026-03-15T12:00:00")

function CountdownClock({ target }: { target: Date }) {
  const [left, setLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 })

  useEffect(() => {
    const tick = () => {
      const now = new Date().getTime()
      const end = target.getTime()
      const diff = Math.max(0, end - now)
      setLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        mins: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        secs: Math.floor((diff % (1000 * 60)) / 1000),
      })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [target])

  return (
    <span className="tabular-nums">
      {left.days}d {left.hours}h {left.mins}m {left.secs}s
    </span>
  )
}

const SLOT_DURATION_MS = 5000

export function RotatingBanner() {
  const [index, setIndex] = useState(0)
  const [countdownTarget, setCountdownTarget] = useState<Date>(DEFAULT_TARGET)

  useEffect(() => {
    const load = () => {
      fetch("/api/countdown")
        .then((res) => res.json())
        .then((data) => {
          if (data?.target) {
            const d = new Date(data.target)
            if (!Number.isNaN(d.getTime())) setCountdownTarget(d)
          }
        })
        .catch(() => {})
    }
    load()
    document.addEventListener("visibilitychange", load)
    return () => document.removeEventListener("visibilitychange", load)
  }, [])

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % 3), SLOT_DURATION_MS)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="bg-primary text-primary-foreground py-2.5">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 flex items-center justify-center gap-4 min-h-[2.5rem]">
        <div className="text-center font-sans text-[11px] tracking-[0.15em] uppercase flex-1">
          {index === 0 && "Curated Botanical Luxury"}
          {index === 1 && (
            <>
              New plant drop in <CountdownClock target={countdownTarget} />
            </>
          )}
          {index === 2 && (
            <Link
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              Follow us on Instagram
            </Link>
          )}
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {[0, 1, 2].map((i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to banner ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-1 rounded-full transition-all ${
                i === index ? "w-4 bg-primary-foreground" : "w-1 bg-primary-foreground/40"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
