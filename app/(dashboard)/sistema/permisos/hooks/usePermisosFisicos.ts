import { useState, useCallback } from "react";
import { API_CONFIG } from "@/config/api";
import { apiFetch } from "@/utils/apiClient";
import {
  PermisoFisico,
  PermisoFisicoQueryParams,
} from "../types/PermisoFisico";

/**
 * Custom hook principal para la gestión de Permisos Físicos.
 * Expone el estado global de los datos de permisos, paginación, y las
 * funciones asíncronas para listar, crear y eliminar registros.
 */
export const usePermisosFisicos = () => {
  const [data, setData] = useState<PermisoFisico[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  /**
   * Obtiene la lista paginada de permisos físicos aplicando filtros.
   * Maneja internamente la desestructuración de metadata del servidor.
   */
  const fetchPermisos = useCallback(
    async (params: PermisoFisicoQueryParams) => {
      setIsLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append("page", params.page.toString());
        if (params.limit) queryParams.append("limit", params.limit.toString());
        if (params.status && params.status !== "all")
          queryParams.append("status", params.status);
        if (params.cedula) queryParams.append("cedula", params.cedula);
        if (params.puntoAcceso)
          queryParams.append("puntoAcceso", params.puntoAcceso);
        if (params.ubicacion) queryParams.append("ubicacion", params.ubicacion);

        const response = await apiFetch(
          `${API_CONFIG.ENDPOINTS.PHYSICAL_PERMITS}?${queryParams.toString()}`,
        );

        if (response.ok) {
          const resData = await response.json();
          const items = Array.isArray(resData.data?.data)
            ? resData.data.data
            : Array.isArray(resData.data)
              ? resData.data
              : [];
          setData(items);
          setTotalPages(
            resData.metadata?.totalPages ||
              resData.data?.metadata?.totalPages ||
              1,
          );
          setTotalItems(
            resData.metadata?.totalItems ||
              resData.data?.metadata?.totalItems ||
              0,
          );
        } else {
          setData([]);
          setTotalPages(0);
          setTotalItems(0);
        }
      } catch (error) {
        console.error("Error fetching permisos fisicos:", error);
        setData([]);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  /**
   * Envía la solicitud al backend para asignar un nuevo acceso físico.
   */
  const createPermiso = async (
    usuario_id: string,
    punto_acceso_id: string,
    horario_id: string,
  ) => {
    const res = await apiFetch(API_CONFIG.ENDPOINTS.PHYSICAL_PERMITS, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuario_id, punto_acceso_id, horario_id }),
    });
    const result = await res.json();
    if (!res.ok)
      throw new Error(result.message || "Error al registrar el permiso físico");
    return result;
  };

  /**
   * Realiza un borrado (revocación lógica) de un permiso físico dado su ID.
   */
  const deletePermiso = async (id: string) => {
    const res = await apiFetch(
      API_CONFIG.ENDPOINTS.PHYSICAL_PERMITS_DETAIL(id),
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      },
    );
    const result = await res.json();
    if (!res.ok)
      throw new Error(result.message || "Error al eliminar el permiso físico");
    return result;
  };

  return {
    data,
    isLoading,
    totalPages,
    totalItems,
    fetchPermisos,
    createPermiso,
    deletePermiso,
  };
};
