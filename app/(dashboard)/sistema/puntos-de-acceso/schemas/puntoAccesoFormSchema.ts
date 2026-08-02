import { z } from "zod";

const regexMac = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;

const uuidRegex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const puntoAccesoFormSchema = z.object({
  nombre: z
    .string({ message: "El campo 'nombre' es obligatorio." })
    .min(3, "El campo 'nombre' debe contener al menos 3 caracteres.")
    .max(100, "El campo 'nombre' no puede exceder los 100 caracteres.")
    .trim(),
  mac: z
    .string({ message: "El campo 'mac' es obligatorio." })
    .regex(regexMac, "La dirección MAC no es válida (ej: AA:BB:CC:DD:EE:FF).")
    .toUpperCase()
    .trim(),
  ubicacion_id: z
    .string({ message: "Debe seleccionar una ubicación." })
    .regex(uuidRegex, "Seleccione una ubicación válida.")
    .trim(),
});

export type PuntoAccesoFormValues = z.infer<typeof puntoAccesoFormSchema>;
