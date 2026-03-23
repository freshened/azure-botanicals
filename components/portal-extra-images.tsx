"use client"

import { useState, useEffect } from "react"

type Product = { id: string; name: string; images: string[] }

export function PortalExtraImages() {
  const [products, setProducts] = useState<Product[]>([])
  const [selectedId, setSelectedId] = useState("")
  const [newUrl, setNewUrl] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = () => {
    setError(null)
    fetch("/api/products")
      .then((r) => r.json())
      .then((prods: Product[]) => {
        setProducts(prods)
        if (!selectedId && prods.length > 0) setSelectedId(prods[0].id)
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load products."))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  const addImage = () => {
    if (!selectedId || !newUrl.trim()) return
    setSaving(true)
    setError(null)
    fetch("/api/products/extra-images", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: selectedId, imageUrl: newUrl.trim() }),
    })
      .then(async (r) => {
        const data = await r.json()
        if (!r.ok) throw new Error(data?.error || "Failed to add image.")
      })
      .then(() => {
        setNewUrl("")
        load()
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to add image."))
      .finally(() => setSaving(false))
  }

  const removeImage = (imageUrl: string) => {
    if (!selectedId) return
    setSaving(true)
    setError(null)
    fetch("/api/products/extra-images", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: selectedId, imageUrl }),
    })
      .then(async (r) => {
        const data = await r.json()
        if (!r.ok) throw new Error(data?.error || "Failed to remove image.")
      })
      .then(() => load())
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to remove image."))
      .finally(() => setSaving(false))
  }

  if (loading) {
    return <p className="font-sans text-sm text-muted-foreground">Loading products…</p>
  }

  const selectedProduct = products.find((product) => product.id === selectedId)
  const extra = selectedProduct?.images ?? []

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="portal-product" className="block font-sans text-xs font-medium text-foreground mb-1.5">
          Product
        </label>
        <select
          id="portal-product"
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          className="w-full max-w-xs rounded-md border border-input bg-background px-3 py-2 font-sans text-sm"
        >
          <option value="">Select a product</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>
      {selectedId && (
        <>
          <div>
            <label htmlFor="portal-image-url" className="block font-sans text-xs font-medium text-foreground mb-1.5">
              Add image URL
            </label>
            <div className="flex gap-2">
              <input
                id="portal-image-url"
                type="url"
                placeholder="https://..."
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                className="flex-1 rounded-md border border-input bg-background px-3 py-2 font-sans text-sm"
              />
              <button
                type="button"
                onClick={addImage}
                disabled={!newUrl.trim() || saving}
                className="rounded-md bg-primary px-4 py-2 font-sans text-sm text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                {saving ? "Saving..." : "Add"}
              </button>
            </div>
          </div>
          {error && <p className="font-sans text-sm text-destructive">{error}</p>}
          {extra.length > 0 && (
            <div>
              <p className="font-sans text-xs font-medium text-foreground mb-2">Product images ({extra.length})</p>
              <ul className="space-y-2">
                {extra.map((url) => (
                  <li key={url} className="flex items-center gap-2 font-sans text-sm">
                    <span className="truncate max-w-[200px] text-muted-foreground">{url}</span>
                    <button
                      type="button"
                      onClick={() => removeImage(url)}
                      disabled={saving}
                      className="text-destructive hover:underline text-xs"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  )
}
