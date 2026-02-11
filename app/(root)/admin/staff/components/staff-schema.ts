import { z } from "zod";

export const staffSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(5, "Phone number is required"),
  role: z.enum(["manager", "cashier", "kitchen", "driver"], {
    message: "Role is required",
  }),
  status: z.enum(["active", "inactive", "leave"], {
    message: "Status is required",
  }),
});

export type StaffFormValues = z.infer<typeof staffSchema>;
