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
    a: "Processing time usually takes around 1–3 business days. We ship plants on select days to ensure packages don't sit in transit over weekends. You will receive a confirmation email with tracking once your order is processed.",
  },
  {
    q: "Where do you ship from and to?",
    a: "Plants are shipped from our nursery. We currently ship within the US. No international shipping at this time.",
  },
  {
    q: "How are plants packed?",
    a: "All live plants are safely packed and secured using materials such as polyfill, cardboard, and cushioning to ensure safe transit.",
  },
  {
    q: "Winter shipping for plants?",
    a: "We check destination weather before shipping to ensure safe arrival. Insulated wrap is provided when needed. Heat packs may be added for free if your local weather is below a set threshold.",
  },
]

const faqItems = [
  {
    q: "Return or exchange?",
    a: "All sales are final. No returns or exchanges. We offer live arrival guarantee and pack each plant securely. Shipping delays or damages beyond our control are not our responsibility. We are not responsible for theft or missing packages after delivery.",
  },
  {
    q: "Live arrival guarantee?",
    a: "We guarantee live arrival when an unpacking video is sent within the required time upon arrival, and the package arrives without transportation or weather damage. Minor leaf or stem damage from shipping can sometimes occur. Please bring the plant indoors as soon as it's delivered.",
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
