import { z } from "zod"

/**
 * Schema for creating a new store
 */
export const createStoreSchema = z.object({
  name: z
    .string()
    .min(1, "Store name is required")
    .min(2, "Store name must be at least 2 characters")
    .max(100, "Store name must be less than 100 characters"),
  
  gstin: z
    .string()
    .min(1, "GSTIN is required")
    .length(15, "GSTIN must be exactly 15 characters")
    .regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, "Invalid GSTIN format"),
  
  address: z
    .string()
    .min(1, "Store address is required")
    .min(10, "Address must be at least 10 characters")
    .max(500, "Address must be less than 500 characters"),
  
  stateCode: z
    .string()
    .min(1, "State code is required")
    .length(2, "State code must be exactly 2 characters")
    .regex(/^[A-Z]{2}$/, "State code must be 2 uppercase letters"),
  
  adminEmail: z
    .string()
    .min(1, "Admin email is required")
    .email("Invalid email address")
    .toLowerCase(),
  
  adminPassword: z
    .string()
    .min(1, "Admin password is required")
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password must be less than 100 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
})

/**
 * Schema for updating an existing store
 */
export const updateStoreSchema = z.object({
  id: z.string().min(1, "Store ID is required"),
  
  name: z
    .string()
    .min(2, "Store name must be at least 2 characters")
    .max(100, "Store name must be less than 100 characters")
    .optional(),
  
  gstin: z
    .string()
    .length(15, "GSTIN must be exactly 15 characters")
    .regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, "Invalid GSTIN format")
    .optional(),
  
  address: z
    .string()
    .min(10, "Address must be at least 10 characters")
    .max(500, "Address must be less than 500 characters")
    .optional(),
  
  stateCode: z
    .string()
    .length(2, "State code must be exactly 2 characters")
    .regex(/^[A-Z]{2}$/, "State code must be 2 uppercase letters")
    .optional(),
  
  status: z.enum(["active", "inactive", "pending"]).optional(),
})

/**
 * Schema for store filters
 */
export const storeFiltersSchema = z.object({
  search: z.string().optional(),
  status: z.enum(["all", "active", "inactive", "pending"]).optional(),
})

/**
 * Inferred TypeScript types from schemas
 */
export type CreateStoreInput = z.infer<typeof createStoreSchema>
export type UpdateStoreInput = z.infer<typeof updateStoreSchema>
export type StoreFilters = z.infer<typeof storeFiltersSchema>

/**
 * Type for action results
 */
export interface ActionResult<T = unknown> {
  success: boolean
  message: string
  data?: T
}

/**
 * Type for paginated response
 */
export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    pageSize: number
    totalItems: number
    totalPages: number
  }
}
