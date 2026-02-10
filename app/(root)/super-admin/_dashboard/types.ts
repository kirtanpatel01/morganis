// Types for Super Admin Dashboard

export type OrderStatus = "pending" | "approved" | "rejected" | "processing" | "completed" | "cancelled"
export type StoreStatus = "active" | "inactive" | "pending"

export interface DashboardStats {
  totalStores: number
  totalOrders: number
  totalRevenue: number
  activeStores: number
}

export interface Store {
  id: string
  storeId: string
  name: string
  gstin: string
  address: string
  stateCode?: string
  status: StoreStatus
  createdAt: string
  adminEmail?: string
}

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

export interface StoreTableProps {
  stores: Store[]
  onCreateStore?: () => void
}

export interface OrderTableProps {
  orders: Order[]
  onApprove?: (orderId: string) => void
  onReject?: (orderId: string) => void
}

export interface StatsCardsProps {
  stats: DashboardStats
}
