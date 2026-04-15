import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getShopProductById } from "@/lib/shop-product"
import { ShopProductDetail } from "@/components/shop-product-detail"

type Props = {
  params: Promise<{ productId: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { productId } = await params
  const product = await getShopProductById(productId)
  if (!product) {
    return { title: "Product | Azure Botanicals" }
  }
  const desc = product.description?.slice(0, 155) || `Shop ${product.name} at Azure Botanicals.`
  return {
    title: `${product.name} | Azure Botanicals`,
    description: desc,
    openGraph: {
      title: product.name,
      description: desc,
    },
  }
}

export default async function ShopProductPage({ params }: Props) {
  const { productId } = await params
  const product = await getShopProductById(productId)
  if (!product) {
    notFound()
  }
  return <ShopProductDetail product={product} />
}
