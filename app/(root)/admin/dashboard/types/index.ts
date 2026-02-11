export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  activeOrders: number;
  lowStockItems: number;
}

export interface WebOrder {
  id: string;
  customerName: string;
  customerEmail: string;
  phoneNumber: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  status: 'pending' | 'accepted' | 'completed' | 'paid_and_completed' | 'cancelled';
  createdAt: string;
  paymentMethod?: 'cash' | 'online';
}

export interface StoreStatus {
  isOpen: boolean;
}
