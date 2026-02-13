// Re-export types from schemas for backward compatibility
export type { 
  CreateStoreInput, 
  UpdateStoreInput, 
  StoreFilters, 
  ActionResult, 
  PaginatedResponse 
} from "./schemas"

// Core Store type (from database)
export type StoreStatus = "active" | "inactive" | "pending"

export interface Store {
  id: string
  name: string
  gstin: string
  address: string
  state_code: string
  status: StoreStatus
  admin_id: string
  owner_name?: string
  tax_rate?: number
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
