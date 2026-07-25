import { z } from "zod";

/**
 * Esquema de validación para la creación y edición de permisos.
 * Asegura la integridad de los datos introducidos en el formulario.
 */
export const createPermissionSchema = z.object({
  slug: z
    .string({ message: "El slug es obligatorio" })
    .trim()
    .min(4, "El slug debe contener al menos 4 caracteres")
    .max(100, "El slug no puede exceder los 100 caracteres")
    .regex(
      /^[a-z0-9._-]+$/,
      "El slug solo admite letras minúsculas, números y los caracteres: . _ -",
    ),

  descripcion: z
    .string({ message: "La descripción es obligatoria" })
    .trim()
    .min(4, "La descripción debe contener al menos 4 caracteres")
    .max(100, "La descripción no puede exceder los 100 caracteres"),
});

/** Tipo TypeScript inferido automáticamente a partir del esquema de validación */
export type PermissionFormValues = z.infer<typeof createPermissionSchema>;
