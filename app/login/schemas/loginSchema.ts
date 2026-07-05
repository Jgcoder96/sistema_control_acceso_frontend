import { z } from "zod";

export const loginSchema = z.object({
  correo_electronico: z
    .string()
    .min(1, "El correo electrónico es obligatorio.")
    .email("Formato de correo electrónico no válido.")
    .trim(),
  clave: z
    .string()
    .min(1, "La contraseña es obligatoria.")
    .min(8, "La contraseña debe tener al menos 8 caracteres.")
    .max(100, "La contraseña no puede exceder los 100 caracteres.")
    .regex(/[A-Z]/, "Debe incluir al menos una letra mayúscula.")
    .regex(/[a-z]/, "Debe incluir al menos una letra minúscula.")
    .regex(/[0-9]/, "Debe incluir al menos un número.")
    .regex(/[^a-zA-Z0-9]/, "Debe incluir al menos un carácter especial.")
    .trim(),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
