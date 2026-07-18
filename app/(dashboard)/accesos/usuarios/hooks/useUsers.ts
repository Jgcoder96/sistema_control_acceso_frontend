"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Usuario,
  UsuariosApiResponse,
  UserQueryParams,
} from "../types/Usuario";
import { API_CONFIG } from "@/config/api";

export function useUsers() {
  const [data, setData] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [statusModal, setStatusModal] = useState({
    open: false,
    title: "",
    message: "",
    isSuccess: false,
  });

  const [filters, setFilters] = useState<UserQueryParams>({
    status: "all",
    search: "",
    page: 1,
    limit: 10,
  });

  const showStatus = (title: string, message: string, isSuccess: boolean) => {
    setStatusModal({ open: true, title, message, isSuccess });
  };

  const fetchUsers = useCallback(async () => {
    const token = localStorage.getItem("access_token");
    setLoading(true);
    try {
      const params = new URLSearchParams({
        status: filters.status,
        page: filters.page.toString(),
        limit: filters.limit.toString(),
      });
      if (filters.search) params.append("search", filters.search);

      const response = await fetch(
        `${API_CONFIG.ENDPOINTS.USERS}?${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const result: UsuariosApiResponse = await response.json();
      if (result.success) {
        setData(result.data);
        setTotalPages(result.metadata.totalPages);
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
      fetchUsers();
    } else {
      // Tomamos el primer error de 'issues' si existe, si no, el 'message'
      const errorMsg =
        result.issues?.[0]?.message ||
        result.message ||
        "Error en la operación";
      showStatus("Error", errorMsg, false);
    }
  };

  const createUser = async (formData: FormData) => {
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(API_CONFIG.ENDPOINTS.USERS, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      await handleApiResponse(res, "Usuario creado correctamente");
    } catch (err) {
      showStatus("Error", "Error de red", false);
    }
  };

  const updateUser = async (id: string, formData: FormData) => {
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(API_CONFIG.ENDPOINTS.USER_DETAIL(id), {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      await handleApiResponse(res, "Usuario actualizado correctamente");
    } catch (err) {
      showStatus("Error", "Error de red", false);
    }
  };

  const deleteUser = async (id: string) => {
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(API_CONFIG.ENDPOINTS.USER_DETAIL(id), {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      await handleApiResponse(res, "Usuario eliminado");
    } catch (err) {
      showStatus("Error", "Error de red", false);
    }
  };

  const assignRoles = async (userId: string, rolesIds: string[]) => {
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(API_CONFIG.ENDPOINTS.USER_ROLES(userId), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rolesIds }),
      });
      await handleApiResponse(res, "Roles asignados correctamente");
    } catch (err) {
      showStatus("Error", "Error de red", false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    data,
    loading,
    filters,
    setFilters,
    totalPages,
    statusModal,
    setStatusModal,
    createUser,
    updateUser,
    deleteUser,
    assignRoles,
  };
}
