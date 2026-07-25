"use client";

import { useState, useEffect, useCallback } from "react";
import { apiFetch } from '@/utils/apiClient';
import { Role } from "../types/Role";
import { API_CONFIG } from "@/config/api";

export interface RoleQueryParams {
  status: "active" | "deleted" | "all";
  search: string;
  page: number;
  limit: number;
}

export function useRoles() {
  const [data, setData] = useState<Role[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [statusModal, setStatusModal] = useState({
    open: false,
    title: "",
    message: "",
    isSuccess: false,
  });

  const [filters, setFilters] = useState<RoleQueryParams>({
    status: "all",
    search: "",
    page: 1,
    limit: 10,
  });

  const showStatus = (title: string, message: string, isSuccess: boolean) => {
    setStatusModal({ open: true, title, message, isSuccess });
  };

  const fetchRoles = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        status: filters.status,
        page: filters.page.toString(),
        limit: filters.limit.toString(),
      });
      if (filters.search) params.append("search", filters.search);

      const response = await apiFetch(`${API_CONFIG.ENDPOINTS.ROLES}?${params.toString()}`);

      const result: any = await response.json();
      if (result.success) {
        setData(result.data);
        setTotalPages(result.metadata?.totalPages || 1);
      } else {
        const errorMsg =
          result.issues?.[0]?.message ||
          result.message ||
          "Error al obtener roles";
        showStatus("Error", errorMsg, false);
      }
    } catch (error) {
      showStatus("Error", "No se pudo conectar con el servidor", false);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const handleApiResponse = async (res: Response, successMsg: string) => {
    const result = await res.json();
    if (result.success) {
      showStatus("Éxito", successMsg, true);
      fetchRoles();
    } else {
      const errorMsg =
        result.issues?.[0]?.message ||
        result.message ||
        "Error en la operación";
      showStatus("Error", errorMsg, false);
    }
  };

  const createRole = async (formData: { nombre: string; descripcion?: string }) => {
    try {
      const res = await apiFetch(API_CONFIG.ENDPOINTS.ROLES, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      await handleApiResponse(res, "Rol creado correctamente");
    } catch (err) {
      showStatus("Error", "Error de red", false);
    }
  };

  const updateRole = async (id: string, formData: { nombre?: string; descripcion?: string }) => {
    try {
      const res = await apiFetch(`${API_CONFIG.ENDPOINTS.ROLES}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      await handleApiResponse(res, "Rol actualizado correctamente");
    } catch (err) {
      showStatus("Error", "Error de red", false);
    }
  };

  const deleteRole = async (id: string) => {
    try {
      const res = await apiFetch(`${API_CONFIG.ENDPOINTS.ROLES}/${id}`, {
        method: "DELETE",
      });
      await handleApiResponse(res, "Rol eliminado");
    } catch (err) {
      showStatus("Error", "Error de red", false);
    }
  };

  const assignPermissions = async (roleId: string, permisosIds: string[]) => {
    try {
      const res = await apiFetch(API_CONFIG.ENDPOINTS.ROLE_PERMISSIONS(roleId), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ permisosIds }),
      });
      await handleApiResponse(res, "Permisos asignados correctamente");
    } catch (err) {
      showStatus("Error", "Error de red", false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  return {
    data,
    loading,
    filters,
    setFilters,
    totalPages,
    statusModal,
    setStatusModal,
    createRole,
    updateRole,
    deleteRole,
    assignPermissions,
  };
}
