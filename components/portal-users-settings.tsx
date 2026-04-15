"use client"

import { useCallback, useEffect, useState } from "react"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { portalFetch } from "@/lib/portal-fetch"

type PortalUserRow = {
  id: string
  email: string
  createdAt: string
}

export function PortalUsersSettings() {
  const [users, setUsers] = useState<PortalUserRow[]>([])
  const [selfEmail, setSelfEmail] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState("")
  const [adding, setAdding] = useState(false)
  const [removingId, setRemovingId] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null)

  const load = useCallback(() => {
    setLoading(true)
    setMessage(null)
    portalFetch("/api/portal/users")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data?.users)) {
          setUsers(data.users as PortalUserRow[])
        }
        if (typeof data?.selfEmail === "string") {
          setSelfEmail(data.selfEmail)
        }
      })
      .catch(() => setMessage({ type: "error", text: "Could not load users." }))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const addUser = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = email.trim()
    if (!trimmed) return
    setAdding(true)
    setMessage(null)
    portalFetch("/api/portal/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: trimmed }),
    })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}))
        if (!res.ok) {
          throw new Error(typeof data?.error === "string" ? data.error : "Could not add user.")
        }
        setEmail("")
        load()
        setMessage({ type: "ok", text: "User added. They can request a sign-in code at the portal login page." })
      })
      .catch((err) =>
        setMessage({ type: "error", text: err instanceof Error ? err.message : "Could not add user." })
      )
      .finally(() => setAdding(false))
  }

  const removeUser = (id: string) => {
    if (!window.confirm("Remove this email from the portal? They will no longer be able to sign in.")) {
      return
    }
    setRemovingId(id)
    setMessage(null)
    portalFetch(`/api/portal/users?id=${encodeURIComponent(id)}`, { method: "DELETE" })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}))
        if (!res.ok) {
          throw new Error(typeof data?.error === "string" ? data.error : "Could not remove user.")
        }
        load()
        setMessage({ type: "ok", text: "User removed." })
      })
      .catch((err) =>
        setMessage({ type: "error", text: err instanceof Error ? err.message : "Could not remove user." })
      )
      .finally(() => setRemovingId(null))
  }

  if (loading) {
    return <p className="font-sans text-sm text-muted-foreground">Loading…</p>
  }

  const soleUser = users.length <= 1

  return (
    <div className="space-y-6">
      <form onSubmit={addUser} className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1 space-y-2 min-w-0">
          <Label htmlFor="portal-new-email">Email address</Label>
          <Input
            id="portal-new-email"
            type="email"
            autoComplete="email"
            placeholder="colleague@example.com"
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
            disabled={adding}
          />
        </div>
        <Button type="submit" disabled={adding || !email.trim()}>
          {adding ? "Adding…" : "Add user"}
        </Button>
      </form>

      {message ? (
        <p
          className={`font-sans text-sm ${message.type === "error" ? "text-destructive" : "text-muted-foreground"}`}
        >
          {message.text}
        </p>
      ) : null}

      <ul className="divide-y divide-border rounded-lg border border-border overflow-hidden">
        {users.length === 0 ? (
          <li className="px-4 py-6 font-sans text-sm text-muted-foreground">
            No portal users yet. Add an email above, or run{" "}
            <code className="text-xs bg-muted px-1 py-0.5 rounded">pnpm prisma db seed</code> with{" "}
            <code className="text-xs bg-muted px-1 py-0.5 rounded">PORTAL_SEED_EMAILS</code> set.
          </li>
        ) : (
          users.map((u) => {
            const isSelf = selfEmail !== null && u.email === selfEmail
            return (
              <li
                key={u.id}
                className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-card/50"
              >
                <div className="min-w-0">
                  <p className="font-sans text-sm text-foreground truncate flex flex-wrap items-center gap-2">
                    <span>{u.email}</span>
                    {isSelf ? (
                      <span className="shrink-0 rounded-md bg-primary/15 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-foreground">
                        You
                      </span>
                    ) : null}
                  </p>
                  <p className="font-sans text-xs text-muted-foreground mt-0.5">
                    Added {new Date(u.createdAt).toLocaleString()}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                  disabled={soleUser || removingId === u.id}
                  onClick={() => removeUser(u.id)}
                  aria-label={`Remove ${u.email}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </li>
            )
          })
        )}
      </ul>

      {soleUser && users.length > 0 ? (
        <p className="font-sans text-xs text-muted-foreground">
          You cannot remove the only portal user. Add another email first, then you can remove this one if needed.
        </p>
      ) : null}
    </div>
  )
}
