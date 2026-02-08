"use client"

export function MarqueeBanner() {
  const items = [
    "Complimentary Shipping on Orders Over $150",
    "Hand-Selected Botanicals",
    "Sustainable Packaging",
    "Expert Care Guides Included",
    "Worldwide Delivery",
  ]

  return (
    <div className="bg-primary text-primary-foreground overflow-hidden py-2.5">
      <div className="flex animate-marquee whitespace-nowrap">
        {[...items, ...items, ...items].map((item, i) => (
          <span
            key={`marquee-${i}`}
            className="font-sans text-[11px] tracking-[0.15em] uppercase mx-8"
          >
            {item}
            <span className="mx-8 text-accent">{"*"}</span>
          </span>
        ))}
      </div>
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-33.33%);
          }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </div>
  )
}
