import { PortalShell } from "@/components/portal-shell"

export default function PortalDashboardLayout({ children }: { children: React.ReactNode }) {
  return <PortalShell>{children}</PortalShell>
}
