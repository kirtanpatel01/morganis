"use server"

import { FAKE_ORDERS, FAKE_STATS, FAKE_STORES } from "./constants"
import type { DashboardStats, Order, Store } from "./types"

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * Fetch dashboard statistics
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  await delay(100) // Simulate network delay
  return FAKE_STATS
}

/**
 * Fetch all stores
 */
export async function getStores(): Promise<Store[]> {
  await delay(100)
  return FAKE_STORES
}


/**
 * Create a new store
 */
export async function createStore(data: {
  name: string
  gstin: string
  address: string
  stateCode: string
  adminEmail: string
  adminPassword: string
}): Promise<{ success: boolean; message: string; store?: Store }> {
  await delay(300)
  
  const newStore: Store = {
    id: String(FAKE_STORES.length + 1),
    storeId: `STR-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
    name: data.name,
    gstin: data.gstin,
    address: data.address,
    status: "active",
    createdAt: new Date().toISOString().split("T")[0],
    adminEmail: data.adminEmail,
    stateCode: data.stateCode,
  }
  
  // In real implementation, this would:
  // 1. Create the store in database
  // 2. Create admin user with hashed password
  // 3. Send welcome email to admin
  console.log("New store created:", newStore)
  console.log("Admin password (would be hashed):", data.adminPassword)
  return { success: true, message: "Store created successfully", store: newStore }
}
