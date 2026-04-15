import { getStripeAccountOptions, requireStripeSecretKey, stripe } from "@/lib/stripe-connect"

async function listAllActiveProductMetadata(): Promise<Array<{ category: string; tag: string }>> {
  requireStripeSecretKey()
  const acctOpts = getStripeAccountOptions()
  const out: Array<{ category: string; tag: string }> = []
  let startingAfter: string | undefined
  for (;;) {
    const page = await stripe.products.list(
      {
        active: true,
        limit: 100,
        ...(startingAfter ? { starting_after: startingAfter } : {}),
      },
      acctOpts
    )
    for (const p of page.data) {
      const m = p.metadata || {}
      out.push({
        category: (m.category || "").trim(),
        tag: (m.tag || "").trim(),
      })
    }
    if (!page.has_more || page.data.length === 0) break
    startingAfter = page.data[page.data.length - 1]?.id
    if (!startingAfter) break
  }
  return out
}

export async function isCategoryNameInUseOnStripe(categoryName: string): Promise<boolean> {
  const want = categoryName.trim().toLowerCase()
  if (!want) return false
  const rows = await listAllActiveProductMetadata()
  return rows.some((r) => r.category.trim().toLowerCase() === want)
}

export async function isTagNameInUseOnStripe(tagName: string): Promise<boolean> {
  const want = tagName.trim().toLowerCase()
  if (!want) return false
  const rows = await listAllActiveProductMetadata()
  return rows.some((r) => r.tag.trim().toLowerCase() === want)
}
