import { Suspense } from "react"
import { ShopPlantsLoading, ShopPlantsSection } from "@/components/shop-plants-section"

export const metadata = {
  title: "Shop | Azure Botanicals",
  description: "Browse plants and botanicals by category.",
}

export default function ShopPage() {
  return (
    <Suspense fallback={<ShopPlantsLoading />}>
      <ShopPlantsSection variant="shop" />
    </Suspense>
  )
}
