import { Navbar } from "@/components/navbar"
import { MarqueeBanner } from "@/components/marquee-banner"
import { HeroSection } from "@/components/hero-section"
import { CollectionsSection } from "@/components/collections-section"
import { ProductsSection } from "@/components/products-section"
import { StorySection } from "@/components/story-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { NewsletterSection } from "@/components/newsletter-section"
import { Footer } from "@/components/footer"

export default function Page() {
  return (
    <>
      <MarqueeBanner />
      <Navbar />
      <main>
        <HeroSection />
        <CollectionsSection />
        <ProductsSection />
        <StorySection />
        <TestimonialsSection />
        <NewsletterSection />
      </main>
      <Footer />
    </>
  )
}
