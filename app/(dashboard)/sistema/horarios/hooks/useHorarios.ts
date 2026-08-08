import { useState, useCallback, useEffect } from "react";
import { Horario, HorarioQueryParams } from "../types/Horario";
import { API_CONFIG } from "@/config/api";
import { apiFetch } from "@/utils/apiClient";

/**
 * Hook personalizado para la gestión de Horarios.
 * Encapsula toda la lógica de obtención, creación, edición y eliminación (soft-delete) de horarios.
 *
 * Además, provee el estado local para la paginación, los filtros de búsqueda y el control
 * del modal de estados (StatusModal) para notificar al usuario sobre el éxito o fracaso de las operaciones.
 */
export const useHorarios = () => {
  const [data, setData] = useState<Horario[]>([]);
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

  const [filters, setFilters] = useState<HorarioQueryParams>({
    page: 1,
    limit: 10,
    status: "active",
  });

  const fetchHorarios = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.page) params.append("page", filters.page.toString());
      if (filters.limit) params.append("limit", filters.limit.toString());
      if (filters.search) params.append("search", filters.search);
      if (filters.status) params.append("status", filters.status);

      const url = `${API_CONFIG.ENDPOINTS.HORARIOS}?${params.toString()}`;
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
      console.error("Error fetching horarios:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchHorarios();
  }, [fetchHorarios]);

  const createHorario = async (payload: {
    nombre: string;
    detalles: Record<string, unknown>[];
  }) => {
    try {
      const response = await apiFetch(API_CONFIG.ENDPOINTS.HORARIOS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const resData = await response.json();
      if (!response.ok) {
        let errorMsg = resData.message || "Error al crear el horario";
        if (resData.errors && Array.isArray(resData.errors)) {
          errorMsg +=
            ": " +
            resData.errors
              .map(
                (e: { path: string[]; message: string }) =>
                  `${e.path.join(".")}: ${e.message}`,
              )
              .join(", ");
        }
        throw new Error(errorMsg);
      }

      setStatusModal({
        open: true,
        title: "Éxito",
        message: "Horario creado correctamente.",
        isSuccess: true,
      });
      fetchHorarios();
      return true;
    } catch (error: unknown) {
      setStatusModal({
        open: true,
        title: "Error",
        message:
          error instanceof Error
            ? error.message
            : "No se pudo crear el horario.",
        isSuccess: false,
      });
      return false;
    }
  };

  const updateHorario = async (
    id: string,
    payload: { nombre: string; detalles: Record<string, unknown>[] },
  ) => {
    try {
      const response = await apiFetch(API_CONFIG.ENDPOINTS.HORARIO_DETAIL(id), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const resData = await response.json();
      if (!response.ok) {
        let errorMsg = resData.message || "Error al actualizar el horario";
        if (resData.errors && Array.isArray(resData.errors)) {
          errorMsg +=
            ": " +
            resData.errors
              .map(
                (e: { path: string[]; message: string }) =>
                  `${e.path.join(".")}: ${e.message}`,
              )
              .join(", ");
        }
        throw new Error(errorMsg);
      }

      setStatusModal({
        open: true,
        title: "Éxito",
        message: "Horario actualizado correctamente.",
        isSuccess: true,
      });
      fetchHorarios();
      return true;
    } catch (error: unknown) {
      setStatusModal({
        open: true,
        title: "Error",
        message:
          error instanceof Error
            ? error.message
            : "No se pudo actualizar el horario.",
        isSuccess: false,
      });
      return false;
    }
  };

  const toggleDeleteHorario = async (id: string, currentlyDeleted: boolean) => {
    try {
      const response = await apiFetch(API_CONFIG.ENDPOINTS.HORARIO_DETAIL(id), {
        method: "DELETE",
      });

      const resData = await response.json();
      if (!response.ok) {
        throw new Error(
          resData.message || "Error al cambiar el estado del horario",
        );
      }

      setStatusModal({
        open: true,
        title: "Éxito",
        message: `Horario ${currentlyDeleted ? "restaurado" : "eliminado"} correctamente.`,
        isSuccess: true,
      });
      fetchHorarios();
      return true;
    } catch (error: unknown) {
      setStatusModal({
        open: true,
        title: "Error",
        message:
          error instanceof Error
            ? error.message
            : "No se pudo cambiar el estado del horario.",
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
    refresh: fetchHorarios,
    createHorario,
    updateHorario,
    toggleDeleteHorario,
  };
};
