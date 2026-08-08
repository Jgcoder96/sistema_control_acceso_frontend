import { z } from "zod";

/**
 * Esquema de validación estricta (Zod) para la creación de un nuevo permiso físico.
 * Garantiza que los IDs requeridos no estén vacíos antes de enviar la petición.
 */
export const permisoCreateSchema = z.object({
  usuario_id: z.string().min(1, "Debe seleccionar un usuario."),
  punto_acceso_id: z.string().min(1, "Debe seleccionar un punto de acceso."),
  horario_id: z.string().min(1, "Debe seleccionar un horario."),
});

/**
 * Tipo inferido de Zod para las variables de creación de permiso.
 * Proporciona tipado seguro (type-safe) en el formulario y la API.
 */
export type PermisoCreateValues = z.infer<typeof permisoCreateSchema>;
