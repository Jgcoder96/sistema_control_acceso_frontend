/**
 * Posibles estados de filtrado para los usuarios.
 */
export type UserStatusFilter = "active" | "deleted" | "all";

/**
 * Parámetros admitidos para consultar y paginar usuarios desde la API.
 */
export interface UserQueryParams {
  status: UserStatusFilter;
  search?: string;
  page: number;
  limit: number;
}

/**
 * Representa la estructura de datos completa de un Usuario en el sistema.
 */
export interface Usuario {
  id: string;
  nombre: string;
  apellido: string;
  cedula: string;
  correo_electronico: string;
  foto_url: string;
  estado: string;
  creado_el: string;
  actualizado_el: string;
  eliminado_el: string | null;
}

/**
 * Estructura estándar de la respuesta paginada devuelta por la API al solicitar usuarios.
 */
export interface UsuariosApiResponse {
  success: boolean;
  message: string;
  data: Usuario[];
  metadata: {
    totalItems: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

/**
 * Estructura simplificada de un rol cuando está vinculado a un usuario específico.
 */
export interface RolUsuario {
  id: string;
  nombre: string;
  descripcion: string;
  creado_el: string;
  actualizado_el: string;
}

/**
 * Estructura de respuesta de la API al solicitar la lista de roles (asignados o disponibles).
 */
export interface RolesApiResponse {
  success: boolean;
  message: string;
  data: RolUsuario[];
}
