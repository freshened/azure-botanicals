import React from "react"
import type { Metadata, Viewport } from 'next'
import { Playfair_Display, DM_Sans } from 'next/font/google'
import { Navbar } from "@/components/navbar"
import { ConditionalFooter } from "@/components/conditional-footer"
import { RotatingBanner } from "@/components/rotating-banner"
import { CartProvider } from "@/contexts/cart-context"
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
        <CartProvider>
          <Navbar />
          <div className="pt-16 lg:pt-20">
          <RotatingBanner />
          <main>{children}</main>
          <ConditionalFooter />
        </div>
        </CartProvider>
      </body>
    </html>
  )
}
