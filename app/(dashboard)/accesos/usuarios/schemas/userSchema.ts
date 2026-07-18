import { z } from "zod";

const baseSchemaFields = {
  nombre: z
    .string()
    .min(4, "El nombre debe contener al menos 4 caracteres.")
    .max(100, "El nombre no puede exceder los 100 caracteres.")
    .trim(),
  apellido: z
    .string()
    .min(4, "El apellido debe contener al menos 4 caracteres.")
    .max(100, "El apellido no puede exceder los 100 caracteres.")
    .trim(),
  cedula: z
    .string()
    .min(7, "La cédula debe contener al menos 7 dígitos.")
    .max(8, "La cédula no puede exceder los 8 dígitos.")
    .regex(/^[0-9]+$/, "La cédula debe contener solo números.")
    .trim(),
  correo_electronico: z
    .string()
    .max(100, "El correo electrónico no puede exceder los 100 caracteres.")
    .email("Formato de correo electrónico no válido.")
    .trim(),
};

const passwordRules = z
  .string()
  .min(8, "La contraseña debe tener al menos 8 caracteres.")
  .max(100, "La contraseña no puede exceder los 100 caracteres.")
  .regex(/[A-Z]/, "La contraseña debe incluir al menos una letra mayúscula.")
  .regex(/[a-z]/, "La contraseña debe incluir al menos una letra minúscula.")
  .regex(/[0-9]/, "La contraseña debe incluir al menos un número.")
  .regex(/[^a-zA-Z0-9]/, "La contraseña debe incluir al menos un carácter especial.")
  .trim();

export const createUserSchema = z.object({
  ...baseSchemaFields,
  clave: passwordRules,
  foto: z
    .custom<File>((val) => val instanceof File, "La foto de perfil es obligatoria.")
    .superRefine((file, ctx) => {
      if (!file) return;
      if (file.size > 5 * 1024 * 1024) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "La foto no debe pesar más de 5MB.",
        });
      }
      const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
      if (!allowedTypes.includes(file.type)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Solo se permiten formatos JPEG, PNG y WebP.",
        });
      }
    }),
});

export const updateUserSchema = z.object({
  ...baseSchemaFields,
  clave: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .superRefine((val, ctx) => {
      if (!val) return; // No validar si es campo vacío
      if (val.length < 8) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "La contraseña debe tener al menos 8 caracteres.",
        });
      }
      if (val.length > 100) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "La contraseña no puede exceder los 100 caracteres.",
        });
      }
      if (!/[A-Z]/.test(val)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "La contraseña debe incluir al menos una letra mayúscula.",
        });
      }
      if (!/[a-z]/.test(val)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "La contraseña debe incluir al menos una letra minúscula.",
        });
      }
      if (!/[0-9]/.test(val)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "La contraseña debe incluir al menos un número.",
        });
      }
      if (!/[^a-zA-Z0-9]/.test(val)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "La contraseña debe incluir al menos un carácter especial.",
        });
      }
    }),
  foto: z
    .custom<File | null>((val) => val === null || val instanceof File)
    .optional()
    .superRefine((file, ctx) => {
      if (!file) return;
      if (file.size > 5 * 1024 * 1024) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "La foto no debe pesar más de 5MB.",
        });
      }
      const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
      if (!allowedTypes.includes(file.type)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Solo se permiten formatos JPEG, PNG y WebP.",
        });
      }
    }),
});

export type CreateUserFormValues = z.infer<typeof createUserSchema>;
export type UpdateUserFormValues = z.infer<typeof updateUserSchema>;

export interface UserFormValues {
  nombre: string;
  apellido: string;
  cedula: string;
  correo_electronico: string;
  clave?: string;
  foto?: File | null;
}
