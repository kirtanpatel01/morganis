import { z } from "zod";

export const storeSettingsSchema = z.object({
  name: z.string().min(2, "Store name must be at least 2 characters"),
  description: z.string().optional(),
  address: z.string().min(5, "Address must be at least 5 characters"),
  phone: z.string().min(5, "Phone number is required"),
  email: z.string().email("Invalid email address"),
  currency: z.string().min(1, "Currency is required"),
  taxRate: z.number().min(0, "Tax rate must be positive"),
});

export type StoreSettingsValues = z.infer<typeof storeSettingsSchema>;

export const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
});

export type ProfileValues = z.infer<typeof profileSchema>;
