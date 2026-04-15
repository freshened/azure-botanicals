import { isDatabaseConfigured, prisma } from "@/lib/prisma"

export type TaxonomyItem = { slug: string; name: string; sortOrder: number }

const FALLBACK_CATEGORIES: TaxonomyItem[] = [
  { slug: "shop", name: "Shop", sortOrder: 0 },
  { slug: "rare-plants", name: "Rare Plants", sortOrder: 1 },
  { slug: "tissue-culture", name: "Tissue Culture", sortOrder: 2 },
  { slug: "substrate-pots", name: "Substrate & Pots", sortOrder: 3 },
  { slug: "accessories", name: "Accessories", sortOrder: 4 },
]

const FALLBACK_TAGS: TaxonomyItem[] = [
  { slug: "new", name: "New", sortOrder: 0 },
  { slug: "bestseller", name: "Bestseller", sortOrder: 1 },
  { slug: "limited", name: "Limited", sortOrder: 2 },
  { slug: "seasonal", name: "Seasonal", sortOrder: 3 },
]

export async function getShopTaxonomy(): Promise<{
  categories: TaxonomyItem[]
  tags: TaxonomyItem[]
}> {
  if (!isDatabaseConfigured()) {
    return {
      categories: [...FALLBACK_CATEGORIES],
      tags: [...FALLBACK_TAGS],
    }
  }
  try {
    const [categories, tags] = await Promise.all([
      prisma.shopCategory.findMany({ orderBy: { sortOrder: "asc" } }),
      prisma.shopTag.findMany({ orderBy: { sortOrder: "asc" } }),
    ])
    return {
      categories: categories.map((c) => ({
        slug: c.slug,
        name: c.name,
        sortOrder: c.sortOrder,
      })),
      tags: tags.map((t) => ({
        slug: t.slug,
        name: t.name,
        sortOrder: t.sortOrder,
      })),
    }
  } catch {
    return {
      categories: [...FALLBACK_CATEGORIES],
      tags: [...FALLBACK_TAGS],
    }
  }
}

export function buildCategoryNameBySlugMap(categories: TaxonomyItem[]) {
  const m = new Map<string, string>()
  for (const c of categories) {
    m.set(c.slug.toLowerCase(), c.name)
  }
  return m
}

export function buildTagNameBySlugMap(tags: TaxonomyItem[]) {
  const m = new Map<string, string>()
  for (const t of tags) {
    m.set(t.slug.toLowerCase(), t.name)
  }
  return m
}
