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

export type CreateStoreInput = z.infer<typeof createStoreSchema>
