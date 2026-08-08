import { useState, useCallback, useEffect } from "react";
import { Ubicacion, UbicacionQueryParams } from "../types/Ubicacion";
import { API_CONFIG } from "@/config/api";
import { apiFetch } from "@/utils/apiClient";

/**
 * Hook personalizado que encapsula toda la lógica de negocio y comunicación con la API
 * para la gestión de Ubicaciones. Maneja el estado global de la tabla, paginación, filtros
 * y las mutaciones (crear, actualizar, eliminar lógicamente).
 */
export const useUbicaciones = () => {
  const [data, setData] = useState<Ubicacion[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [statusModal, setStatusModal] = useState<{
    open: boolean;
    isSuccess: boolean;
    title: string;
    message: string;
  }>({
    open: false,
    isSuccess: true,
    title: "",
    message: "",
  });

  const [filters, setFilters] = useState<UbicacionQueryParams>({
    page: 1,
    limit: 10,
    status: "active",
  });

  const fetchUbicaciones = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.page) params.append("page", filters.page.toString());
      if (filters.limit) params.append("limit", filters.limit.toString());
      if (filters.search) params.append("search", filters.search);
      if (filters.status) params.append("status", filters.status);

      const url = `${API_CONFIG.ENDPOINTS.UBICACIONES}?${params.toString()}`;
      const response = await apiFetch(url);

      if (response.ok) {
        const resData = await response.json();
        const items = Array.isArray(resData.data) ? resData.data : [];
        setData(items);
        setTotalPages(resData.metadata?.totalPages || 1);
        setTotalItems(resData.metadata?.totalItems || 0);
      } else {
        setData([]);
        setTotalPages(0);
        setTotalItems(0);
      }
    } catch (error) {
      console.error("Error fetching ubicaciones:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchUbicaciones();
  }, [fetchUbicaciones]);

  const createUbicacion = async (payload: {
    nombre: string;
    mesh_id: string;
  }) => {
    try {
      const response = await apiFetch(API_CONFIG.ENDPOINTS.UBICACIONES, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.message || "Error al crear la ubicación");
      }

      setStatusModal({
        open: true,
        title: "Éxito",
        message: "Ubicación creada correctamente.",
        isSuccess: true,
      });
      fetchUbicaciones();
      return true;
    } catch (error: unknown) {
      setStatusModal({
        open: true,
        title: "Error",
        message:
          error instanceof Error
            ? error.message
            : "No se pudo crear la ubicación.",
        isSuccess: false,
      });
      return false;
    }
  };

  const updateUbicacion = async (
    id: string,
    payload: { nombre: string; mesh_id: string },
  ) => {
    try {
      const response = await apiFetch(
        API_CONFIG.ENDPOINTS.UBICACION_DETAIL(id),
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.message || "Error al actualizar la ubicación");
      }

      setStatusModal({
        open: true,
        title: "Éxito",
        message: "Ubicación actualizada correctamente.",
        isSuccess: true,
      });
      fetchUbicaciones();
      return true;
    } catch (error: unknown) {
      setStatusModal({
        open: true,
        title: "Error",
        message:
          error instanceof Error
            ? error.message
            : "No se pudo actualizar la ubicación.",
        isSuccess: false,
      });
      return false;
    }
  };

  const toggleDeleteUbicacion = async (
    id: string,
    currentlyDeleted: boolean,
  ) => {
    try {
      // Si el backend soporta toggle en el DELETE (soft delete / restore)
      // O enviaremos DELETE siempre
      const response = await apiFetch(
        API_CONFIG.ENDPOINTS.UBICACION_DETAIL(id),
        {
          method: "DELETE",
        },
      );

      const resData = await response.json();
      if (!response.ok) {
        throw new Error(
          resData.message || "Error al cambiar el estado de la ubicación",
        );
      }

      setStatusModal({
        open: true,
        title: "Éxito",
        message: `Ubicación ${currentlyDeleted ? "restaurada" : "eliminada"} correctamente.`,
        isSuccess: true,
      });
      fetchUbicaciones();
      return true;
    } catch (error: unknown) {
      setStatusModal({
        open: true,
        title: "Error",
        message:
          error instanceof Error
            ? error.message
            : "No se pudo cambiar el estado de la ubicación.",
        isSuccess: false,
      });
      return false;
    }
  };

  return {
    data,
    loading,
    filters,
    setFilters,
    totalPages,
    totalItems,
    statusModal,
    setStatusModal,
    refresh: fetchUbicaciones,
    createUbicacion,
    updateUbicacion,
    toggleDeleteUbicacion,
  };
};
