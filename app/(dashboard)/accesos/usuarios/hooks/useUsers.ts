"use client";

import { useState, useEffect, useCallback } from "react";
import { apiFetch } from '@/utils/apiClient';
import {
  Usuario,
  UsuariosApiResponse,
  UserQueryParams,
} from "../types/Usuario";
import { API_CONFIG } from "@/config/api";

// Interfaz auxiliar para mapear de forma estricta los posibles errores de Zod en el API
interface GenericApiResponse {
  success: boolean;
  message?: string;
  issues?: Array<{ message: string }>;
}

/**
 * Hook personalizado para la gestión integral de Usuarios.
 * Centraliza el estado, la paginación delegada al backend, los filtros y los métodos CRUD.
 */
export function useUsers() {
  // --- Estados Principales ---

  const [data, setData] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalPages, setTotalPages] = useState<number>(1);
  
  const [filters, setFilters] = useState<UserQueryParams>({
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
      fetchUsers();
    } else {
      const errorMsg =
        result.issues?.[0]?.message ||
        result.message ||
        "Error en la operación";
      showStatus("Error", errorMsg, false);
    }
  };

  // --- Operaciones de API ---

  /** Obtiene la lista paginada de usuarios aplicando los filtros vigentes */
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        status: filters.status,
        page: filters.page.toString(),
        limit: filters.limit.toString(),
      });
      if (filters.search) params.append("search", filters.search);

      const response = await apiFetch(`${API_CONFIG.ENDPOINTS.USERS}?${params.toString()}`);
      
      // Combinamos interfaces de forma segura en lugar de usar 'any'
      const result = (await response.json()) as UsuariosApiResponse & GenericApiResponse;
      
      if (result.success) {
        setData(result.data);
        setTotalPages(result.metadata?.totalPages || 1);
      } else {
        const errorMsg =
          result.issues?.[0]?.message ||
          result.message ||
          "Error al obtener usuarios";
        showStatus("Error", errorMsg, false);
      }
    } catch {
      showStatus("Error", "No se pudo conectar con el servidor", false);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  /** Registra un nuevo usuario en la base de datos (Soporta multipart/form-data para fotos) */
  const createUser = async (formData: FormData) => {
    try {
      const res = await apiFetch(API_CONFIG.ENDPOINTS.USERS, {
        method: "POST",
        body: formData,
      });
      await handleApiResponse(res, "Usuario creado correctamente");
    } catch {
      showStatus("Error", "Error de red", false);
    }
  };

  /** Actualiza la información de un usuario existente */
  const updateUser = async (id: string, formData: FormData) => {
    try {
      const res = await apiFetch(API_CONFIG.ENDPOINTS.USER_DETAIL(id), {
        method: "PUT",
        body: formData,
      });
      await handleApiResponse(res, "Usuario actualizado correctamente");
    } catch {
      showStatus("Error", "Error de red", false);
    }
  };

  /** Elimina de forma lógica un usuario por su identificador */
  const deleteUser = async (id: string) => {
    try {
      const res = await apiFetch(API_CONFIG.ENDPOINTS.USER_DETAIL(id), {
        method: "DELETE",
      });
      await handleApiResponse(res, "Usuario eliminado");
    } catch {
      showStatus("Error", "Error de red", false);
    }
  };

  /** Realiza la asignación masiva de roles al usuario especificado */
  const assignRoles = async (userId: string, rolesIds: string[]) => {
    try {
      const res = await apiFetch(API_CONFIG.ENDPOINTS.USER_ROLES(userId), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rolesIds }),
      });
      await handleApiResponse(res, "Roles asignados correctamente");
    } catch {
      showStatus("Error", "Error de red", false);
    }
  };

  // --- Efectos ---

  // Dispara el refresco automático de datos cuando el usuario interactúa con la paginación o filtros
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    data,
    loading,
    filters,
    setFilters,
    totalPages,
    statusModal,
    setStatusModal,
    createUser,
    updateUser,
    deleteUser,
    assignRoles,
  };
}
