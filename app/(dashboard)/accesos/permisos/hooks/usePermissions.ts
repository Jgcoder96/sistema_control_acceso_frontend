import { useState, useEffect, useCallback } from "react";
import { Permission, PermissionsApiResponse } from "../types/Permission";
import { API_CONFIG } from "@/config/api";
import { toaster } from "@/components/ui/toaster";

export const usePermissions = () => {
  const [data, setData] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
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
  const [totalPages, setTotalPages] = useState(1);
  const [statusModal, setStatusModal] = useState({
    open: false,
    isSuccess: true,
    title: "",
    message: "",
  });

  const fetchPermissions = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      const queryParams = new URLSearchParams({
        page: filters.page.toString(),
        limit: filters.limit.toString(),
        ...(filters.search && { search: filters.search }),
        ...(filters.status && { status: filters.status }),
      });

      const res = await fetch(`${API_CONFIG.ENDPOINTS.APP_PERMISSIONS}?${queryParams}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result: PermissionsApiResponse = await res.json();

      if (result.success) {
        setData(result.data);
        if (result.metadata) {
          setTotalPages(result.metadata.totalPages);
        }
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
        title: "Error",
        description: "Hubo un error al conectar con el servidor.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchPermissions();
  }, [fetchPermissions]);

  const createPermission = async (payload: any) => {
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(API_CONFIG.ENDPOINTS.APP_PERMISSIONS, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (result.success) {
        setStatusModal({
          open: true,
          isSuccess: true,
          title: "¡Permiso creado con éxito!",
          message: "El permiso se ha registrado correctamente.",
        });
        fetchPermissions();
      } else {
        setStatusModal({
          open: true,
          isSuccess: false,
          title: "Error al crear",
          message: result.message || "No se pudo crear el permiso.",
        });
      }
    } catch (error) {
      console.error(error);
      setStatusModal({
        open: true,
        isSuccess: false,
        title: "Error del servidor",
        message: "Hubo un problema al conectar con el servidor.",
      });
    }
  };

  const deletePermission = async (id: string) => {
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`${API_CONFIG.ENDPOINTS.APP_PERMISSIONS}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

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
        setStatusModal({
          open: true,
          isSuccess: false,
          title: "Error al eliminar",
          message: result.message || "No se pudo eliminar el permiso.",
        });
      }
    } catch (error) {
      console.error(error);
      setStatusModal({
        open: true,
        isSuccess: false,
        title: "Error del servidor",
        message: "Hubo un problema al conectar con el servidor.",
      });
    }
  };

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
