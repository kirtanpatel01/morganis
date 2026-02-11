import { DashboardStats, WebOrder, StoreStatus } from "../types";

// Mock Data
const MOCK_STATS: DashboardStats = {
  totalOrders: 154,
  totalRevenue: 12500.50,
  activeOrders: 5,
  lowStockItems: 3,
};

const MOCK_ORDERS: WebOrder[] = [
  {
    id: "ORD-001",
    customerName: "Alice Johnson",
    customerEmail: "alice@example.com",
    phoneNumber: "+1234567890",
    items: [
      { name: "Burger", quantity: 2, price: 10 },
      { name: "Fries", quantity: 1, price: 5 },
    ],
    totalAmount: 25,
    status: "pending",
    createdAt: new Date().toISOString(),
    paymentMethod: "online",
  },
  {
    id: "ORD-002",
    customerName: "Bob Smith",
    customerEmail: "bob@example.com",
    phoneNumber: "+1987654321",
    items: [
      { name: "Pizza", quantity: 1, price: 15 },
    ],
    totalAmount: 15,
    status: "accepted",
    createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(), // 10 mins ago
    paymentMethod: "cash",
  },
  {
    id: "ORD-003",
    customerName: "Charlie Brown",
    customerEmail: "charlie@example.com",
    phoneNumber: "+1122334455",
    items: [
      { name: "Salad", quantity: 1, price: 12 },
      { name: "Water", quantity: 1, price: 2 },
    ],
    totalAmount: 14,
    status: "completed",
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
    paymentMethod: "online",
  },
];

let mockStoreStatus: StoreStatus = { isOpen: true };

// API Functions
export const fetchDashboardStats = async (): Promise<DashboardStats> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  return MOCK_STATS;
};

export const fetchRecentOrders = async (): Promise<WebOrder[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return MOCK_ORDERS;
};

export const fetchStoreStatus = async (): Promise<StoreStatus> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return mockStoreStatus;
};

export const updateStoreStatus = async (isOpen: boolean): Promise<StoreStatus> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  mockStoreStatus = { isOpen };
  return mockStoreStatus;
};

export const updateOrderStatus = async (orderId: string, status: WebOrder['status']): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const orderIndex = MOCK_ORDERS.findIndex(o => o.id === orderId);
    if(orderIndex > -1){
        MOCK_ORDERS[orderIndex].status = status;
    }
}
