/**
 * Representa la estructura de un registro de auditoría / acceso (Log)
 */
export interface Log {
  id: string;
  codigo_tarjeta_raw?: string;
  evento: string;
  fecha: string; // ISO String
  ubicacion?: string | { id?: string; nombre?: string; mesh_id?: string; [key: string]: unknown };
  punto_acceso?: string | { id?: string; nombre?: string; mac?: string; [key: string]: unknown };
  cedula?: string;
  tarjeta?: string | {
    id?: string;
    codigo?: string;
    usuario?: {
      id?: string;
      nombre?: string;
      apellido?: string;
      cedula?: string;
      foto?: string;
      correo?: string;
    }
  };
  estado?: string;
  autorizado?: boolean;
  // Campos adicionales que el backend pueda retornar
  detalles?: string;
}

/**
 * Parámetros admitidos para consultar el paginado y filtrado de Logs
 */
export interface LogQueryParams {
  page?: number;
  limit?: number;
  ubicacion?: string;
  punto_acceso?: string;
  cedula?: string;
  tarjeta?: string;
}
