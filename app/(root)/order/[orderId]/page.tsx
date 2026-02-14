import { notFound } from "next/navigation"
import { getOrder } from "../actions"
import { OrderStatus } from "./components/order-status"

interface OrderPageProps {
  params: Promise<{
    orderId: string
  }>
}

export default async function OrderPage({ params }: OrderPageProps) {
  const { orderId } = await params
  const order = await getOrder(orderId)

  if (!order) {
    notFound()
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground items-center justify-center p-4">
      <OrderStatus initialOrder={order} />
    </div>
  )
}
