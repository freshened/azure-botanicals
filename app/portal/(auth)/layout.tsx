export default function PortalAuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-background via-card/40 to-muted/20">
      <div className="w-full max-w-md">{children}</div>
    </div>
  )
}
