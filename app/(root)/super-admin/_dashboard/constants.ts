import { DashboardStats, Order, Store } from "./types"

// Fake dashboard statistics
export const FAKE_STATS: DashboardStats = {
  totalStores: 4,
  totalOrders: 7,
  totalRevenue: 0.0,
  activeStores: 4,
}

// Fake stores data matching the design
export const FAKE_STORES: Store[] = [
  {
    id: "1",
    storeId: "STR-1770459124420-1825",
    name: "Hari har Restaurant",
    gstin: "22AAAAA0000A1Z5",
    address: "123 Main Street, Ahmedabad",
    status: "active",
    createdAt: "2026-02-07",
    adminEmail: "harihar@restaurant.com",
    stateCode: "GJ",
  },
  {
    id: "2",
    storeId: "STR-1770619786227-4231",
    name: "Shiva Nasta House",
    gstin: "rfe34r9hfbr3erf",
    address: "Address",
    status: "active",
    createdAt: "2026-02-09",
    adminEmail: "shiva@nastahouse.com",
    stateCode: "MH",
  },
  {
    id: "3",
    storeId: "STR-1770620995004-3044",
    name: "Venkatesh",
    gstin: "23456789084Jb31",
    address: "Gate No 3, House No A48, Keshar Bhavani Society",
    status: "active",
    createdAt: "2026-02-09",
    adminEmail: "venkatesh@store.com",
    stateCode: "KA",
  },
  {
    id: "4",
    storeId: "STR-1770639535007-9927",
    name: "vv demo",
    gstin: "22AAAAA0000A1Z5",
    address: "wsdfghjop;b",
    status: "active",
    createdAt: "2026-02-09",
    adminEmail: "vv@demo.com",
    stateCode: "DL",
  },
]

// Fake pending orders data
export const FAKE_ORDERS: Order[] = [
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
    createdAt: "2026-02-09T10:30:00",
    updatedAt: "2026-02-09T10:30:00",
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
    status: "pending",
    createdAt: "2026-02-09T11:15:00",
    updatedAt: "2026-02-09T11:15:00",
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
    status: "pending",
    createdAt: "2026-02-09T12:00:00",
    updatedAt: "2026-02-09T12:00:00",
  },
]

// Stats card configuration
export const STATS_CARDS_CONFIG = [
  {
    key: "totalStores",
    title: "Total Stores",
    icon: "Building2",
    color: "text-blue-500",
    bgColor: "bg-blue-50",
  },
  {
    key: "totalOrders",
    title: "Total Orders",
    icon: "TrendingUp",
    color: "text-green-500",
    bgColor: "bg-green-50",
  },
  {
    key: "totalRevenue",
    title: "Total Revenue",
    icon: "DollarSign",
    color: "text-purple-500",
    bgColor: "bg-purple-50",
    prefix: "₹",
    formatAsCurrency: true,
  },
  {
    key: "activeStores",
    title: "Active Stores",
    icon: "Users",
    color: "text-pink-500",
    bgColor: "bg-pink-50",
  },
] as const
