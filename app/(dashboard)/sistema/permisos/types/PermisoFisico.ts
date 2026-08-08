/**
 * Tipos de estado permitidos para el filtro de permisos físicos.
 */
export type PermisoFiltroEstado = "active" | "deleted" | "all";

/**
 * Interfaz principal que define la estructura de un Permiso Físico
 * mapeado desde la respuesta del servidor hacia el frontend.
 */
export interface PermisoFisico {
  id: string;
  usuario: string;
  cedula: string;
  punto_acceso: string;
  ubicacion?: string;
  horario?: string;
  creado_el: string;
  eliminado_el: string | null;
}

export interface PermisoFisicoQueryParams {
  page?: number;
  limit?: number;
  status?: PermisoFiltroEstado;
  cedula?: string;
  puntoAcceso?: string;
  ubicacion?: string;
}
