"use client";

import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "@/utils/apiClient";
import { Role, RolesApiResponse } from "../types/Role";
import { API_CONFIG } from "@/config/api";

export interface RoleQueryParams {
  status: "active" | "deleted" | "all";
  search: string;
  page: number;
  limit: number;
}

// Interfaz auxiliar para mapear de forma estricta los posibles errores de Zod en el API
interface GenericApiResponse {
  success: boolean;
  message?: string;
  issues?: Array<{ message: string }>;
}

/**
 * Hook personalizado para la gestión integral de Roles.
 * Centraliza el estado, los filtros, la paginación y todos los métodos CRUD.
 */
export function useRoles() {
  // --- Estados Principales ---

  const [data, setData] = useState<Role[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalPages, setTotalPages] = useState<number>(1);

  const [filters, setFilters] = useState<RoleQueryParams>({
    status: "all",
    search: "",
    page: 1,
    limit: 10,
  });

  const [statusModal, setStatusModal] = useState({
    open: false,
    title: "",
    message: "",
    isSuccess: false,
  });

  // --- Utilidades Privadas ---

  /** Muestra el modal estandarizado con un título, mensaje e indicador de éxito/error */
  const showStatus = (title: string, message: string, isSuccess: boolean) => {
    setStatusModal({ open: true, title, message, isSuccess });
  };

  /** Procesa respuestas genéricas y levanta la alerta correspondiente según el payload */
  const handleApiResponse = async (res: Response, successMsg: string) => {
    const result = (await res.json()) as GenericApiResponse;
    if (result.success) {
      showStatus("Éxito", successMsg, true);
      fetchRoles();
    } else {
      const errorMsg =
        result.issues?.[0]?.message ||
        result.message ||
        "Error en la operación";
      showStatus("Error", errorMsg, false);
    }
  };

  // --- Operaciones de API ---

  /**
   * Obtiene la lista paginada de roles aplicando los filtros vigentes (estado, búsqueda, etc).
   */
  const fetchRoles = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        status: filters.status,
        page: filters.page.toString(),
        limit: filters.limit.toString(),
      });
      if (filters.search) params.append("search", filters.search);

      const response = await apiFetch(
        `${API_CONFIG.ENDPOINTS.ROLES}?${params.toString()}`,
      );

      // Combinamos ambas interfaces de forma segura en lugar de usar 'any'
      const result = (await response.json()) as RolesApiResponse &
        GenericApiResponse;

      if (result.success) {
        setData(result.data);
        setTotalPages(result.metadata?.totalPages || 1);
      } else {
        const errorMsg =
          result.issues?.[0]?.message ||
          result.message ||
          "Error al obtener roles";
        showStatus("Error", errorMsg, false);
      }
    } catch {
      showStatus("Error", "No se pudo conectar con el servidor", false);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  /**
   * Registra un nuevo rol en la base de datos.
   */
  const createRole = async (formData: {
    nombre: string;
    descripcion?: string;
  }) => {
    try {
      const res = await apiFetch(API_CONFIG.ENDPOINTS.ROLES, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      await handleApiResponse(res, "Rol creado correctamente");
    } catch {
      showStatus("Error", "Error de red", false);
    }
  };

  /**
   * Actualiza la información (nombre, descripción) de un rol existente.
   */
  const updateRole = async (
    id: string,
    formData: { nombre?: string; descripcion?: string },
  ) => {
    try {
      const res = await apiFetch(`${API_CONFIG.ENDPOINTS.ROLES}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      await handleApiResponse(res, "Rol actualizado correctamente");
    } catch {
      showStatus("Error", "Error de red", false);
    }
  };

  /**
   * Elimina de forma lógica un rol por su identificador.
   */
  const deleteRole = async (id: string) => {
    try {
      const res = await apiFetch(`${API_CONFIG.ENDPOINTS.ROLES}/${id}`, {
        method: "DELETE",
      });
      await handleApiResponse(res, "Rol eliminado");
    } catch {
      showStatus("Error", "Error de red", false);
    }
  };

  /**
   * Realiza la asignación masiva de permisos al rol especificado.
   */
  const assignPermissions = async (roleId: string, permisosIds: string[]) => {
    try {
      const res = await apiFetch(
        API_CONFIG.ENDPOINTS.ROLE_PERMISSIONS(roleId),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ permisosIds }),
        },
      );
      await handleApiResponse(res, "Permisos asignados correctamente");
    } catch {
      showStatus("Error", "Error de red", false);
    }
  };

  // --- Efectos ---

  // Dispara el refresco automático de datos cuando el usuario interactúa con la paginación o filtros
  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  return {
    data,
    loading,
    filters,
    setFilters,
    totalPages,
    statusModal,
    setStatusModal,
    createRole,
    updateRole,
    deleteRole,
    assignPermissions,
  };
}
