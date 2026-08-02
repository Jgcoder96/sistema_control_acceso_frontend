export type DayOfTheWeek =
  | "lunes"
  | "martes"
  | "miercoles"
  | "jueves"
  | "viernes"
  | "sabado"
  | "domingo";

/**
 * Representa el detalle de configuración de un día específico dentro de un Horario.
 * Un detalle puede estar asociado a un día de la semana (ej. 'lunes') o aplicar
 * a días festivos (`es_festivo = true`).
 */
export interface HorarioDetalle {
  id: string;
  dia_semana?: DayOfTheWeek | null;
  hora_inicio: string;
  hora_fin: string;
  es_festivo: boolean;
}

/**
 * Representa la entidad principal de Horario, que agrupa una serie de reglas de acceso
 * (detalles por día) y gestiona su estado general en el sistema (activo o eliminado).
 */
export interface Horario {
  id: string;
  nombre: string;
  creado_el?: string | null;
  actualizado_el?: string | null;
  eliminado_el?: string | null;
  horario_detalles: HorarioDetalle[];
}

export interface HorarioQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: "active" | "deleted" | "all";
}
