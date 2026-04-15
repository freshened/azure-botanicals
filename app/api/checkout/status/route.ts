import { NextResponse } from "next/server"
import { isDatabaseConfigured, prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const paymentIntentId = searchParams.get("payment_intent")?.trim()
  if (!paymentIntentId) {
    return NextResponse.json({ error: "payment_intent is required." }, { status: 400 })
  }
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ confirmed: false, status: "pending" })
  }
  const order = await prisma.order.findUnique({
    where: { paymentIntentId },
    select: { id: true, status: true },
  })
  if (!order) {
    return NextResponse.json({ confirmed: false, status: "pending" })
  }
  return NextResponse.json({
    confirmed: order.status === "paid",
    status: order.status,
    orderId: order.id,
  })
}
