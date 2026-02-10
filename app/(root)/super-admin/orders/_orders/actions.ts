"use server"

import { ORDERS, STORES, STORE_STATS } from "./constants"
import type { Order, OrderFilters, DashboardOrderStats, StoreOrderStats } from "./types"

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * Get all orders with filtering
 */
export async function getOrders(filters?: OrderFilters): Promise<Order[]> {
  await delay(150)
  
  let result = [...ORDERS]
  
  if (filters?.storeId && filters.storeId !== "all") {
    result = result.filter((order) => order.storeId === filters.storeId)
  }
  
  if (filters?.status && filters.status !== "all") {
    result = result.filter((order) => order.status === filters.status)
  }
  
  if (filters?.search) {
    const search = filters.search.toLowerCase()
    result = result.filter(
      (order) =>
        order.orderId.toLowerCase().includes(search) ||
        order.customerName.toLowerCase().includes(search) ||
        order.customerEmail.toLowerCase().includes(search)
    )
  }
  
  // Date filtering logic would go here
  
  return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

/**
 * Get aggregate order statistics for the dashboard/top section
 */
export async function getOrderStats(): Promise<DashboardOrderStats> {
  await delay(100)
  
  const completedOrders = ORDERS.filter(o => o.status === "completed")
  const totalRevenue = completedOrders.reduce((sum, order) => sum + order.totalAmount, 0)
  
  return {
    totalOrders: ORDERS.length,
    totalRevenue: totalRevenue,
    totalSales: totalRevenue, // simplified for demo
    avgOrderValue: completedOrders.length > 0 ? Math.round(totalRevenue / completedOrders.length) : 0,
  }
}

/**
 * Get detailed performance stats for each store (for the report section)
 */
export async function getStorePerformanceStats(): Promise<StoreOrderStats[]> {
  await delay(200)
  // In a real app, we would aggregate this from the database
  return STORE_STATS
}

/**
 * Get list of stores for dropdown
 */
export async function getStoresList(): Promise<{ id: string; name: string }[]> {
  await delay(50)
  return STORES
}
