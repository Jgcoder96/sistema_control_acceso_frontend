import { z } from "zod";

export const festivoFormSchema = z.object({
  nombre: z
    .string({ message: "El campo 'nombre' es obligatorio." })
    .min(4, "El campo 'nombre' debe contener al menos 4 caracteres.")
    .max(100, "El campo 'nombre' no puede exceder los 100 caracteres.")
    .trim(),
  dia: z
    .number({ message: "El día debe ser un número." })
    .min(1, "El día debe ser mayor o igual a 1.")
    .max(31, "El día no puede ser mayor a 31."),
  mes: z
    .number({ message: "El mes debe ser un número." })
    .min(1, "El mes debe ser mayor o igual a 1.")
    .max(12, "El mes no puede ser mayor a 12."),
  anio: z
    .number()
    .min(2026, "El año debe ser mayor o igual a 2026.")
    .max(2100, "El año no puede ser mayor a 2100.")
    .nullable()
    .optional(),
});

export type FestivoFormValues = z.infer<typeof festivoFormSchema>;
