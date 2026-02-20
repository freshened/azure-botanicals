import React from "react"
import type { Metadata, Viewport } from 'next'
import { Playfair_Display, DM_Sans } from 'next/font/google'
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { MarqueeBanner } from "@/components/marquee-banner"
import { TopAnnouncement } from "@/components/top-announcement"
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Azure Botanicals | Luxury Plants & Flowers',
  description:
    'Discover rare, exquisite botanicals curated for the discerning collector. Premium plants and flowers delivered with care.',
}

export const viewport: Viewport = {
  themeColor: '#FFF1E8',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${dmSans.variable} font-sans antialiased`}
      >
        <Navbar />
        <div className="pt-16 lg:pt-20">
          <TopAnnouncement />
          <MarqueeBanner />
          <main>{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
