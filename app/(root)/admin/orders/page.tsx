import { getOrders } from "./actions"
import { OrdersClient } from "./components/orders-client"
import { Separator } from "@/components/ui/separator"

export default async function OrdersPage() {
  const { orders, error } = await getOrders()

  if (error) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-8 text-destructive">
        Error loading orders: {error}
      </div>
    )
  }

  return (
    <div className="h-full flex-1 flex-col space-y-8 p-4 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Order Management</h2>
          <p className="text-muted-foreground">
            View and manage real-time orders from customers.
          </p>
        </div>
      </div>
      <Separator />
      <OrdersClient initialData={orders || []} />
    </div>
  )
}
