import { z } from "zod";

/**
 * Campos base requeridos tanto para crear como para editar un usuario.
 * Contienen reglas estrictas de longitud y formato.
 */
const baseSchemaFields = {
  nombre: z
    .string({ message: "El nombre es obligatorio." })
    .min(4, "El nombre debe contener al menos 4 caracteres.")
    .max(100, "El nombre no puede exceder los 100 caracteres.")
    .trim(),
  apellido: z
    .string({ message: "El apellido es obligatorio." })
    .min(4, "El apellido debe contener al menos 4 caracteres.")
    .max(100, "El apellido no puede exceder los 100 caracteres.")
    .trim(),
  cedula: z
    .string({ message: "La cédula es obligatoria." })
    .min(7, "La cédula debe contener al menos 7 dígitos.")
    .max(8, "La cédula no puede exceder los 8 dígitos.")
    .regex(/^[0-9]+$/, "La cédula debe contener solo números.")
    .trim(),
  correo_electronico: z
    .string({ message: "El correo es obligatorio." })
    .max(100, "El correo electrónico no puede exceder los 100 caracteres.")
    .email("Formato de correo electrónico no válido.")
    .trim(),
};

/**
 * Reglas de seguridad obligatorias para la creación de contraseñas.
 * Exige alfanuméricos, mayúsculas, minúsculas y caracteres especiales.
 */
const passwordRules = z
  .string({ message: "La contraseña es obligatoria." })
  .min(8, "La contraseña debe tener al menos 8 caracteres.")
  .max(100, "La contraseña no puede exceder los 100 caracteres.")
  .regex(/[A-Z]/, "La contraseña debe incluir al menos una letra mayúscula.")
  .regex(/[a-z]/, "La contraseña debe incluir al menos una letra minúscula.")
  .regex(/[0-9]/, "La contraseña debe incluir al menos un número.")
  .regex(
    /[^a-zA-Z0-9]/,
    "La contraseña debe incluir al menos un carácter especial.",
  )
  .trim();

/**
 * Esquema de validación estricta para registrar un nuevo Usuario.
 * Exige todos los campos obligatorios, validación de contraseña segura y foto de perfil.
 */
export const createUserSchema = z.object({
  ...baseSchemaFields,
  clave: passwordRules,
  foto: z
    .custom<File>(
      (val) => val instanceof File,
      "La foto de perfil es obligatoria.",
    )
    .superRefine((file, ctx) => {
      if (!file) return;
      if (file.size > 5 * 1024 * 1024) {
        ctx.addIssue({
          code: "custom",
          message: "La foto no debe pesar más de 5MB.",
        });
      }
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/jpg",
      ];
      if (!allowedTypes.includes(file.type)) {
        ctx.addIssue({
          code: "custom",
          message: "Solo se permiten formatos JPEG, PNG y WebP.",
        });
      }
    }),
});

/**
 * Esquema de validación flexible para modificar un Usuario existente.
 * Permite omitir la contraseña y la foto si no se desean actualizar.
 */
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
          code: "custom",
          message: "La contraseña debe tener al menos 8 caracteres.",
        });
      }
      if (val.length > 100) {
        ctx.addIssue({
          code: "custom",
          message: "La contraseña no puede exceder los 100 caracteres.",
        });
      }
      if (!/[A-Z]/.test(val)) {
        ctx.addIssue({
          code: "custom",
          message: "La contraseña debe incluir al menos una letra mayúscula.",
        });
      }
      if (!/[a-z]/.test(val)) {
        ctx.addIssue({
          code: "custom",
          message: "La contraseña debe incluir al menos una letra minúscula.",
        });
      }
      if (!/[0-9]/.test(val)) {
        ctx.addIssue({
          code: "custom",
          message: "La contraseña debe incluir al menos un número.",
        });
      }
      if (!/[^a-zA-Z0-9]/.test(val)) {
        ctx.addIssue({
          code: "custom",
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
          code: "custom",
          message: "La foto no debe pesar más de 5MB.",
        });
      }
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/jpg",
      ];
      if (!allowedTypes.includes(file.type)) {
        ctx.addIssue({
          code: "custom",
          message: "Solo se permiten formatos JPEG, PNG y WebP.",
        });
      }
    }),
});

/**
 * Tipos estáticos inferidos automáticamente a partir de los esquemas Zod
 */
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
