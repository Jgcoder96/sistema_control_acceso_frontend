export interface Role {
  id: string;
  nombre: string;
  descripcion: string | null;
  creado_el: string;
  actualizado_el: string;
  eliminado_el: string | null;
}

export interface AppPermission {
  id: string;
  slug: string;
  descripcion: string | null;
  creado_el: string;
  actualizado_el: string;
  eliminado_el: string | null;
}

export interface RolesApiResponse {
  success: boolean;
  message: string;
  data: Role[];
  metadata?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface RolePermissionsApiResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    nombre: string;
    descripcion: string | null;
    permisos: AppPermission[];
  };
}

export interface AppPermissionsApiResponse {
  success: boolean;
  message: string;
  data: AppPermission[];
  metadata?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
