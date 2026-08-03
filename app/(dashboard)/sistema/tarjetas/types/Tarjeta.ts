export type TarjetaEstado = "activable" | "activa" | "bloqueada" | "perdida" | "eliminada";
export type TarjetaFiltroEstado = TarjetaEstado | "all";

export interface TarjetaUsuario {
  id: string;
  nombre: string;
  apellido: string;
  cedula: string;
}

export type TipoAccionHistorial =
  | "asignacion"
  | "devolucion"
  | "bloqueo"
  | "perdida"
  | "eliminacion"
  | "reactivacion";

export interface TarjetaHistorial {
  id: string;
  accion: TipoAccionHistorial;
  fecha: string;
  usuario: TarjetaUsuario;
}

export interface Tarjeta {
  id: string;
  codigo: string;
  estado: TarjetaEstado;
  creado_el: string;
  actualizado_el: string;
  eliminado_el: string | null;
  asignada_el: string | null;
  usuario: TarjetaUsuario | null;
  historial_asignaciones?: TarjetaHistorial[];
}

export interface TarjetaQueryParams {
  status?: TarjetaFiltroEstado;
  codigo?: string;
  cedula?: string;
  page?: number;
  limit?: number;
}
