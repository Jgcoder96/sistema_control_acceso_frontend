import { z } from "zod";

/**
 * Esquema de validación para la creación de un nuevo Rol.
 * Asegura que se introduzcan los datos mínimos requeridos de forma segura.
 */
export const createRoleSchema = z.object({
  nombre: z
    .string({ message: "El nombre es obligatorio" })
    .trim()
    .min(3, "El nombre debe tener al menos 3 caracteres"),
  descripcion: z.string().optional(),
});

/**
 * Esquema de validación para la actualización de un Rol existente.
 * Todos los campos son opcionales para permitir actualizaciones parciales (PATCH/PUT).
 */
export const updateRoleSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .optional(),

  descripcion: z.string().optional(),
});

/** Tipo TypeScript inferido automáticamente de los valores validados */
export type RoleFormValues = z.infer<typeof createRoleSchema>;
