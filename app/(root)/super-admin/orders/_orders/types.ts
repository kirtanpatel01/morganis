export type OrderStatus = "pending" | "approved" | "rejected" | "processing" | "completed" | "cancelled"

export interface OrderItem {
  id: string
  name: string
  quantity: number
  price: number
}

export interface Order {
  id: string
  orderId: string
  storeId: string
  storeName: string
  customerName: string
  customerEmail: string
  items: OrderItem[]
  totalAmount: number
  status: OrderStatus
  createdAt: string
  updatedAt: string
}

export interface StoreOrderStats {
  storeId: string
  storeName: string
  totalOrders: number
  totalRevenue: number
  avgOrderValue: number
  monthlyOrders: { month: string; orders: number; revenue: number }[]
  yearlyOrders: { year: string; orders: number; revenue: number }[]
}

export interface OrderFilters {
  search?: string
  status?: OrderStatus | "all"
  storeId?: string | "all"
  startDate?: Date
  endDate?: Date
}

export interface DashboardOrderStats {
  totalOrders: number
  totalRevenue: number
  totalSales: number // Same as revenue but maybe strictly completed orders
  avgOrderValue: number
}
