/**
 * Define la estructura de un Punto de Acceso en el sistema.
 * Contiene información del dispositivo (MAC) y la ubicación a la que pertenece.
 */
export interface PuntoAcceso {
  id: string;
  nombre: string;
  mac: string;
  creado_el?: string | null;
  actualizado_el?: string | null;
  eliminado_el?: string | null;
  ubicacion: {
    id: string;
    nombre: string;
  };
}

/**
 * Parámetros de consulta utilizados para filtrar y paginar la tabla de Puntos de Acceso.
 */
export interface PuntoAccesoQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: "active" | "deleted" | "all";
  locationId?: string;
}
