const store: Record<string, string[]> = {}

export function getExtraImages(productId: string): string[] {
  return store[productId] ?? []
}

export function getAllExtraImages(): Record<string, string[]> {
  return { ...store }
}

export function addExtraImage(productId: string, imageUrl: string): void {
  if (!store[productId]) store[productId] = []
  const trimmed = imageUrl.trim()
  if (trimmed && !store[productId].includes(trimmed)) {
    store[productId].push(trimmed)
  }
}

export function removeExtraImage(productId: string, imageUrl: string): void {
  if (!store[productId]) return
  store[productId] = store[productId].filter((u) => u !== imageUrl)
  if (store[productId].length === 0) delete store[productId]
}
