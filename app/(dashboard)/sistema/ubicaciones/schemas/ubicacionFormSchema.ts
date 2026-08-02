import { z } from "zod";

const meshIdRegex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;

export const ubicacionFormSchema = z.object({
  nombre: z
    .string({ message: "El campo 'nombre' es obligatorio." })
    .min(3, "El campo 'nombre' debe contener al menos 3 caracteres.")
    .max(100, "El campo 'nombre' no puede exceder los 100 caracteres.")
    .trim(),
  mesh_id: z
    .string({ message: "El campo 'mesh_id' es obligatorio." })
    .regex(
      meshIdRegex,
      "El 'mesh_id' debe ser un formato hexadecimal válido (ej: 77:77:77:77:77:77)."
    )
    .toUpperCase()
    .trim(),
});

export type UbicacionFormValues = z.infer<typeof ubicacionFormSchema>;
