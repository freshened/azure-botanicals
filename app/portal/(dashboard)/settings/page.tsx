import { CountdownForm } from "@/components/countdown-form"
import { PortalUsersSettings } from "@/components/portal-users-settings"

export const metadata = {
  title: "Settings | Azure Botanicals",
}

export default function PortalSettingsPage() {
  return (
    <div className="space-y-12 max-w-2xl">
      <div>
        <p className="font-sans text-xs tracking-[0.2em] uppercase text-accent mb-2">Settings</p>
        <h1 className="font-serif text-2xl lg:text-3xl tracking-tight">Site and portal</h1>
        <p className="font-sans text-sm text-muted-foreground mt-2">
          Banner countdown, and who may sign into the admin portal with email codes.
        </p>
      </div>
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h2 className="font-sans text-sm font-medium tracking-wide text-foreground mb-4">
          New plant drop countdown
        </h2>
        <CountdownForm />
      </div>
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h2 className="font-sans text-sm font-medium tracking-wide text-foreground mb-1">
          Portal users
        </h2>
        <p className="font-sans text-sm text-muted-foreground mb-6">
          Only addresses listed here receive a sign-in code. Add teammates before they try to log in.
        </p>
        <PortalUsersSettings />
      </div>
    </div>
  )
}
