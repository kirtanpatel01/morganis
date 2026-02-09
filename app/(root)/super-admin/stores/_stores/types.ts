// Types for Super Admin Stores Page

export type StoreStatus = "active" | "inactive" | "pending"

export interface Store {
  id: string
  storeId: string
  name: string
  gstin: string
  address: string
  stateCode: string
  status: StoreStatus
  createdAt: string
  adminEmail: string
}

export interface CreateStoreInput {
  name: string
  gstin: string
  address: string
  stateCode: string
  adminEmail: string
  adminPassword: string
}

export interface UpdateStoreInput {
  id: string
  name?: string
  gstin?: string
  address?: string
  stateCode?: string
  status?: StoreStatus
}

export interface StoreFilters {
  search?: string
  status?: StoreStatus | "all"
}
