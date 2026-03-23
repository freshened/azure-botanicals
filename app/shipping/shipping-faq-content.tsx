"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const shippingItems = [
  {
    q: "When will my order be shipped?",
    a: "Processing time usually takes around 1–3 business days. We ship plants on Mondays to ensure packages don't sit in transit over weekends. You will receive a confirmation email with tracking once your order is processed.",
  },
  {
    q: "Where do you ship from and to?",
    a: "Plants are shipped from our licensed nursery based in California. We ship only within the US. No international shipping at this time.",
  },
  {
    q: "Winter shipping for plants?",
    a: "Please check your weather before shipping to ensure safe arrival. If temps are 40°F - 50°F, we recommend adding 72 hr heat pack with insulation. If temps are below 40°F, we recommend adding 72 hr heat pack with double insulation thermal wrap. If temps are above 90°F, we recommend adding cold pack with insulation.",
  },
]

const faqItems = [
  {
    q: "Return or exchange?",
    a: "All sales are final. No returns or exchanges. We offer live arrival guarantee and pack each plant securely. Shipping delays or damages beyond our control are not our responsibility. We are not responsible for theft or missing packages after delivery.",
  },
  {
    q: "Live arrival guarantee?",
    a: "We guarantee live arrival for UPS Next day shipping only. Unboxing video must be sent within 2 hours upon arrival, given that the package arrives without transportation delay or weather damage. Video needs to start before the box is opened. Please bring plants in as soon as it's delivered. Note: Shipping stress and damage may occur even with the most careful packaging. Minor damage to leaf/stem is sometimes unavoidable. We are not responsible for any shipping-related damage.",
  },
  {
    q: "Cancellation policy?",
    a: "We do not allow cancellations once an order is placed. We appreciate your understanding.",
  },
  {
    q: "What medium do you ship plants in?",
    a: "Plants are shipped in the medium they are currently planted in (as seen in product photos), unless otherwise stated.",
  },
]

export function ShippingFaqContent() {
  return (
    <>
      <h2 className="font-serif text-xl lg:text-2xl tracking-tight mt-12 mb-6">
        Shipping
      </h2>
      <Accordion type="single" collapsible className="w-full">
        {shippingItems.map((item, i) => (
          <AccordionItem key={i} value={`shipping-${i}`}>
            <AccordionTrigger className="font-sans text-left">
              {item.q}
            </AccordionTrigger>
            <AccordionContent className="font-sans text-muted-foreground">
              {item.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <h2 className="font-serif text-xl lg:text-2xl tracking-tight mt-16 mb-6">
        FAQs
      </h2>
      <Accordion type="single" collapsible className="w-full">
        {faqItems.map((item, i) => (
          <AccordionItem key={i} value={`faq-${i}`}>
            <AccordionTrigger className="font-sans text-left">
              {item.q}
            </AccordionTrigger>
            <AccordionContent className="font-sans text-muted-foreground">
              {item.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </>
  )
}
