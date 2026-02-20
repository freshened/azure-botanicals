export const metadata = {
  title: "Privacy Policy | Azure Botanicals",
  description: "Privacy policy for Azure Botanicals.",
}

export default function PrivacyPage() {
  return (
    <div className="py-24 lg:py-32">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        <p className="font-sans text-xs tracking-[0.3em] uppercase text-accent mb-4">
          Legal
        </p>
        <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl tracking-tight">
          Privacy Policy
        </h1>
        <div className="mt-10 space-y-6 font-sans text-base leading-relaxed text-muted-foreground">
          <p>
            Azure Botanicals respects your privacy. We collect only the information needed to process orders and communicate with you.
          </p>
          <p>
            We do not sell your personal information. Data is used for order fulfillment, customer service, and, with your consent, marketing (e.g. newsletter).
          </p>
          <p>
            We may update this policy from time to time. Continued use of the site after changes constitutes acceptance.
          </p>
          <p>
            For questions about your data or this policy, please contact us.
          </p>
        </div>
      </div>
    </div>
  )
}
