import { z } from "zod";

export const storeSettingsSchema = z.object({
  name: z.string().min(2, "Store name must be at least 2 characters"),
  gstin: z.string().length(15, "GSTIN must be exactly 15 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  stateCode: z.string().regex(/^[0-9]{2}$/, "State code must be 2 digits"),
  taxRate: z.coerce.number().min(0, "Tax rate cannot be negative").max(100, "Tax rate cannot exceed 100").default(0),
  // email, phone, description, currency, taxRate removed as they are not in schema
});

export type StoreSettingsValues = z.infer<typeof storeSettingsSchema>;

export const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
});

export type ProfileValues = z.infer<typeof profileSchema>;
