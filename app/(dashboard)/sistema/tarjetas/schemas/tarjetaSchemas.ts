import { z } from "zod";

export const tarjetaCreateSchema = z.object({
  codigo: z
    .string({ message: "El campo 'código' es obligatorio." })
    .min(5, "El código debe contener al menos 5 caracteres.")
    .max(20, "El código no puede exceder los 20 caracteres.")
    .regex(/^[a-zA-Z0-9]+$/, "El código solo puede contener letras y números sin espacios.")
    .trim(),
});

export type TarjetaCreateValues = z.infer<typeof tarjetaCreateSchema>;

export const tarjetaAssignSchema = z.object({
  usuario_id: z
    .string({ message: "El campo 'usuario' es obligatorio." })
    .uuid("Debe seleccionar un usuario válido."),
});

export type TarjetaAssignValues = z.infer<typeof tarjetaAssignSchema>;
