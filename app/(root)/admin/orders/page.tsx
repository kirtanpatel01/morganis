import { getOrders } from "./actions"
import { OrdersClient } from "./components/orders-client"

export default async function OrdersPage() {
  const { orders, error } = await getOrders()

  if (error) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-4 sm:p-6 text-destructive">
        Error loading orders: {error}
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6">
      <OrdersClient initialData={orders || []} />
    </div>
  )
}
