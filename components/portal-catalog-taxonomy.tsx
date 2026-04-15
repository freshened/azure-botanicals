"use client"

import { FormEvent, useCallback, useEffect, useState } from "react"
import { portalFetch } from "@/lib/portal-fetch"
import type { TaxonomyItem } from "@/lib/shop-taxonomy"

export function PortalCatalogTaxonomy() {
  const [categories, setCategories] = useState<TaxonomyItem[]>([])
  const [tags, setTags] = useState<TaxonomyItem[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState<string | null>(null)
  const [newCategory, setNewCategory] = useState("")
  const [newTag, setNewTag] = useState("")
  const [busy, setBusy] = useState(false)

  const load = useCallback(() => {
    setLoading(true)
    setMessage(null)
    fetch("/api/shop/taxonomy")
      .then((r) => r.json())
      .then((d) => {
        if (d?.categories) setCategories(d.categories)
        if (d?.tags) setTags(d.tags)
      })
      .catch(() => setMessage("Failed to load taxonomy."))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const addCategory = async (e: FormEvent) => {
    e.preventDefault()
    const name = newCategory.trim()
    if (!name) return
    setBusy(true)
    setMessage(null)
    try {
      const res = await portalFetch("/api/portal/taxonomy/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || "Failed to add category.")
      setNewCategory("")
      load()
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Failed to add category.")
    } finally {
      setBusy(false)
    }
  }

  const addTag = async (e: FormEvent) => {
    e.preventDefault()
    const name = newTag.trim()
    if (!name) return
    setBusy(true)
    setMessage(null)
    try {
      const res = await portalFetch("/api/portal/taxonomy/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || "Failed to add tag.")
      setNewTag("")
      load()
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Failed to add tag.")
    } finally {
      setBusy(false)
    }
  }

  const removeCategory = async (slug: string) => {
    if (!confirm("Delete this category? Products using it must be reassigned first.")) return
    setBusy(true)
    setMessage(null)
    try {
      const res = await portalFetch(
        `/api/portal/taxonomy/categories?slug=${encodeURIComponent(slug)}`,
        { method: "DELETE" }
      )
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || "Failed to delete.")
      load()
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Failed to delete.")
    } finally {
      setBusy(false)
    }
  }

  const removeTag = async (slug: string) => {
    if (!confirm("Delete this tag? Products using it must be updated first.")) return
    setBusy(true)
    setMessage(null)
    try {
      const res = await portalFetch(`/api/portal/taxonomy/tags?slug=${encodeURIComponent(slug)}`, {
        method: "DELETE",
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || "Failed to delete.")
      load()
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Failed to delete.")
    } finally {
      setBusy(false)
    }
  }

  if (loading) {
    return <p className="font-sans text-sm text-muted-foreground">Loading…</p>
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl">
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
        <h2 className="font-sans text-sm font-medium tracking-wide text-foreground">Categories</h2>
        <p className="font-sans text-xs text-muted-foreground">
          Shown in the shop filter and navbar. Product category must match a name here exactly.
        </p>
        <ul className="space-y-2 max-h-64 overflow-y-auto">
          {categories.map((c) => (
            <li
              key={c.slug}
              className="flex items-center justify-between gap-2 font-sans text-sm py-1.5 border-b border-border/60"
            >
              <span>
                <span className="text-foreground">{c.name}</span>
                <span className="text-muted-foreground text-xs ml-2">/{c.slug}</span>
              </span>
              <button
                type="button"
                disabled={busy}
                onClick={() => void removeCategory(c.slug)}
                className="text-xs text-destructive hover:underline disabled:opacity-50"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
        <form onSubmit={addCategory} className="flex gap-2 pt-2">
          <input
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="New category name"
            className="flex-1 rounded-md border border-input bg-background px-3 py-2 font-sans text-sm"
            disabled={busy}
          />
          <button
            type="submit"
            disabled={busy || !newCategory.trim()}
            className="rounded-md bg-primary px-3 py-2 font-sans text-sm text-primary-foreground disabled:opacity-50"
          >
            Add
          </button>
        </form>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
        <h2 className="font-sans text-sm font-medium tracking-wide text-foreground">Tags</h2>
        <p className="font-sans text-xs text-muted-foreground">
          Optional labels (New, Limited, …). Shown on cards and in the shop tag filter.
        </p>
        <ul className="space-y-2 max-h-64 overflow-y-auto">
          {tags.map((t) => (
            <li
              key={t.slug}
              className="flex items-center justify-between gap-2 font-sans text-sm py-1.5 border-b border-border/60"
            >
              <span>
                <span className="text-foreground">{t.name}</span>
                <span className="text-muted-foreground text-xs ml-2">/{t.slug}</span>
              </span>
              <button
                type="button"
                disabled={busy}
                onClick={() => void removeTag(t.slug)}
                className="text-xs text-destructive hover:underline disabled:opacity-50"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
        <form onSubmit={addTag} className="flex gap-2 pt-2">
          <input
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="New tag name"
            className="flex-1 rounded-md border border-input bg-background px-3 py-2 font-sans text-sm"
            disabled={busy}
          />
          <button
            type="submit"
            disabled={busy || !newTag.trim()}
            className="rounded-md bg-primary px-3 py-2 font-sans text-sm text-primary-foreground disabled:opacity-50"
          >
            Add
          </button>
        </form>
      </div>

      {message ? <p className="lg:col-span-2 font-sans text-sm text-destructive">{message}</p> : null}
    </div>
  )
}
