import { z } from "zod";

export const createPermissionSchema = z.object({
  slug: z
    .string({ required_error: "El slug es obligatorio" })
    .trim()
    .min(4, "El slug debe contener al menos 4 caracteres")
    .max(100, "El slug no puede exceder los 100 caracteres")
    .regex(
      /^[a-z0-9._-]+$/,
      "El slug solo puede contener letras minúsculas, números, puntos, guiones y guiones bajos (sin espacios)"
    ),
  descripcion: z
    .string({ required_error: "La descripción es obligatoria" })
    .trim()
    .min(4, "La descripción debe contener al menos 4 caracteres")
    .max(100, "La descripción no puede exceder los 100 caracteres"),
});

export type PermissionFormValues = z.infer<typeof createPermissionSchema>;
