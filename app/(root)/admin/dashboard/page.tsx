import React from 'react'
import { Separator } from "@/components/ui/separator"
import { StatsCards } from './components/stats-cards'
import { StoreToggle } from './components/store-toggle'
import { RecentOrders } from './components/recent-orders'

export default function DashboardPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
        <div className="flex items-center space-x-2">
          <StoreToggle />
        </div>
      </div>
      <Separator />
      <div className="space-y-4">
        <StatsCards />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <div className="col-span-4">
            <div className="rounded-xl border bg-card text-card-foreground shadow">
              <div className="p-6 flex flex-row items-center justify-between">
                <h3 className="font-semibold leading-none tracking-tight">Recent Orders</h3>
              </div>
              <div className="p-6 pt-0">
                <RecentOrders />
              </div>
            </div>
          </div>
          <div className="col-span-3">
            {/* Placeholder for other widgets like popular items or feedback */}
            <div className="rounded-xl border bg-card text-card-foreground shadow h-full p-6">
              <h3 className="font-semibold leading-none tracking-tight mb-4">Store Overview</h3>
              <p className="text-sm text-muted-foreground">More charts or insights can go here.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
