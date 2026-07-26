import { useState, useEffect, useCallback } from "react";
import { Log, LogQueryParams } from "../types/Log";
import { apiFetch } from "@/utils/apiClient";
import { API_CONFIG } from "@/config/api";

/**
 * Hook personalizado que gestiona la carga, paginación y filtros de los Logs.
 */
export const useLogs = () => {
  const [data, setData] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState<LogQueryParams>({
    page: 1,
    limit: 10,
  });

  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      // Construir Query Parameters a partir del estado de filtros
      const params = new URLSearchParams();
      if (filters.page) params.append("page", filters.page.toString());
      if (filters.limit) params.append("limit", filters.limit.toString());
      if (filters.ubicacion) params.append("ubicacionId", filters.ubicacion);
      if (filters.punto_acceso) params.append("puntoDeAccesoId", filters.punto_acceso);
      if (filters.cedula) params.append("cedula", filters.cedula);
      if (filters.tarjeta) params.append("tarjeta", filters.tarjeta);

      const url = `${API_CONFIG.ENDPOINTS.LOGS}?${params.toString()}`;
      const response = await apiFetch(url);

      if (response.ok) {
        const resData = await response.json();
        // Asumiendo que el backend retorna { data: Log[], metadata: { totalPages: number } }
        // Se ajusta a una estructura segura
        const logs: Log[] = Array.isArray(resData.data) ? resData.data : (Array.isArray(resData) ? resData : []);
        setData(logs);
        setTotalPages(resData.metadata?.totalPages || 1);
      } else {
        // En caso de que el backend no tenga data, limpiamos el estado
        setData([]);
      }
    } catch (error) {
      console.error("Error fetching logs:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return {
    data,
    loading,
    filters,
    setFilters,
    totalPages,
    refresh: fetchLogs,
  };
};
