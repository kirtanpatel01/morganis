"use server"

import { STORES_DATA } from "./constants"
import type { Store, CreateStoreInput, UpdateStoreInput, StoreFilters } from "./types"

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// In-memory store for demo (would be database in production)
let stores = [...STORES_DATA]

/**
 * Fetch all stores with optional filters
 */
export async function getStores(filters?: StoreFilters): Promise<Store[]> {
  await delay(100)
  
  let result = [...stores]
  
  if (filters?.search) {
    const search = filters.search.toLowerCase()
    result = result.filter(
      (store) =>
        store.name.toLowerCase().includes(search) ||
        store.storeId.toLowerCase().includes(search) ||
        store.gstin.toLowerCase().includes(search) ||
        store.adminEmail.toLowerCase().includes(search)
    )
  }
  
  if (filters?.status && filters.status !== "all") {
    result = result.filter((store) => store.status === filters.status)
  }
  
  return result
}

/**
 * Get a single store by ID
 */
export async function getStoreById(id: string): Promise<Store | null> {
  await delay(100)
  return stores.find((store) => store.id === id) || null
}

/**
 * Create a new store
 */
export async function createStore(data: CreateStoreInput): Promise<{ success: boolean; message: string; store?: Store }> {
  await delay(300)
  
  const newStore: Store = {
    id: String(stores.length + 1),
    storeId: `STR-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
    name: data.name,
    gstin: data.gstin,
    address: data.address,
    stateCode: data.stateCode,
    status: "active",
    createdAt: new Date().toISOString().split("T")[0],
    adminEmail: data.adminEmail,
  }
  
  stores.push(newStore)
  console.log("New store created:", newStore)
  console.log("Admin password (would be hashed):", data.adminPassword)
  
  return { success: true, message: "Store created successfully", store: newStore }
}

/**
 * Update a store
 */
export async function updateStore(data: UpdateStoreInput): Promise<{ success: boolean; message: string; store?: Store }> {
  await delay(200)
  
  const index = stores.findIndex((store) => store.id === data.id)
  if (index === -1) {
    return { success: false, message: "Store not found" }
  }
  
  const updatedStore = {
    ...stores[index],
    ...(data.name && { name: data.name }),
    ...(data.gstin && { gstin: data.gstin }),
    ...(data.address && { address: data.address }),
    ...(data.stateCode && { stateCode: data.stateCode }),
    ...(data.status && { status: data.status }),
  }
  
  stores[index] = updatedStore
  console.log("Store updated:", updatedStore)
  
  return { success: true, message: "Store updated successfully", store: updatedStore }
}

/**
 * Delete a store
 */
export async function deleteStore(id: string): Promise<{ success: boolean; message: string }> {
  await delay(200)
  
  const index = stores.findIndex((store) => store.id === id)
  if (index === -1) {
    return { success: false, message: "Store not found" }
  }
  
  const deletedStore = stores[index]
  stores = stores.filter((store) => store.id !== id)
  console.log("Store deleted:", deletedStore)
  
  return { success: true, message: `Store "${deletedStore.name}" deleted successfully` }
}

/**
 * Toggle store status (activate/deactivate)
 */
export async function toggleStoreStatus(id: string): Promise<{ success: boolean; message: string; store?: Store }> {
  await delay(200)
  
  const index = stores.findIndex((store) => store.id === id)
  if (index === -1) {
    return { success: false, message: "Store not found" }
  }
  
  const currentStatus = stores[index].status
  const newStatus = currentStatus === "active" ? "inactive" : "active"
  
  stores[index] = { ...stores[index], status: newStatus }
  console.log(`Store ${id} status changed to ${newStatus}`)
  
  return { 
    success: true, 
    message: `Store ${newStatus === "active" ? "activated" : "deactivated"} successfully`,
    store: stores[index]
  }
}
