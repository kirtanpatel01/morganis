import { z } from "zod"

// Order status schema
export const orderStatusSchema = z.enum([
  "pending",
  "approved",
  "rejected",
  "processing",
  "completed",
  "cancelled",
])

// Store status schema
export const storeStatusSchema = z.enum(["active", "inactive", "pending"])

// Dashboard stats schema
export const dashboardStatsSchema = z.object({
  totalStores: z.number(),
  totalOrders: z.number(),
  totalRevenue: z.number(),
  activeStores: z.number(),
})

// Store schema
export const storeSchema = z.object({
  id: z.string(),
  storeId: z.string(),
  name: z.string().min(1, "Store name is required"),
  gstin: z.string().min(15, "GSTIN must be 15 characters").max(15),
  address: z.string().min(1, "Address is required"),
  status: storeStatusSchema,
  createdAt: z.string(),
  adminEmail: z.string().email().optional(),
  adminName: z.string().optional(),
})

// Order item schema
export const orderItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  quantity: z.number().min(1),
  price: z.number().min(0),
})

// Order schema
export const orderSchema = z.object({
  id: z.string(),
  orderId: z.string(),
  storeId: z.string(),
  storeName: z.string(),
  customerName: z.string(),
  customerEmail: z.string().email(),
  items: z.array(orderItemSchema),
  totalAmount: z.number().min(0),
  status: orderStatusSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
})

// Create store schema (for form validation)
export const createStoreSchema = z.object({
  name: z.string().min(1, "Store name is required"),
  gstin: z.string().length(15, "GSTIN must be exactly 15 characters"),
  address: z.string().min(1, "Address is required"),
  adminEmail: z.string().email("Invalid email address"),
  adminName: z.string().min(1, "Admin name is required"),
})

export type CreateStoreInput = z.infer<typeof createStoreSchema>
