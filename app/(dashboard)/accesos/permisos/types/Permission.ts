export interface Permission {
  id: string;
  slug: string;
  descripcion: string | null;
  creado_el: string;
  actualizado_el: string;
  eliminado_el: string | null;
}

export interface PermissionsApiResponse {
  success: boolean;
  message: string;
  data: Permission[];
  metadata?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
