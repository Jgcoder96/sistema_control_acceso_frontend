/**
 * Representa la estructura de un Rol dentro del sistema.
 */
export interface Role {
  id: string;
  nombre: string;
  descripcion: string | null;
  creado_el: string;
  actualizado_el: string;
  eliminado_el: string | null;
}

/**
 * Interfaz auxiliar que representa un permiso asignable a un rol.
 */
export interface AppPermission {
  id: string;
  slug: string;
  descripcion: string | null;
  creado_el: string;
  actualizado_el: string;
  eliminado_el: string | null;
}

/**
 * Estructura estándar de la respuesta paginada devuelta por la API para los roles.
 */
export interface RolesApiResponse {
  success: boolean;
  message: string;
  data: Role[];
  metadata?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

/**
 * Estructura de la respuesta que detalla los permisos actualmente asignados a un rol específico.
 */
export interface RolePermissionsApiResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    nombre: string;
    descripcion: string | null;
    permisos: AppPermission[];
  };
}

/**
 * Estructura de la respuesta de la API al solicitar la lista de permisos globales disponibles.
 */
export interface AppPermissionsApiResponse {
  success: boolean;
  message: string;
  data: AppPermission[];
  metadata?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
