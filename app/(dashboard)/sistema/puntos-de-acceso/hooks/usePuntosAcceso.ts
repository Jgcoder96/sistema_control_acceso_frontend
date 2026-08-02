import { useState, useCallback, useEffect } from "react";
import { PuntoAcceso, PuntoAccesoQueryParams } from "../types/PuntoAcceso";
import { API_CONFIG } from "@/config/api";
import { apiFetch } from "@/utils/apiClient";

/**
 * Hook personalizado que encapsula toda la lógica de negocio y comunicación con la API
 * para la gestión de Puntos de Acceso. Maneja el estado global de la tabla, paginación, filtros
 * y las mutaciones (crear, actualizar, eliminar lógicamente).
 */
export const usePuntosAcceso = () => {
  const [data, setData] = useState<PuntoAcceso[]>([]);
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

  const [filters, setFilters] = useState<PuntoAccesoQueryParams>({
    page: 1,
    limit: 10,
    status: "active",
  });

  const fetchPuntosAcceso = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.page) params.append("page", filters.page.toString());
      if (filters.limit) params.append("limit", filters.limit.toString());
      if (filters.search) params.append("search", filters.search);
      if (filters.status) params.append("status", filters.status);
      if (filters.locationId) params.append("location", filters.locationId);
      
      const url = `${API_CONFIG.ENDPOINTS.PUNTOS_ACCESO}?${params.toString()}`;
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
      console.error("Error fetching puntos de acceso:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchPuntosAcceso();
  }, [fetchPuntosAcceso]);

  const createPuntoAcceso = async (payload: { nombre: string; mac: string; ubicacion_id: string }) => {
    try {
      const response = await apiFetch(API_CONFIG.ENDPOINTS.PUNTOS_ACCESO, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.message || "Error al crear el punto de acceso");
      }

      setStatusModal({
        open: true,
        title: "Éxito",
        message: "Punto de Acceso creado correctamente.",
        isSuccess: true,
      });
      fetchPuntosAcceso();
      return true;
    } catch (error: unknown) {
      setStatusModal({
        open: true,
        title: "Error",
        message: error instanceof Error ? error.message : "No se pudo crear el punto de acceso.",
        isSuccess: false,
      });
      return false;
    }
  };

  const updatePuntoAcceso = async (id: string, payload: { nombre: string; mac: string; ubicacion_id: string }) => {
    try {
      const response = await apiFetch(API_CONFIG.ENDPOINTS.PUNTO_ACCESO_DETAIL(id), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.message || "Error al actualizar el punto de acceso");
      }

      setStatusModal({
        open: true,
        title: "Éxito",
        message: "Punto de Acceso actualizado correctamente.",
        isSuccess: true,
      });
      fetchPuntosAcceso();
      return true;
    } catch (error: unknown) {
      setStatusModal({
        open: true,
        title: "Error",
        message: error instanceof Error ? error.message : "No se pudo actualizar el punto de acceso.",
        isSuccess: false,
      });
      return false;
    }
  };

  const toggleDeletePuntoAcceso = async (id: string, currentlyDeleted: boolean) => {
    try {
      const response = await apiFetch(API_CONFIG.ENDPOINTS.PUNTO_ACCESO_DETAIL(id), {
        method: "DELETE",
      });

      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.message || "Error al cambiar el estado del punto de acceso");
      }

      setStatusModal({
        open: true,
        title: "Éxito",
        message: `Punto de Acceso ${currentlyDeleted ? "restaurado" : "eliminado"} correctamente.`,
        isSuccess: true,
      });
      fetchPuntosAcceso();
      return true;
    } catch (error: unknown) {
      setStatusModal({
        open: true,
        title: "Error",
        message: error instanceof Error ? error.message : "No se pudo cambiar el estado del punto de acceso.",
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
    refresh: fetchPuntosAcceso,
    createPuntoAcceso,
    updatePuntoAcceso,
    toggleDeletePuntoAcceso,
  };
};
