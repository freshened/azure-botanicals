import { Suspense } from "react"
import { ShopPlantsLoading, ShopPlantsSection } from "@/components/shop-plants-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { NewsletterSection } from "@/components/newsletter-section"

export default function Page() {
  return (
    <>
      <Suspense fallback={<ShopPlantsLoading />}>
        <ShopPlantsSection />
      </Suspense>
      <TestimonialsSection />
      <NewsletterSection />
    </>
  )
}
