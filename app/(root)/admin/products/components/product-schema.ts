import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  price: z.number().positive("Price must be positive"),
  stock: z.number().int().nonnegative("Stock must be non-negative"),
  category: z.string().min(1, "Category is required"),
  status: z.enum(["active", "draft", "archived"]),
  imageUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
});

export type ProductFormValues = z.infer<typeof productSchema>;
