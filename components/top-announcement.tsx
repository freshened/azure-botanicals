import Link from "next/link"

export function TopAnnouncement() {
  return (
    <div className="bg-foreground text-primary-foreground py-2 text-center">
      <Link
        href="/shipping"
        className="font-sans text-[11px] tracking-[0.12em] uppercase hover:underline"
      >
        Before you checkout — please read our Shipping & FAQs
      </Link>
    </div>
  )
}
