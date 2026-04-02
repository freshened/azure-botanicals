"use client"

import { useState, useEffect } from "react"

function toLocalDatetime(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ""
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  const h = String(d.getHours()).padStart(2, "0")
  const min = String(d.getMinutes()).padStart(2, "0")
  return `${y}-${m}-${day}T${h}:${min}`
}

export function CountdownForm() {
  const [target, setTarget] = useState("")
  const [countdownEnabled, setCountdownEnabled] = useState(true)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null)

  useEffect(() => {
    fetch("/api/countdown")
      .then((res) => res.json())
      .then((data) => {
        if (data?.target) setTarget(toLocalDatetime(data.target))
        if (typeof data?.countdownEnabled === "boolean") setCountdownEnabled(data.countdownEnabled)
      })
      .finally(() => setLoading(false))
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!target.trim()) return
    setSaving(true)
    setMessage(null)
    fetch("/api/countdown", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        target: new Date(target).toISOString(),
        countdownEnabled,
      }),
    })
      .then((res) => {
        if (res.ok) setMessage({ type: "ok", text: "Countdown updated." })
        else return res.json().then((d) => { throw new Error(d?.error || "Failed") })
      })
      .catch((err) => setMessage({ type: "error", text: err.message || "Failed to save." }))
      .finally(() => setSaving(false))
  }

  if (loading) {
    return (
      <p className="font-sans text-sm text-muted-foreground">Loading…</p>
    )
  }

  const saveToggle = (next: boolean) => {
    setCountdownEnabled(next)
    setSaving(true)
    setMessage(null)
    fetch("/api/countdown", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ countdownEnabled: next }),
    })
      .then((res) => {
        if (res.ok) setMessage({ type: "ok", text: next ? "Countdown shown in banner." : "Countdown hidden from banner." })
        else return res.json().then((d) => { throw new Error(d?.error || "Failed") })
      })
      .catch((err) => setMessage({ type: "error", text: err.message || "Failed to save." }))
      .finally(() => setSaving(false))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center gap-3">
        <input
          id="countdown-enabled"
          type="checkbox"
          checked={countdownEnabled}
          onChange={(e) => saveToggle(e.target.checked)}
          disabled={saving}
          className="h-4 w-4 rounded border-input"
        />
        <label htmlFor="countdown-enabled" className="font-sans text-sm text-foreground">
          Show countdown in site banner
        </label>
      </div>
      <div>
        <label htmlFor="countdown-target" className="block font-sans text-xs font-medium text-foreground mb-1.5">
          New plant drop date & time
        </label>
        <input
          id="countdown-target"
          type="datetime-local"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          className="w-full max-w-xs rounded-md border border-input bg-background px-3 py-2 font-sans text-sm"
        />
      </div>
      <button
        type="submit"
        disabled={saving}
        className="font-sans text-sm px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
      >
        {saving ? "Saving…" : "Save"}
      </button>
      {message && (
        <p className={`font-sans text-sm ${message.type === "ok" ? "text-green-600" : "text-destructive"}`}>
          {message.text}
        </p>
      )}
    </form>
  )
}
