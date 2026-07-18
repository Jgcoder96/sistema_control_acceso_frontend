export type UserStatusFilter = "active" | "deleted" | "all";

export interface UserQueryParams {
  status: UserStatusFilter;
  search?: string;
  page: number;
  limit: number;
}

export interface Usuario {
  id: string;
  nombre: string;
  apellido: string;
  cedula: string;
  correo_electronico: string;
  foto_url: string;
  estado: string;
  creado_el: string;
  actualizado_el: string;
  eliminado_el: string | null;
}

export interface UsuariosApiResponse {
  success: boolean;
  message: string;
  data: Usuario[];
  metadata: {
    totalItems: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface RolUsuario {
  id: string;
  nombre: string;
  descripcion: string;
  creado_el: string;
  actualizado_el: string;
}

export interface RolesApiResponse {
  success: boolean;
  message: string;
  data: RolUsuario[];
}
