import * as z from "zod";

export const createUserSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  position: z.string().min(1, "Position is required"),
  startDate: z.string().optional(),
  isActive: z.boolean(),
});

export type CreateUserFormData = z.infer<typeof createUserSchema>;

export const updateUserSchema = createUserSchema.partial().extend({
  id: z.number(),
});

export type UpdateUserFormData = z.infer<typeof updateUserSchema>;
