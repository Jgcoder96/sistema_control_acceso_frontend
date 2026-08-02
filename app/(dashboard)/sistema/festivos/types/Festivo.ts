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

export interface FestivoQueryParams {
  page?: number;
  limit?: number;
  status?: "active" | "deleted" | "all";
  search?: string;
}
