/**
 * Define la estructura de una Ubicación en el sistema.
 * Contiene información de nodos físicos y parámetros de conectividad (Mesh ID).
 */
export interface Ubicacion {
  id: string;
  nombre: string;
  mesh_id: string;
  creado_el?: string | null;
  actualizado_el?: string | null;
  eliminado_el?: string | null;
}

/**
 * Parámetros de consulta utilizados para filtrar y paginar la tabla de Ubicaciones.
 */
export interface UbicacionQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: "active" | "deleted" | "all";
}
