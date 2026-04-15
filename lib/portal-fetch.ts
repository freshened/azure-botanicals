export async function portalFetch(input: RequestInfo | URL, init?: RequestInit) {
  const res = await fetch(input, { ...init, credentials: "same-origin" })
  if (res.status === 401 && typeof window !== "undefined") {
    window.location.assign("/portal/login")
  }
  return res
}
