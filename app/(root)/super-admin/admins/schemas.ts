import { z } from "zod";

export const updateAdminSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().optional().or(z.literal("")),
});

export type UpdateAdminFormValues = z.infer<typeof updateAdminSchema>;
