export type TimeRange = "24h" | "7d" | "30d" | "90d" | "1y" | "all";

export interface RevenueDataPoint {
  date: string;
  revenue: number;
  orders: number;
}

export interface StorePerformance {
  storeId: string;
  storeName: string;
  revenue: number;
  orders: number;
  growth: number;
}

export interface CategoryDistribution {
  category: string;
  value: number;
}

export interface StatusBreakdown {
  status: string;
  count: number;
  color: string;
}

export interface AnalyticsSummary {
  totalRevenue: number;
  revenueGrowth: number;
  totalOrders: number;
  ordersGrowth: number;
  avgOrderValue: number;
  aovGrowth: number;
  activeStores: number;
  storesGrowth: number;
}
