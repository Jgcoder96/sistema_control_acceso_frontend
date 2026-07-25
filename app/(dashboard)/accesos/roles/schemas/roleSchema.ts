import { z } from "zod";

export const createRoleSchema = z.object({
  nombre: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  descripcion: z.string().optional(),
});

export const updateRoleSchema = z.object({
  nombre: z.string().min(3, "El nombre debe tener al menos 3 caracteres").optional(),
  descripcion: z.string().optional(),
});

export type RoleFormValues = z.infer<typeof createRoleSchema>;
