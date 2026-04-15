"use client"

import { useRouter } from "next/navigation"

export function usePortalSignOut() {
  const router = useRouter()
  return async () => {
    await fetch("/api/portal/auth/logout", { method: "POST" })
    router.replace("/portal/login")
    router.refresh()
  }
}
