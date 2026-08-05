import { useState, useCallback } from "react";
import { API_CONFIG } from "@/config/api";
import { apiFetch } from "@/utils/apiClient";
import {
  Tarjeta,
  TarjetaQueryParams,
} from "@/app/(dashboard)/sistema/tarjetas/types/Tarjeta";

export const useTarjetas = () => {
  const [data, setData] = useState<Tarjeta[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const fetchTarjetas = useCallback(
    async (params: TarjetaQueryParams) => {
      setIsLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append("page", params.page.toString());
        if (params.limit) queryParams.append("limit", params.limit.toString());
        if (params.status && params.status !== "all") queryParams.append("status", params.status);
        if (params.codigo) queryParams.append("codigo", params.codigo);
        if (params.cedula) queryParams.append("cedula", params.cedula);

        const response = await apiFetch(`${API_CONFIG.ENDPOINTS.TARJETAS}?${queryParams.toString()}`);

        if (response.ok) {
          const resData = await response.json();
          const items = Array.isArray(resData.data?.data) ? resData.data.data : Array.isArray(resData.data) ? resData.data : [];
          setData(items);
          setTotalPages(resData.metadata?.totalPages || resData.data?.metadata?.totalPages || 1);
          setTotalItems(resData.metadata?.totalItems || resData.data?.metadata?.totalItems || 0);
        } else {
          setData([]);
          setTotalPages(0);
          setTotalItems(0);
        }
      } catch (error) {
        console.error("Error fetching tarjetas:", error);
        setData([]);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const createTarjeta = async (codigo: string) => {
    const res = await apiFetch(API_CONFIG.ENDPOINTS.TARJETAS, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ codigo }),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Error al registrar la tarjeta");
    return result;
  };

  const assignTarjeta = async (id: string, usuario_id: string) => {
    const res = await apiFetch(API_CONFIG.ENDPOINTS.TARJETAS_ASSIGN(id), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuario_id }),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Error al asignar la tarjeta");
    return result;
  };

  const simpleAction = async (id: string, endpointUrl: string) => {
    const res = await apiFetch(endpointUrl, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Error al realizar la acción");
    return result;
  };

  const returnTarjeta = (id: string) => simpleAction(id, API_CONFIG.ENDPOINTS.TARJETAS_RETURN(id));
  const blockTarjeta = (id: string) => simpleAction(id, API_CONFIG.ENDPOINTS.TARJETAS_BLOCK(id));
  const reactivateTarjeta = (id: string) => simpleAction(id, API_CONFIG.ENDPOINTS.TARJETAS_REACTIVATE(id));
  const reportLostTarjeta = (id: string) => simpleAction(id, API_CONFIG.ENDPOINTS.TARJETAS_LOST(id));

  const deleteTarjeta = async (id: string) => {
    const res = await apiFetch(API_CONFIG.ENDPOINTS.TARJETAS_DELETE(id), {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Error al eliminar la tarjeta");
    return result;
  };

  return {
    data,
    isLoading,
    totalPages,
    totalItems,
    fetchTarjetas,
    createTarjeta,
    assignTarjeta,
    returnTarjeta,
    blockTarjeta,
    reactivateTarjeta,
    reportLostTarjeta,
    deleteTarjeta,
  };
};
