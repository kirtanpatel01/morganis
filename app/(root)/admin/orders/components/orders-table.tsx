"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { OrderRow } from "./order-row"
import type { Database } from "../../../../../types/supabase"

type Order = Database["public"]["Tables"]["orders"]["Row"] & {
    order_items: Database["public"]["Tables"]["order_items"]["Row"][]
}

interface OrdersTableProps {
  orders: Order[]
  showActions?: boolean
}

export function OrdersTable({ orders, showActions = true }: OrdersTableProps) {
  if (orders.length === 0) {
    return (
      <div className="flex h-40 flex-col items-center justify-center rounded-md border text-center text-muted-foreground">
        No orders found.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Mobile Card View */}
      <div className="flex flex-col gap-4 lg:hidden">
        {orders.map((order) => (
          <OrderRow key={order.id} order={order} showActions={showActions} variant="card" />
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment</TableHead>
              {showActions && <TableHead className="text-right">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <OrderRow key={order.id} order={order} showActions={showActions} variant="table" />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
