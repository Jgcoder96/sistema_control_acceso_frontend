import { useState, useEffect, useCallback } from "react";
import { Permission, PermissionsApiResponse } from "../types/Permission";
import { PermissionFormValues } from "../schemas/permissionSchema";
import { API_CONFIG } from "@/config/api";
import { apiFetch } from "@/utils/apiClient";
import { toaster } from "@/components/ui/toaster";

/**
 * Hook para la gestión de permisos del sistema.
 * Provee estado y métodos para listar, crear y eliminar permisos.
 */
export const usePermissions = () => {
  // --- Estados Principales ---

  const [data, setData] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  // Filtros de búsqueda y paginación
  const [filters, setFilters] = useState<{
    page: number;
    limit: number;
    search: string;
    status: "active" | "deleted" | "all";
  }>({
    page: 1,
    limit: 10,
    search: "",
    status: "active",
  });

  // Estado del modal de notificaciones (éxito/error)
  const [statusModal, setStatusModal] = useState({
    open: false,
    isSuccess: true,
    title: "",
    message: "",
  });

  // --- Utilidades Privadas ---

  /** Muestra un modal de error estandarizado */
  const handleError = (
    title: string,
    defaultMessage: string,
    error?: unknown,
  ) => {
    if (error) console.error(error);
    setStatusModal({
      open: true,
      isSuccess: false,
      title,
      message: defaultMessage,
    });
  };

  // --- Operaciones de API ---

  /**
   * Obtiene la lista paginada de permisos aplicando los filtros.
   */
  const fetchPermissions = useCallback(async () => {
    setLoading(true);

    try {
      const queryParams = new URLSearchParams({
        page: filters.page.toString(),
        limit: filters.limit.toString(),
        ...(filters.search && { search: filters.search }),
        ...(filters.status && { status: filters.status }),
      });

      const res = await apiFetch(
        `${API_CONFIG.ENDPOINTS.APP_PERMISSIONS}?${queryParams}`,
      );

      const result: PermissionsApiResponse = await res.json();

      if (result.success) {
        setData(result.data);
        if (result.metadata) setTotalPages(result.metadata.totalPages);
      } else {
        toaster.create({
          title: "Error al cargar permisos",
          description: result.message,
          type: "error",
        });
      }
    } catch (error) {
      console.error(error);
      toaster.create({
        title: "Error de conexión",
        description: "No se pudo conectar con el servidor.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  }, [filters]);

  /**
   * Crea un nuevo permiso en el sistema.
   * @param payload Datos validados del formulario.
   */
  const createPermission = async (payload: PermissionFormValues) => {
    try {
      const res = await apiFetch(API_CONFIG.ENDPOINTS.APP_PERMISSIONS, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (result.success) {
        setStatusModal({
          open: true,
          isSuccess: true,
          title: "¡Permiso creado!",
          message: "El permiso se ha registrado correctamente.",
        });
        fetchPermissions();
      } else {
        handleError(
          "Error al crear",
          result.message || "No se pudo crear el permiso.",
        );
      }
    } catch (error) {
      handleError("Error del servidor", "Hubo un problema de conexión.", error);
    }
  };

  /**
   * Elimina lógicamente un permiso.
   * @param id Identificador único del permiso.
   */
  const deletePermission = async (id: string) => {
    try {
      const res = await apiFetch(
        `${API_CONFIG.ENDPOINTS.APP_PERMISSIONS}/${id}`,
        {
          method: "DELETE",
        },
      );

      const result = await res.json();

      if (result.success) {
        setStatusModal({
          open: true,
          isSuccess: true,
          title: "¡Permiso eliminado!",
          message: "El permiso se ha eliminado correctamente.",
        });
        fetchPermissions();
      } else {
        handleError(
          "Error al eliminar",
          result.message || "No se pudo eliminar el permiso.",
        );
      }
    } catch (error) {
      handleError("Error del servidor", "Hubo un problema de conexión.", error);
    }
  };

  // --- Efectos ---

  // Refresca la lista automáticamente cuando los filtros cambian
  useEffect(() => {
    fetchPermissions();
  }, [fetchPermissions]);

  return {
    data,
    loading,
    filters,
    setFilters,
    totalPages,
    statusModal,
    setStatusModal,
    createPermission,
    deletePermission,
  };
};
