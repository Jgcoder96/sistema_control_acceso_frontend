/**
 * Representa la estructura principal de un Permiso dentro del sistema.
 */
export interface Permission {
  id: string;
  slug: string;
  descripcion: string | null;
  creado_el: string;
  actualizado_el: string;
  eliminado_el: string | null;
}

/**
 * Estructura estándar de la respuesta paginada devuelta por la API para permisos.
 */
export interface PermissionsApiResponse {
  success: boolean;
  message: string;
  data: Permission[];
  metadata?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
