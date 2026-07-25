"use client";

import React, { useState } from "react";
import { Box } from "@chakra-ui/react";

import { usePermissions } from "./hooks/usePermissions";
import { Permission } from "./types/Permission";
import { PermissionFormValues } from "./schemas/permissionSchema";

import { PermissionFilterBar } from "@/components/dashboard/accesos/permisos/PermissionFilterBar";
import { getPermissionColumns } from "@/components/dashboard/accesos/permisos/PermissionColumns";
import {
  PermissionActionModal,
  PermissionModalMode,
} from "@/components/dashboard/accesos/permisos/PermissionActionModal";

import { DataTable } from "@/components/dashboard/DataTable";
import { StatusModal } from "@/components/dashboard/StatusModal";

/**
 * Pantalla principal para la gestión de Permisos.
 * Integra la tabla de datos, barra de filtros y modales de acción.
 */
export default function PermisosPage() {
  // Hook personalizado para el manejo de estado y API
  const {
    data,
    loading,
    filters,
    setFilters,
    totalPages,
    statusModal,
    setStatusModal,
    createPermission,
    deletePermission,
  } = usePermissions();

  // Estado unificado para el manejo de los modales de acción
  const [modalState, setModalState] = useState<{
    open: boolean;
    mode: PermissionModalMode;
    permission: Permission | null;
  }>({
    open: false,
    mode: "view",
    permission: null,
  });

  // Configuración de las columnas de la tabla y sus respectivas acciones
  const columns = getPermissionColumns(
    (perm) => setModalState({ open: true, mode: "view", permission: perm }),
    (perm) => setModalState({ open: true, mode: "delete", permission: perm }),
  );

  // Manejador para cambios en los filtros de búsqueda y estado
  const handleFilterChange = (newFilters: {
    search?: string;
    status?: "active" | "deleted" | "all";
  }) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
  };

  // Manejador de paginación
  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  // Manejador centralizado para confirmar acciones del modal (crear/eliminar)
  const handleAction = async (payload: PermissionFormValues | string) => {
    if (modalState.mode === "create") {
      await createPermission(payload as PermissionFormValues);
    } else if (modalState.mode === "delete") {
      await deletePermission(payload as string);
    }
  };

  return (
    <Box bg="gray.50/40" display="flex" flexDirection="column" h="full">
      {/* Notificaciones globales de éxito o error */}
      <StatusModal
        {...statusModal}
        onClose={() => setStatusModal((prev) => ({ ...prev, open: false }))}
      />

      {/* Barra superior de búsqueda, filtros y botón de añadir */}
      <PermissionFilterBar
        search={filters.search}
        status={filters.status}
        onFilterChange={handleFilterChange}
        onAddClick={() =>
          setModalState({ open: true, mode: "create", permission: null })
        }
      />

      {/* Tabla de permisos con soporte de paginación del servidor */}
      <DataTable
        columns={columns}
        data={data}
        pageSize={filters.limit || 10}
        tableHeight="calc(100vh - 180px)"
        loading={loading}
        serverPagination={{
          currentPage: filters.page,
          totalPages: totalPages,
          onPageChange: handlePageChange,
        }}
      />

      {/* Modal para operaciones de creación, detalles y eliminación */}
      <PermissionActionModal
        permission={modalState.permission}
        mode={modalState.mode}
        open={modalState.open}
        onClose={() => setModalState((prev) => ({ ...prev, open: false }))}
        onAction={handleAction}
      />
    </Box>
  );
}
