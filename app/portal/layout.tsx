import { PortalShell } from "@/components/portal-shell"

export const metadata = {
  title: "Portal | Azure Botanicals",
  description: "Site admin dashboard for Azure Botanicals.",
}

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <PortalShell>{children}</PortalShell>
}
