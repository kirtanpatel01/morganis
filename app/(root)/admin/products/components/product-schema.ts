import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  price: z.number().min(0, "Price must be non-negative"),
  stock: z.number().int().min(0, "Stock must be non-negative"),
  unit: z.string().min(1, "Unit is required"),
  unit_quantity: z.preprocess(
    (val) => (typeof val === 'number' && isNaN(val) ? 1 : val),
    z.number().int().min(1, "Quantity must be at least 1").default(1)
  ),
  category_id: z.string().min(1, "Category is required"),
  status: z.enum(["active", "draft", "archived"]),
});

export type ProductFormValues = z.infer<typeof productSchema>;
