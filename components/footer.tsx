import Link from "next/link"

const footerLinks = {
  Shop: [
    { label: "Rare Plants", href: "/#shop" },
    { label: "Tissue Culture", href: "/#shop" },
    { label: "Substrate & Pots", href: "/#shop" },
  ],
  About: [
    { label: "Our Story", href: "/#story" },
    { label: "Sustainability", href: "/#story" },
  ],
  Support: [
    { label: "Shipping & FAQs", href: "/shipping" },
    { label: "Refund / Cancellation", href: "/refund-policy" },
    { label: "Contact Us", href: "/contact" },
  ],
}

const INSTAGRAM_URL = "https://instagram.com/azurebotanicals"

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="lg:col-span-1">
            <h3 className="font-serif text-xl tracking-wider">
              Azure Botanicals
            </h3>
            <p className="mt-4 font-sans text-sm text-muted-foreground leading-relaxed max-w-xs">
              Curating the world{"'"}s most exquisite botanicals for discerning
              homes since 2019.
            </p>
            <div className="flex items-center gap-4 mt-6">
              <Link
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans text-xs tracking-wider text-accent hover:underline transition-colors uppercase font-medium"
                aria-label="Follow us on Instagram"
              >
                Instagram
              </Link>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-sans text-xs tracking-[0.2em] uppercase text-foreground mb-6">
                {title}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="font-sans text-sm text-muted-foreground hover:text-accent transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-sans text-xs text-muted-foreground">
            2025 Azure Botanicals. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/privacy"
              className="font-sans text-xs text-muted-foreground hover:text-accent transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="font-sans text-xs text-muted-foreground hover:text-accent transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
