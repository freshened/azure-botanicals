export function resolveOrderedGallery(
  stripeMain: string | undefined,
  dbUrlsOrdered: string[]
): string[] {
  const sm = (stripeMain || "").trim()
  if (dbUrlsOrdered.length === 0) {
    return sm ? [sm] : []
  }
  const first = dbUrlsOrdered[0]
  if (sm && first !== sm && !dbUrlsOrdered.some((u) => u === sm)) {
    return [sm, ...dbUrlsOrdered]
  }
  return [...dbUrlsOrdered]
}

export const MAX_GALLERY_IMAGES = 24
