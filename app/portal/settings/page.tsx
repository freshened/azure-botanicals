import { CountdownForm } from "@/components/countdown-form"

export const metadata = {
  title: "Settings | Azure Botanicals",
}

export default function PortalSettingsPage() {
  return (
    <div className="space-y-8 max-w-xl">
      <div>
        <p className="font-sans text-xs tracking-[0.2em] uppercase text-accent mb-2">Settings</p>
        <h1 className="font-serif text-2xl lg:text-3xl tracking-tight">Site banner</h1>
        <p className="font-sans text-sm text-muted-foreground mt-2">
          Control the rotating banner countdown on the public site.
        </p>
      </div>
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h2 className="font-sans text-sm font-medium tracking-wide text-foreground mb-4">
          New plant drop countdown
        </h2>
        <CountdownForm />
      </div>
    </div>
  )
}
