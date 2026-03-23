"use client"

import Image from "next/image"
import { FormEvent, useEffect, useMemo, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

type ProductRow = {
  id: string
  name: string
  price: number
  currency: string
  image: string
  images: string[]
  category: string
  tag: string | null
}

const categoryOptions = ["Shop", "Rare Plants", "Tissue Culture", "Substrate & Pots", "Accessories"]
const tagOptions = ["", "New", "Bestseller", "Limited", "Seasonal"]

const initialForm = {
  productId: "",
  name: "",
  description: "",
  price: "25.00",
  category: "Shop",
  tag: "",
  imageUrl: "",
}

export function PortalProductsManager() {
  const [products, setProducts] = useState<ProductRow[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editSaving, setEditSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [query, setQuery] = useState("")
  const [form, setForm] = useState(initialForm)
  const [editOpen, setEditOpen] = useState(false)
  const [editForm, setEditForm] = useState(initialForm)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return products
    return products.filter((p) => p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q))
  }, [products, query])

  const loadProducts = () => {
    setLoading(true)
    setMessage(null)
    fetch("/api/products")
      .then(async (res) => {
        const data = await res.json()
        if (!res.ok) throw new Error(data?.error || "Failed to load products.")
        setProducts(data)
      })
      .catch((e) => setMessage(e instanceof Error ? e.message : "Failed to load products."))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadProducts()
  }, [])

  const resetForm = () => {
    setForm(initialForm)
  }

  const selectForEdit = (product: ProductRow) => {
    setEditForm({
      productId: product.id,
      name: product.name,
      description: "",
      price: product.price.toFixed(2),
      category: product.category || "Shop",
      tag: product.tag || "",
      imageUrl: product.images[0] && product.images[0] !== "/placeholder.svg" ? product.images[0] : "",
    })
    setEditOpen(true)
    setMessage(null)
  }

  const createProduct = async (event: FormEvent) => {
    event.preventDefault()
    setSaving(true)
    setMessage(null)
    try {
      const numericPrice = Number.parseFloat(form.price)
      if (!Number.isFinite(numericPrice) || numericPrice < 0.5) {
        throw new Error("Price must be at least $0.50.")
      }
      const priceInCents = Math.round(numericPrice * 100)

      const payload = {
        name: form.name,
        description: form.description,
        priceInCents,
        category: form.category,
        tag: form.tag,
        imageUrl: form.imageUrl,
      }

      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || "Failed to save product.")
      setMessage("Product created.")
      resetForm()
      loadProducts()
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to save product.")
    } finally {
      setSaving(false)
    }
  }

  const updateProduct = async (event: FormEvent) => {
    event.preventDefault()
    setEditSaving(true)
    setMessage(null)
    try {
      const numericPrice = Number.parseFloat(editForm.price)
      if (!Number.isFinite(numericPrice) || numericPrice < 0.5) {
        throw new Error("Price must be at least $0.50.")
      }
      const priceInCents = Math.round(numericPrice * 100)

      const payload = {
        productId: editForm.productId,
        name: editForm.name,
        description: editForm.description,
        priceInCents,
        category: editForm.category,
        tag: editForm.tag,
        imageUrl: editForm.imageUrl,
      }

      const res = await fetch("/api/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || "Failed to update product.")
      setEditOpen(false)
      setMessage("Product updated.")
      loadProducts()
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to update product.")
    } finally {
      setEditSaving(false)
    }
  }

  const archiveProduct = async (productId: string) => {
    setSaving(true)
    setMessage(null)
    try {
      const res = await fetch("/api/products", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || "Failed to archive product.")
      if (editOpen && editForm.productId === productId) setEditOpen(false)
      setMessage("Product archived.")
      loadProducts()
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to archive product.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <div className="xl:col-span-2 rounded-lg border border-border bg-card p-4">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h4 className="font-sans text-sm font-medium tracking-wide text-foreground">Products</h4>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search product name or ID"
            className="w-full sm:w-64 rounded-md border border-input bg-background px-3 py-2 font-sans text-sm"
          />
        </div>

        {loading ? (
          <p className="font-sans text-sm text-muted-foreground">Loading products...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 font-sans text-xs uppercase tracking-[0.15em] text-muted-foreground">
                    Product
                  </th>
                  <th className="text-left py-2 font-sans text-xs uppercase tracking-[0.15em] text-muted-foreground">
                    Category
                  </th>
                  <th className="text-left py-2 font-sans text-xs uppercase tracking-[0.15em] text-muted-foreground">
                    Price
                  </th>
                  <th className="text-right py-2 font-sans text-xs uppercase tracking-[0.15em] text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((product) => (
                  <tr key={product.id} className="border-b border-border/60">
                    <td className="py-3 pr-3">
                      <p className="font-sans text-sm text-foreground">{product.name}</p>
                      <p className="font-sans text-xs text-muted-foreground">{product.id}</p>
                    </td>
                    <td className="py-3 pr-3 font-sans text-sm text-muted-foreground">{product.category}</td>
                    <td className="py-3 pr-3 font-sans text-sm text-muted-foreground">
                      {product.currency === "USD" ? "$" : `${product.currency} `}
                      {product.price.toFixed(2)}
                    </td>
                    <td className="py-3 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => selectForEdit(product)}
                        className="rounded-md border border-input px-3 py-1.5 font-sans text-xs hover:bg-muted"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => archiveProduct(product.id)}
                        disabled={saving}
                        className="rounded-md border border-destructive/40 px-3 py-1.5 font-sans text-xs text-destructive hover:bg-destructive/10 disabled:opacity-50"
                      >
                        Archive
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="rounded-lg border border-border bg-card p-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-sans text-sm font-medium tracking-wide text-foreground">Create Product</h4>
        </div>

        <form onSubmit={createProduct} className="space-y-3">
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            placeholder="Product name"
            className="w-full rounded-md border border-input bg-background px-3 py-2 font-sans text-sm"
            required
          />
          <textarea
            value={form.description}
            onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
            placeholder="Description"
            className="w-full rounded-md border border-input bg-background px-3 py-2 font-sans text-sm min-h-24"
          />
          <div className="grid grid-cols-1 gap-3">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 font-sans text-sm text-muted-foreground">
                $
              </span>
              <input
                type="number"
                min={0.5}
                step="0.01"
                value={form.price}
                onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))}
                placeholder="25.00"
                className="w-full rounded-md border border-input bg-background pl-7 pr-3 py-2 font-sans text-sm"
                required
              />
            </div>
          </div>
          <p className="font-sans text-xs text-muted-foreground">Currency is fixed to USD for this store.</p>
          <div className="grid grid-cols-2 gap-3">
            <select
              value={form.category}
              onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
              className="w-full rounded-md border border-input bg-background px-3 py-2 font-sans text-sm"
            >
              {categoryOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <select
              value={form.tag}
              onChange={(e) => setForm((prev) => ({ ...prev, tag: e.target.value }))}
              className="w-full rounded-md border border-input bg-background px-3 py-2 font-sans text-sm"
            >
              <option value="">No tag</option>
              {tagOptions
                .filter((option) => option)
                .map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
            </select>
          </div>
          <input
            type="url"
            value={form.imageUrl}
            onChange={(e) => setForm((prev) => ({ ...prev, imageUrl: e.target.value }))}
            placeholder="Main image URL"
            className="w-full rounded-md border border-input bg-background px-3 py-2 font-sans text-sm"
          />
          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-md bg-primary px-4 py-2 font-sans text-sm text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Create product"}
          </button>
        </form>
        {message && <p className="mt-3 font-sans text-sm text-muted-foreground">{message}</p>}
      </div>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>Update product details and main image.</DialogDescription>
          </DialogHeader>

          <form onSubmit={updateProduct} className="space-y-3">
            {editForm.imageUrl && (
              <div className="relative h-40 w-full overflow-hidden rounded-md border border-border bg-muted">
                <Image
                  src={editForm.imageUrl}
                  alt={editForm.name || "Product image"}
                  fill
                  className="object-cover"
                  unoptimized={editForm.imageUrl.startsWith("http")}
                />
              </div>
            )}
            <input
              type="text"
              value={editForm.name}
              onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Product name"
              className="w-full rounded-md border border-input bg-background px-3 py-2 font-sans text-sm"
              required
            />
            <textarea
              value={editForm.description}
              onChange={(e) => setEditForm((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Description"
              className="w-full rounded-md border border-input bg-background px-3 py-2 font-sans text-sm min-h-24"
            />
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 font-sans text-sm text-muted-foreground">
                $
              </span>
              <input
                type="number"
                min={0.5}
                step="0.01"
                value={editForm.price}
                onChange={(e) => setEditForm((prev) => ({ ...prev, price: e.target.value }))}
                placeholder="25.00"
                className="w-full rounded-md border border-input bg-background pl-7 pr-3 py-2 font-sans text-sm"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <select
                value={editForm.category}
                onChange={(e) => setEditForm((prev) => ({ ...prev, category: e.target.value }))}
                className="w-full rounded-md border border-input bg-background px-3 py-2 font-sans text-sm"
              >
                {categoryOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <select
                value={editForm.tag}
                onChange={(e) => setEditForm((prev) => ({ ...prev, tag: e.target.value }))}
                className="w-full rounded-md border border-input bg-background px-3 py-2 font-sans text-sm"
              >
                <option value="">No tag</option>
                {tagOptions
                  .filter((option) => option)
                  .map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
              </select>
            </div>
            <input
              type="url"
              value={editForm.imageUrl}
              onChange={(e) => setEditForm((prev) => ({ ...prev, imageUrl: e.target.value }))}
              placeholder="Main image URL"
              className="w-full rounded-md border border-input bg-background px-3 py-2 font-sans text-sm"
            />
            <DialogFooter>
              <button
                type="button"
                onClick={() => setEditOpen(false)}
                className="rounded-md border border-input px-4 py-2 font-sans text-sm hover:bg-muted"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={editSaving}
                className="rounded-md bg-primary px-4 py-2 font-sans text-sm text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                {editSaving ? "Saving..." : "Save changes"}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
