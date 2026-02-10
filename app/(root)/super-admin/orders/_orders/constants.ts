import { Order, StoreOrderStats } from "./types"

// Helper to generate dates relative to today
const getDate = (daysAgo: number) => {
  const date = new Date()
  date.setDate(date.getDate() - daysAgo)
  return date.toISOString()
}

export const STORES = [
  { id: "1", name: "Hari har Restaurant" },
  { id: "2", name: "Shiva Nasta House" },
  { id: "3", name: "Venkatesh" },
  { id: "4", name: "vv demo" },
]

export const ORDERS: Order[] = [
  // Recent Orders
  {
    id: "1",
    orderId: "ORD-2026020901",
    storeId: "1",
    storeName: "Hari har Restaurant",
    customerName: "Rahul Sharma",
    customerEmail: "rahul.sharma@gmail.com",
    items: [
      { id: "1", name: "Paneer Tikka", quantity: 2, price: 250 },
      { id: "2", name: "Butter Naan", quantity: 4, price: 40 },
    ],
    totalAmount: 660,
    status: "pending",
    createdAt: getDate(0),
    updatedAt: getDate(0),
  },
  {
    id: "2",
    orderId: "ORD-2026020902",
    storeId: "2",
    storeName: "Shiva Nasta House",
    customerName: "Priya Patel",
    customerEmail: "priya.patel@gmail.com",
    items: [
      { id: "1", name: "Samosa", quantity: 6, price: 15 },
      { id: "2", name: "Chai", quantity: 6, price: 20 },
    ],
    totalAmount: 210,
    status: "completed",
    createdAt: getDate(1),
    updatedAt: getDate(1),
  },
  {
    id: "3",
    orderId: "ORD-2026020903",
    storeId: "3",
    storeName: "Venkatesh",
    customerName: "Amit Kumar",
    customerEmail: "amit.kumar@gmail.com",
    items: [
      { id: "1", name: "Dosa", quantity: 3, price: 80 },
      { id: "2", name: "Filter Coffee", quantity: 3, price: 30 },
    ],
    totalAmount: 330,
    status: "processing",
    createdAt: getDate(2),
    updatedAt: getDate(2),
  },
  {
    id: "4",
    orderId: "ORD-2026020904",
    storeId: "1",
    storeName: "Hari har Restaurant",
    customerName: "Sneha Gupta",
    customerEmail: "sneha.gupta@gmail.com",
    items: [
      { id: "3", name: "Dal Makhani", quantity: 1, price: 180 },
      { id: "4", name: "Jeera Rice", quantity: 1, price: 120 },
    ],
    totalAmount: 300,
    status: "completed",
    createdAt: getDate(5),
    updatedAt: getDate(5),
  },
  {
    id: "5",
    orderId: "ORD-2026020905",
    storeId: "4",
    storeName: "vv demo",
    customerName: "Vikram Singh",
    customerEmail: "vikram.singh@gmail.com",
    items: [
      { id: "5", name: "Burger", quantity: 2, price: 120 },
      { id: "6", name: "Fries", quantity: 1, price: 80 },
    ],
    totalAmount: 320,
    status: "cancelled",
    createdAt: getDate(10),
    updatedAt: getDate(10),
  },
  // Add more historical data for stats
  {
    id: "6",
    orderId: "ORD-2026011501",
    storeId: "1",
    storeName: "Hari har Restaurant",
    customerName: "Anjali Desai",
    customerEmail: "anjali.d@gmail.com",
    items: [{ id: "1", name: "Thali", quantity: 2, price: 250 }],
    totalAmount: 500,
    status: "completed",
    createdAt: getDate(25), // Last month
    updatedAt: getDate(25),
  },
   {
    id: "7",
    orderId: "ORD-2026011502",
    storeId: "2",
    storeName: "Shiva Nasta House",
    customerName: "Rajesh Koothrappali",
    customerEmail: "rajesh.k@gmail.com",
    items: [{ id: "1", name: "Vada Pav", quantity: 5, price: 20 }],
    totalAmount: 100,
    status: "completed",
    createdAt: getDate(26), // Last month
    updatedAt: getDate(26),
  },
]

// Pre-calculated stats for the "Store Performance" table
export const STORE_STATS: StoreOrderStats[] = [
  {
    storeId: "1",
    storeName: "Hari har Restaurant",
    totalOrders: 150,
    totalRevenue: 45000,
    avgOrderValue: 300,
    monthlyOrders: [
      { month: "Jan", orders: 40, revenue: 12000 },
      { month: "Feb", orders: 110, revenue: 33000 },
    ],
    yearlyOrders: [
      { year: "2025", orders: 500, revenue: 150000 },
      { year: "2026", orders: 150, revenue: 45000 },
    ],
  },
  {
    storeId: "2",
    storeName: "Shiva Nasta House",
    totalOrders: 200,
    totalRevenue: 30000,
    avgOrderValue: 150,
    monthlyOrders: [
      { month: "Jan", orders: 80, revenue: 12000 },
      { month: "Feb", orders: 120, revenue: 18000 },
    ],
    yearlyOrders: [
       { year: "2025", orders: 1000, revenue: 150000 },
       { year: "2026", orders: 200, revenue: 30000 },
    ],
  },
   {
    storeId: "3",
    storeName: "Venkatesh",
    totalOrders: 120,
    totalRevenue: 40000,
    avgOrderValue: 333,
    monthlyOrders: [
      { month: "Jan", orders: 50, revenue: 15000 },
      { month: "Feb", orders: 70, revenue: 25000 },
    ],
    yearlyOrders: [
       { year: "2025", orders: 400, revenue: 120000 },
       { year: "2026", orders: 120, revenue: 40000 },
    ],
  },
   {
    storeId: "4",
    storeName: "vv demo",
    totalOrders: 10,
    totalRevenue: 3200,
    avgOrderValue: 320,
    monthlyOrders: [
      { month: "Jan", orders: 0, revenue: 0 },
      { month: "Feb", orders: 10, revenue: 3200 },
    ],
    yearlyOrders: [
       { year: "2025", orders: 0, revenue: 0 },
       { year: "2026", orders: 10, revenue: 3200 },
    ],
  },
]
