import { useState, useCallback, useEffect } from "react";
import { Festivo, FestivoQueryParams } from "../types/Festivo";
import { API_CONFIG } from "@/config/api";
import { apiFetch } from "@/utils/apiClient";

export const useFestivos = () => {
  const [data, setData] = useState<Festivo[]>([]);
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

  const [filters, setFilters] = useState<FestivoQueryParams>({
    page: 1,
    limit: 10,
    status: "active",
  });

  const fetchFestivos = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.page) params.append("page", filters.page.toString());
      if (filters.limit) params.append("limit", filters.limit.toString());
      if (filters.search) params.append("search", filters.search);
      if (filters.status) params.append("status", filters.status);

      const url = `${API_CONFIG.ENDPOINTS.FESTIVOS}?${params.toString()}`;
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
      console.error("Error fetching festivos:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchFestivos();
  }, [fetchFestivos]);

  const createFestivo = async (payload: {
    nombre: string;
    dia: number;
    mes: number;
    anio?: number | null;
  }) => {
    try {
      const response = await apiFetch(API_CONFIG.ENDPOINTS.FESTIVOS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const resData = await response.json();
      if (!response.ok) {
        let errorMsg = resData.message || "Error al crear el feriado";
        if (resData.issues && Array.isArray(resData.issues)) {
          errorMsg +=
            ": " +
            resData.issues
              .map((e: { field?: string; message: string }) => `${e.field || 'general'}: ${e.message}`)
              .join(", ");
        }
        throw new Error(errorMsg);
      }

      setStatusModal({
        open: true,
        title: "Éxito",
        message: "Feriado creado correctamente.",
        isSuccess: true,
      });
      fetchFestivos();
      return true;
    } catch (error: unknown) {
      setStatusModal({
        open: true,
        title: "Error",
        message:
          error instanceof Error
            ? error.message
            : "No se pudo crear el feriado.",
        isSuccess: false,
      });
      return false;
    }
  };

  const updateFestivo = async (
    id: string,
    payload: { nombre: string; dia: number; mes: number; anio?: number | null }
  ) => {
    try {
      const response = await apiFetch(API_CONFIG.ENDPOINTS.FESTIVO_DETAIL(id), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const resData = await response.json();
      if (!response.ok) {
        let errorMsg = resData.message || "Error al actualizar el feriado";
        if (resData.issues && Array.isArray(resData.issues)) {
          errorMsg +=
            ": " +
            resData.issues
              .map((e: { field?: string; message: string }) => `${e.field || 'general'}: ${e.message}`)
              .join(", ");
        }
        throw new Error(errorMsg);
      }

      setStatusModal({
        open: true,
        title: "Éxito",
        message: "Feriado actualizado correctamente.",
        isSuccess: true,
      });
      fetchFestivos();
      return true;
    } catch (error: unknown) {
      setStatusModal({
        open: true,
        title: "Error",
        message:
          error instanceof Error
            ? error.message
            : "No se pudo actualizar el feriado.",
        isSuccess: false,
      });
      return false;
    }
  };

  const toggleDeleteFestivo = async (id: string, currentlyDeleted: boolean) => {
    try {
      const response = await apiFetch(API_CONFIG.ENDPOINTS.FESTIVO_DETAIL(id), {
        method: "DELETE",
      });

      const resData = await response.json();
      if (!response.ok) {
        throw new Error(
          resData.message || "Error al cambiar el estado del feriado"
        );
      }

      setStatusModal({
        open: true,
        title: "Éxito",
        message: `Feriado ${currentlyDeleted ? "restaurado" : "eliminado"} correctamente.`,
        isSuccess: true,
      });
      fetchFestivos();
      return true;
    } catch (error: unknown) {
      setStatusModal({
        open: true,
        title: "Error",
        message:
          error instanceof Error
            ? error.message
            : "No se pudo cambiar el estado del feriado.",
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
    refresh: fetchFestivos,
    createFestivo,
    updateFestivo,
    toggleDeleteFestivo,
  };
};
