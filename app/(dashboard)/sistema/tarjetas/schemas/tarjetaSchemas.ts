import { z } from "zod";

/**
 * Esquema de validación para la creación de una nueva Tarjeta RFID.
 * Exige un formato específico (8-20 caracteres alfanuméricos) para asegurar integridad física.
 */
export const tarjetaCreateSchema = z.object({
  codigo: z
    .string({ message: "El campo 'código' es obligatorio." })
    .min(5, "El código debe contener al menos 5 caracteres.")
    .max(20, "El código no puede exceder los 20 caracteres.")
    .regex(/^[a-zA-Z0-9]+$/, "El código solo puede contener letras y números sin espacios.")
    .trim(),
});

export type TarjetaCreateValues = z.infer<typeof tarjetaCreateSchema>;

/**
 * Esquema de validación para la asignación de una tarjeta a un usuario.
 */
export const tarjetaAssignSchema = z.object({
  usuario_id: z
    .string({ message: "El campo 'usuario' es obligatorio." })
    .uuid("Debe seleccionar un usuario válido."),
});

export type TarjetaAssignValues = z.infer<typeof tarjetaAssignSchema>;
