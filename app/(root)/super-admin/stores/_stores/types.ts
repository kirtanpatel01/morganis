// Re-export types from schemas for backward compatibility
export type { CreateStoreInput, UpdateStoreInput, StoreFilters, ActionResult, PaginatedResponse } from "./schemas"

// Core Store type (from database)
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

// Pagination types
export interface PaginationState {
  currentPage: number
  totalPages: number
  totalItems: number
  pageSize: number
}

export interface PaginationControls {
  goToPage: (page: number) => void
  nextPage: () => void
  prevPage: () => void
  canGoNext: boolean
  canGoPrev: boolean
}
