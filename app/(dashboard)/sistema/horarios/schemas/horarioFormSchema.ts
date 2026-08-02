import { z } from "zod";

const hourRegex = /^([01]\d|2[0-3]):([0-5]\d)(:([0-5]\d))?$/;

/**
 * Esquema de validación para el formulario de Horarios utilizando Zod.
 * Verifica que el nombre tenga la longitud correcta y que al menos se configure
 * un día con horas de inicio y fin válidas en formato de 24h (HH:mm).
 */
export const horarioFormSchema = z.object({
  nombre: z
    .string({ message: "El campo 'nombre' es obligatorio." })
    .min(4, "El campo 'nombre' debe contener al menos 4 caracteres.")
    .max(100, "El campo 'nombre' no puede exceder los 100 caracteres.")
    .trim(),
  detalles: z
    .array(
      z.object({
        dia_semana: z
          .enum(["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo", "festivo"])
          .optional()
          .nullable(),
        hora_inicio: z
          .string({ message: "Obligatorio" })
          .regex(hourRegex, "Inválido (HH:mm)"),
        hora_fin: z
          .string({ message: "Obligatorio" })
          .regex(hourRegex, "Inválido (HH:mm)"),
        es_festivo: z.boolean(),
      })
    )
    .min(1, "Debe agregar al menos un día al horario."),
});

export type HorarioFormValues = z.infer<typeof horarioFormSchema>;
