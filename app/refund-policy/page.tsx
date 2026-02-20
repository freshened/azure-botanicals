export const metadata = {
  title: "Refund & Cancellation Policy | Azure Botanicals",
  description: "Refund and cancellation policy for Azure Botanicals.",
}

export default function RefundPolicyPage() {
  return (
    <div className="py-24 lg:py-32">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        <p className="font-sans text-xs tracking-[0.3em] uppercase text-accent mb-4">
          Policies
        </p>
        <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl tracking-tight">
          Refund & Cancellation Policy
        </h1>
        <div className="mt-10 space-y-6 font-sans text-base leading-relaxed text-muted-foreground">
          <p>
            All sales are final. We do not offer refunds or exchanges on plant orders.
          </p>
          <p>
            We guarantee live arrival when our unpacking and reporting requirements are met. Shipping delays or damages beyond our control are not our responsibility. We are not responsible for theft or missing packages after delivery.
          </p>
          <p>
            We do not allow order cancellations once an order has been placed. We appreciate your understanding.
          </p>
          <p>
            For questions, please contact us at the link below.
          </p>
        </div>
      </div>
    </div>
  )
}
