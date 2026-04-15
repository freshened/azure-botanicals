"use client"

import { ProductFrameImage, ProductThumbImage } from "@/components/product-frame-image"
import { FormEvent, useEffect, useMemo, useRef, useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { portalFetch } from "@/lib/portal-fetch"
import { MAX_GALLERY_IMAGES } from "@/lib/product-gallery"

type ProductRow = {
  id: string
  name: string
  price: number
  currency: string
  image: string
  images: string[]
  extraImageUrls?: string[]
  category: string
  tag: string | null
  inventoryQuantity: number | null
  inStock: boolean
}

const categoryFallback = ["Shop", "Rare Plants", "Tissue Culture", "Substrate & Pots", "Accessories"]
const tagFallback = ["New", "Bestseller", "Limited", "Seasonal"]

const initialForm = {
  productId: "",
  name: "",
  description: "",
  price: "25.00",
  category: "Shop",
  tag: "",
  inventoryQuantity: "10",
}

const acceptImages = "image/jpeg,image/png,image/webp,image/gif"

async function uploadProductFile(file: File) {
  const fd = new FormData()
  fd.append("file", file)
  const res = await portalFetch("/api/upload/product-image", { method: "POST", body: fd })
  const data = await res.json()
  if (!res.ok) throw new Error(data?.error || "Upload failed.")
  return data.url as string
}

function filterPlaceholderImages(urls: string[]) {
  return urls.filter((u) => u && u !== "/placeholder.svg")
}

export function PortalProductsManager() {
  const [categoryOptions, setCategoryOptions] = useState<string[]>(categoryFallback)
  const [tagOptions, setTagOptions] = useState<string[]>(tagFallback)
  const [products, setProducts] = useState<ProductRow[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editSaving, setEditSaving] = useState(false)
  const [gallerySaving, setGallerySaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [query, setQuery] = useState("")
  const [form, setForm] = useState(initialForm)
  const [editOpen, setEditOpen] = useState(false)
  const [editForm, setEditForm] = useState(initialForm)
  const [editGalleryUrls, setEditGalleryUrls] = useState<string[]>([])
  const [createImageFiles, setCreateImageFiles] = useState<File[]>([])
  const [createFilePreviews, setCreateFilePreviews] = useState<string[]>([])
  const galleryFileInputRef = useRef<HTMLInputElement>(null)
  const createFileInputRef = useRef<HTMLInputElement>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return products
    return products.filter((p) => p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q))
  }, [products, query])

  const loadProducts = () => {
    setLoading(true)
    setMessage(null)
    portalFetch("/api/products")
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

  useEffect(() => {
    fetch("/api/shop/taxonomy")
      .then((r) => r.json())
      .then((d) => {
        const cats = d?.categories as { name: string }[] | undefined
        const tags = d?.tags as { name: string }[] | undefined
        if (cats?.length) setCategoryOptions(cats.map((c) => c.name))
        if (tags?.length) setTagOptions(tags.map((t) => t.name))
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    const urls = createImageFiles.map((f) => URL.createObjectURL(f))
    setCreateFilePreviews(urls)
    return () => urls.forEach((u) => URL.revokeObjectURL(u))
  }, [createImageFiles])

  const resetForm = () => {
    setForm(initialForm)
  }

  const applyGalleryToServer = async (productId: string, imageUrls: string[]) => {
    const res = await portalFetch("/api/products/gallery", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, imageUrls }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data?.error || "Failed to save images.")
    setEditGalleryUrls(imageUrls)
    loadProducts()
  }

  const persistGallery = async (productId: string, imageUrls: string[]) => {
    setGallerySaving(true)
    setMessage(null)
    try {
      await applyGalleryToServer(productId, imageUrls)
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Failed to save images.")
    } finally {
      setGallerySaving(false)
    }
  }

  const selectForEdit = (product: ProductRow) => {
    setEditForm({
      productId: product.id,
      name: product.name,
      description: "",
      price: product.price.toFixed(2),
      category: product.category || "Shop",
      tag: product.tag || "",
      inventoryQuantity:
        typeof product.inventoryQuantity === "number" ? String(product.inventoryQuantity) : "0",
    })
    setEditGalleryUrls(filterPlaceholderImages(product.images))
    setEditOpen(true)
    setMessage(null)
  }

  const editMoveGallery = async (index: number, delta: number) => {
    const j = index + delta
    if (j < 0 || j >= editGalleryUrls.length || !editForm.productId) return
    const next = [...editGalleryUrls]
    ;[next[index], next[j]] = [next[j], next[index]]
    await persistGallery(editForm.productId, next)
  }

  const editRemoveGallery = async (index: number) => {
    if (!editForm.productId) return
    const next = editGalleryUrls.filter((_, i) => i !== index)
    await persistGallery(editForm.productId, next)
  }

  const editAddGalleryFiles = async (files: FileList | null) => {
    if (!files?.length || !editForm.productId) return
    const incoming = [...files]
    const room = MAX_GALLERY_IMAGES - editGalleryUrls.length
    if (room <= 0) {
      setMessage(`Maximum ${MAX_GALLERY_IMAGES} images per product.`)
      return
    }
    const take = incoming.slice(0, room)
    setGallerySaving(true)
    setMessage(null)
    try {
      const urls: string[] = []
      for (const f of take) {
        urls.push(await uploadProductFile(f))
      }
      await applyGalleryToServer(editForm.productId, [...editGalleryUrls, ...urls])
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Failed to add images.")
    } finally {
      setGallerySaving(false)
    }
  }

  const createProduct = async (event: FormEvent) => {
    event.preventDefault()
    setSaving(true)
    setMessage(null)
    try {
      const numericPrice = Number.parseFloat(form.price)
      const numericInventory = Number.parseFloat(form.inventoryQuantity)
      if (!Number.isFinite(numericPrice) || numericPrice < 0.5) {
        throw new Error("Price must be at least $0.50.")
      }
      if (!Number.isFinite(numericInventory) || numericInventory < 0) {
        throw new Error("Inventory must be 0 or greater.")
      }
      const priceInCents = Math.round(numericPrice * 100)

      const urls: string[] = []
      for (const f of createImageFiles) {
        urls.push(await uploadProductFile(f))
      }
      const imageUrl = urls[0] || ""

      const payload = {
        name: form.name,
        description: form.description,
        priceInCents,
        category: form.category,
        tag: form.tag,
        imageUrl,
        inventoryQuantity: Math.floor(numericInventory),
      }

      const res = await portalFetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || "Failed to save product.")
      const productId = data.id as string

      if (urls.length > 0) {
        const gRes = await portalFetch("/api/products/gallery", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId, imageUrls: urls }),
        })
        const gData = await gRes.json()
        if (!gRes.ok) throw new Error(gData?.error || "Product saved but gallery failed.")
      }

      setMessage("Product created.")
      resetForm()
      setCreateImageFiles([])
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
      const numericInventory = Number.parseFloat(editForm.inventoryQuantity)
      if (!Number.isFinite(numericPrice) || numericPrice < 0.5) {
        throw new Error("Price must be at least $0.50.")
      }
      if (!Number.isFinite(numericInventory) || numericInventory < 0) {
        throw new Error("Inventory must be 0 or greater.")
      }
      const priceInCents = Math.round(numericPrice * 100)

      const payload = {
        productId: editForm.productId,
        name: editForm.name,
        description: editForm.description,
        priceInCents,
        category: editForm.category,
        tag: editForm.tag,
        inventoryQuantity: Math.floor(numericInventory),
      }

      const res = await portalFetch("/api/products", {
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
      const res = await portalFetch("/api/products", {
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
    <div className="space-y-6 sm:space-y-8 min-w-0 max-w-full">
      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_min(100%,20rem)] gap-6 xl:gap-8 items-start min-w-0">
      <div className="rounded-2xl border border-border bg-card p-3 sm:p-4 shadow-sm min-w-0 max-w-full overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 min-w-0">
          <h4 className="font-sans text-sm font-medium tracking-wide text-foreground shrink-0">All products</h4>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search…"
            className="w-full sm:max-w-xs rounded-md border border-input bg-background px-3 py-2 font-sans text-sm min-w-0"
          />
        </div>

        {loading ? (
          <p className="font-sans text-sm text-muted-foreground">Loading products...</p>
        ) : (
          <>
            <div className="lg:hidden space-y-3 min-w-0">
              {filtered.map((product) => (
                <div
                  key={product.id}
                  className="flex gap-3 rounded-xl border border-border bg-background/50 p-3 min-w-0"
                >
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md border border-border bg-muted">
                    <span className="absolute inset-0">
                      <ProductThumbImage
                        src={product.image || "/placeholder.svg"}
                        sizes="56px"
                        unoptimized={(product.image || "").startsWith("http")}
                      />
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-sans text-sm font-medium text-foreground line-clamp-2">{product.name}</p>
                    <p className="font-sans text-[10px] text-muted-foreground truncate mt-0.5">{product.id}</p>
                    <p className="font-sans text-xs text-muted-foreground mt-1">{product.category}</p>
                    <p className="font-sans text-[11px] text-muted-foreground mt-0.5">
                      Stock:{" "}
                      {typeof product.inventoryQuantity === "number"
                        ? `${product.inventoryQuantity} ${product.inStock ? "" : "(sold out)"}`
                        : "Unlimited"}
                    </p>
                    <p className="font-sans text-sm mt-1">
                      {product.currency === "USD" ? "$" : `${product.currency} `}
                      {product.price.toFixed(2)}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
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
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="hidden lg:block w-full min-w-0">
              <table className="w-full table-fixed border-collapse text-sm">
                <colgroup>
                  <col className="w-12" />
                  <col />
                  <col className="w-[22%] max-w-[10rem]" />
                  <col className="w-20" />
                  <col className="w-24" />
                  <col className="w-36" />
                </colgroup>
                <thead>
                  <tr className="border-b border-border">
                    <th className="py-2" aria-hidden />
                    <th className="text-left py-2 pr-2 font-sans text-xs uppercase tracking-[0.12em] text-muted-foreground">
                      Product
                    </th>
                    <th className="text-left py-2 pr-2 font-sans text-xs uppercase tracking-[0.12em] text-muted-foreground">
                      Category
                    </th>
                    <th className="text-left py-2 pr-2 font-sans text-xs uppercase tracking-[0.12em] text-muted-foreground">
                      Price
                    </th>
                    <th className="text-left py-2 pr-2 font-sans text-xs uppercase tracking-[0.12em] text-muted-foreground">
                      Stock
                    </th>
                    <th className="text-right py-2 font-sans text-xs uppercase tracking-[0.12em] text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((product) => (
                    <tr key={product.id} className="border-b border-border/60">
                      <td className="py-2.5 pr-1 align-middle">
                        <div className="relative h-9 w-9 overflow-hidden rounded-md border border-border bg-muted">
                          <span className="absolute inset-0">
                            <ProductThumbImage
                              src={product.image || "/placeholder.svg"}
                              sizes="36px"
                              unoptimized={(product.image || "").startsWith("http")}
                            />
                          </span>
                        </div>
                      </td>
                      <td className="py-2.5 pr-2 align-middle min-w-0">
                        <p className="font-sans text-foreground truncate">{product.name}</p>
                        <p className="font-sans text-[10px] text-muted-foreground truncate">{product.id}</p>
                      </td>
                      <td className="py-2.5 pr-2 align-middle text-muted-foreground truncate">{product.category}</td>
                      <td className="py-2.5 pr-2 align-middle whitespace-nowrap">
                        {product.currency === "USD" ? "$" : `${product.currency} `}
                        {product.price.toFixed(2)}
                      </td>
                      <td className="py-2.5 pr-2 align-middle whitespace-nowrap text-muted-foreground">
                        {typeof product.inventoryQuantity === "number"
                          ? `${product.inventoryQuantity}${product.inStock ? "" : " (sold out)"}`
                          : "∞"}
                      </td>
                      <td className="py-2.5 text-right align-middle">
                        <div className="flex flex-col gap-1 items-end">
                          <button
                            type="button"
                            onClick={() => selectForEdit(product)}
                            className="rounded-md border border-input px-2 py-1 font-sans text-xs hover:bg-muted w-full max-w-[5.5rem]"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => archiveProduct(product.id)}
                            disabled={saving}
                            className="rounded-md border border-destructive/40 px-2 py-1 font-sans text-xs text-destructive hover:bg-destructive/10 disabled:opacity-50 w-full max-w-[5.5rem]"
                          >
                            Archive
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      <div className="rounded-2xl border border-border bg-card p-3 sm:p-4 shadow-sm w-full min-w-0 max-w-full xl:sticky xl:top-20 xl:self-start">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-sans text-sm font-medium tracking-wide text-foreground">Create product</h4>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
            <input
              type="number"
              min={0}
              step={1}
              value={form.inventoryQuantity}
              onChange={(e) => setForm((prev) => ({ ...prev, inventoryQuantity: e.target.value }))}
              placeholder="0"
              className="w-full rounded-md border border-input bg-background px-3 py-2 font-sans text-sm"
              required
            />
          </div>
          <p className="font-sans text-xs text-muted-foreground">
            Currency is fixed to USD. Inventory quantity of 0 marks the product sold out.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
              {tagOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <p className="font-sans text-xs text-muted-foreground">
              Images (optional). Select multiple files in order: the first image is sent to Stripe; the full set is stored in your database when DATABASE_URL is set.
            </p>
            <input
              ref={createFileInputRef}
              type="file"
              accept={acceptImages}
              multiple
              className="sr-only"
              aria-hidden
              onChange={(e) => {
                const list = e.target.files
                if (!list?.length) return
                const next = [...createImageFiles, ...list].slice(0, MAX_GALLERY_IMAGES)
                setCreateImageFiles(next)
                e.target.value = ""
              }}
            />
            <button
              type="button"
              onClick={() => createFileInputRef.current?.click()}
              className="w-full rounded-md border border-input bg-background px-3 py-2 font-sans text-sm hover:bg-muted"
            >
              Add images ({createImageFiles.length}/{MAX_GALLERY_IMAGES})
            </button>
            {createFilePreviews.length > 0 && (
              <ul className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {createFilePreviews.map((src, i) => (
                  <li key={`${i}-${src}`} className="relative aspect-square w-full overflow-hidden rounded-md border border-border">
                    <ProductFrameImage
                      src={src}
                      alt=""
                      sizes="120px"
                      unoptimized
                      className="absolute inset-0 rounded-md"
                    />
                    <span className="absolute left-1 top-1 z-10 rounded bg-background/90 px-1 font-sans text-[10px]">
                      {i === 0 ? "1 · Stripe" : `${i + 1}`}
                    </span>
                    <button
                      type="button"
                      onClick={() => setCreateImageFiles((prev) => prev.filter((_, j) => j !== i))}
                      className="absolute right-1 top-1 z-10 rounded bg-background/90 px-1 font-sans text-[10px] text-destructive"
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
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
      </div>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="w-[calc(100vw-1.5rem)] max-w-2xl max-h-[min(90dvh,44rem)] overflow-y-auto overflow-x-hidden sm:w-full p-4 sm:p-6 left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]">
          <DialogHeader>
            <DialogTitle>Edit product</DialogTitle>
            <DialogDescription>
              Gallery order is how the shop shows images. The first image is synced to Stripe. Changes to images apply immediately.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={updateProduct} className="space-y-3">
            <div className="rounded-lg border border-border bg-muted/30 p-3 space-y-2">
              <p className="font-sans text-xs font-medium text-foreground">Images</p>
              <p className="font-sans text-xs text-muted-foreground">
                Reorder with arrows. Remove deletes the image. Stripe always uses the first image in the list. Up to{" "}
                {MAX_GALLERY_IMAGES} images.
              </p>
              {editGalleryUrls.length > 0 && (
                <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {editGalleryUrls.map((url, i) => (
                    <li
                      key={`${url}-${i}`}
                      className="relative aspect-square w-full overflow-hidden rounded-md border border-border"
                    >
                      <ProductFrameImage
                        src={url}
                        alt=""
                        sizes="160px"
                        unoptimized={url.startsWith("http")}
                        className="absolute inset-0 rounded-md"
                      />
                      <span className="absolute left-1 top-1 z-10 rounded bg-background/90 px-1 font-sans text-[10px]">
                        {i === 0 ? "1 · Stripe" : `${i + 1}`}
                      </span>
                      <div className="absolute right-1 top-1 z-10 flex flex-col gap-0.5">
                        <button
                          type="button"
                          disabled={gallerySaving || i === 0}
                          onClick={() => editMoveGallery(i, -1)}
                          className="rounded bg-background/90 p-0.5 hover:bg-background disabled:opacity-30"
                          aria-label="Move earlier"
                        >
                          <ChevronUp className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={gallerySaving || i === editGalleryUrls.length - 1}
                          onClick={() => editMoveGallery(i, 1)}
                          className="rounded bg-background/90 p-0.5 hover:bg-background disabled:opacity-30"
                          aria-label="Move later"
                        >
                          <ChevronDown className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <button
                        type="button"
                        disabled={gallerySaving}
                        onClick={() => editRemoveGallery(i)}
                        className="absolute bottom-1 left-1 right-1 z-10 rounded bg-background/90 py-0.5 font-sans text-[10px] text-destructive hover:bg-background"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              <input
                ref={galleryFileInputRef}
                type="file"
                accept={acceptImages}
                multiple
                className="sr-only"
                aria-hidden
                onChange={(e) => {
                  editAddGalleryFiles(e.target.files)
                  e.target.value = ""
                }}
              />
              <button
                type="button"
                disabled={gallerySaving || editGalleryUrls.length >= MAX_GALLERY_IMAGES}
                onClick={() => galleryFileInputRef.current?.click()}
                className="w-full rounded-md border border-input bg-background px-3 py-2 font-sans text-xs hover:bg-muted disabled:opacity-50"
              >
                {gallerySaving ? "Saving…" : "Add images"}
              </button>
            </div>

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
            <input
              type="number"
              min={0}
              step={1}
              value={editForm.inventoryQuantity}
              onChange={(e) => setEditForm((prev) => ({ ...prev, inventoryQuantity: e.target.value }))}
              placeholder="0"
              className="w-full rounded-md border border-input bg-background px-3 py-2 font-sans text-sm"
              required
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                {tagOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
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
