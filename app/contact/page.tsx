import Link from "next/link"

export const metadata = {
  title: "Contact Us | Azure Botanicals",
  description: "Get in touch with Azure Botanicals.",
}

export default function ContactPage() {
  return (
    <div className="py-24 lg:py-32">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        <p className="font-sans text-xs tracking-[0.3em] uppercase text-accent mb-4">
          Support
        </p>
        <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl tracking-tight">
          Contact Us
        </h1>
        <div className="mt-10 space-y-6 font-sans text-base leading-relaxed text-muted-foreground">
          <p>
            We’d love to hear from you. For order questions, shipping, or general inquiries, reach out via the channels below.
          </p>
          <p>
            <strong className="text-foreground">Email:</strong>{" "}
            <a
              href="mailto:hello@azurebotanicals.com"
              className="text-accent hover:underline"
            >
              hello@azurebotanicals.com
            </a>
          </p>
          <p>
            <strong className="text-foreground">Instagram:</strong>{" "}
            <a
              href="https://instagram.com/azurebotanicals"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              @azurebotanicals
            </a>
          </p>
          <p>
            We aim to respond within 1–2 business days. For shipping and policy details, see our{" "}
            <Link href="/shipping" className="text-accent hover:underline">
              Shipping & FAQs
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  )
}
