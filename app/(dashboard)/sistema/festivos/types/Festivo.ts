/**
 * Interfaz que define la estructura de un Día Festivo en el sistema.
 * Utilizada para tipar de forma segura las respuestas de la API y el estado local.
 */
export interface Festivo {
  id: string;
  nombre: string;
  dia: number;
  mes: number;
  anio: number | null;
  creado_el: string;
  actualizado_el: string;
  eliminado_el: string | null;
}

/**
 * Interfaz para definir los parámetros de búsqueda y filtrado de la API
 * en las peticiones de listado de días festivos.
 */
export interface FestivoQueryParams {
  page?: number;
  limit?: number;
  status?: "active" | "deleted" | "all";
  search?: string;
}
