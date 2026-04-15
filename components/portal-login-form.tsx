"use client"

import { FormEvent, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { REGEXP_ONLY_DIGITS } from "input-otp"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"

type Step = "email" | "code"

export function PortalLoginForm() {
  const router = useRouter()
  const [step, setStep] = useState<Step>("email")
  const [email, setEmail] = useState("")
  const [code, setCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const requestCode = async (event: FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setMessage(null)
    try {
      const res = await fetch("/api/portal/auth/request-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (res.status === 429) {
        setMessage(typeof data.error === "string" ? data.error : "Too many requests.")
        return
      }
      if (!res.ok) {
        setMessage(typeof data.error === "string" ? data.error : "Something went wrong.")
        return
      }
      setStep("code")
      setMessage(
        typeof data.message === "string"
          ? data.message
          : "If that address can receive a sign-in code, an email was sent. It may take a minute to arrive."
      )
    } catch {
      setMessage("Network error. Try again.")
    } finally {
      setLoading(false)
    }
  }

  const verify = async (event: FormEvent) => {
    event.preventDefault()
    if (code.length !== 6) return
    setLoading(true)
    setMessage(null)
    try {
      const res = await fetch("/api/portal/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      })
      const data = await res.json()
      if (!res.ok) {
        setMessage(typeof data.error === "string" ? data.error : "Invalid or expired code.")
        return
      }
      router.replace("/portal")
      router.refresh()
    } catch {
      setMessage("Network error. Try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-8 shadow-sm space-y-6">
      <div>
        <p className="font-serif text-xl tracking-tight text-foreground">Portal sign-in</p>
        <p className="font-sans text-sm text-muted-foreground mt-2">
          {step === "email"
            ? "Enter your work email. We will send a one-time code if your address is authorized."
            : "Enter the 6-digit code from your email."}
        </p>
      </div>

      {step === "email" ? (
        <form onSubmit={requestCode} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="portal-email">Email</Label>
            <Input
              id="portal-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="bg-background"
            />
          </div>
          {message ? <p className="font-sans text-sm text-destructive">{message}</p> : null}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Sending…" : "Continue"}
          </Button>
        </form>
      ) : (
        <form onSubmit={verify} className="space-y-4">
          <div className="space-y-2">
            <Label>6-digit code</Label>
            <InputOTP
              maxLength={6}
              pattern={REGEXP_ONLY_DIGITS}
              value={code}
              onChange={setCode}
              disabled={loading}
              containerClassName="justify-center"
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>
          {message ? (
            <p
              className={`font-sans text-sm ${message.includes("expired") || message.includes("Invalid") ? "text-destructive" : "text-muted-foreground"}`}
            >
              {message}
            </p>
          ) : null}
          <div className="flex flex-col gap-2">
            <Button type="submit" className="w-full" disabled={loading || code.length !== 6}>
              {loading ? "Checking…" : "Sign in"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="w-full"
              disabled={loading}
              onClick={() => {
                setStep("email")
                setCode("")
                setMessage(null)
              }}
            >
              Use a different email
            </Button>
          </div>
        </form>
      )}

      <p className="font-sans text-xs text-muted-foreground text-center pt-2 border-t border-border">
        <Link href="/" className="text-accent hover:underline">
          ← Back to site
        </Link>
      </p>
    </div>
  )
}
