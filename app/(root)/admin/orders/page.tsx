"use client";

import { OrdersTable } from "./components/orders-table";

export default function OrdersPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
          <p className="text-muted-foreground">Manage and track all customer orders.</p>
        </div>
      </div>
      <OrdersTable />
    </div>
  );
}
