import { RevenueDataPoint, StorePerformance, CategoryDistribution, StatusBreakdown, AnalyticsSummary } from "./types";

export const REVENUE_TREND_DATA: RevenueDataPoint[] = [
  { date: "2024-01-01", revenue: 12000, orders: 40 },
  { date: "2024-01-02", revenue: 15000, orders: 52 },
  { date: "2024-01-03", revenue: 13000, orders: 45 },
  { date: "2024-01-04", revenue: 18000, orders: 60 },
  { date: "2024-01-05", revenue: 22000, orders: 75 },
  { date: "2024-01-06", revenue: 25000, orders: 85 },
  { date: "2024-01-07", revenue: 21000, orders: 70 },
  { date: "2024-01-08", revenue: 19000, orders: 65 },
  { date: "2024-01-09", revenue: 24000, orders: 80 },
  { date: "2024-01-10", revenue: 28000, orders: 95 },
  { date: "2024-01-11", revenue: 32000, orders: 110 },
  { date: "2024-01-12", revenue: 29000, orders: 100 },
  { date: "2024-01-13", revenue: 35000, orders: 120 },
  { date: "2024-01-14", revenue: 38000, orders: 130 },
];

export const STORE_PERFORMANCE: StorePerformance[] = [
  { storeId: "1", storeName: "Hari har Restaurant", revenue: 150000, orders: 500, growth: 12.5 },
  { storeId: "2", storeName: "Shiva Nasta House", revenue: 120000, orders: 800, growth: 8.2 },
  { storeId: "3", storeName: "Venkatesh", revenue: 200000, orders: 600, growth: 15.0 },
  { storeId: "4", storeName: "vv demo", revenue: 50000, orders: 150, growth: 5.4 },
];

export const CATEGORY_DISTRIBUTION: CategoryDistribution[] = [
  { category: "Main Course", value: 45 },
  { category: "Starters", value: 25 },
  { category: "Beverages", value: 15 },
  { category: "Desserts", value: 10 },
  { category: "Others", value: 5 },
];

export const STATUS_BREAKDOWN: StatusBreakdown[] = [
  { status: "Completed", count: 1850, color: "#10b981" },
  { status: "Processing", count: 120, color: "#3b82f6" },
  { status: "Pending", count: 45, color: "#f59e0b" },
  { status: "Cancelled", count: 85, color: "#ef4444" },
];

export const ANALYTICS_SUMMARY: AnalyticsSummary = {
  totalRevenue: 520000,
  revenueGrowth: 15.2,
  totalOrders: 2055,
  ordersGrowth: 10.5,
  avgOrderValue: 253,
  aovGrowth: 4.3,
  activeStores: 4,
  storesGrowth: 0,
};
