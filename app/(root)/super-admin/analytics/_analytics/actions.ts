"use server"

import { ANALYTICS_SUMMARY, REVENUE_TREND_DATA, STORE_PERFORMANCE, CATEGORY_DISTRIBUTION, STATUS_BREAKDOWN } from "./constants";
import { AnalyticsSummary, RevenueDataPoint, StorePerformance, CategoryDistribution, StatusBreakdown, TimeRange } from "./types";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function getAnalyticsSummary(_: TimeRange): Promise<AnalyticsSummary> {
  await delay(300);
  return ANALYTICS_SUMMARY;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function getRevenueTrends(_: TimeRange): Promise<RevenueDataPoint[]> {
  await delay(500);
  return REVENUE_TREND_DATA;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function getStorePerformance(_: TimeRange): Promise<StorePerformance[]> {
  await delay(400);
  return STORE_PERFORMANCE;
}

export async function getCategoryDistribution(): Promise<CategoryDistribution[]> {
  await delay(300);
  return CATEGORY_DISTRIBUTION;
}

export async function getStatusBreakdown(): Promise<StatusBreakdown[]> {
  await delay(300);
  return STATUS_BREAKDOWN;
}
