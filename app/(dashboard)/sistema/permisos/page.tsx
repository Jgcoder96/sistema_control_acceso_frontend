"use client";

import React, { useState, useEffect } from "react";
import { Box } from "@chakra-ui/react";
import { DataTable } from "@/components/dashboard/DataTable";
import { StatusModal } from "@/components/dashboard/StatusModal";
import { usePermisosFisicos } from "@/app/(dashboard)/sistema/permisos/hooks/usePermisosFisicos";
import { PermisosFilterBar } from "@/components/dashboard/sistema/permisos/PermisosFilterBar";
import { getPermisosColumns } from "@/components/dashboard/sistema/permisos/PermisosColumns";
import { PermisoCreateModal } from "@/components/dashboard/sistema/permisos/PermisoCreateModal";
import { PermisoDeleteModal } from "@/components/dashboard/sistema/permisos/PermisoDeleteModal";
import { PermisoFisico, PermisoFiltroEstado } from "@/app/(dashboard)/sistema/permisos/types/PermisoFisico";
import { PermisoCreateValues } from "@/app/(dashboard)/sistema/permisos/schemas/permisoSchemas";

/**
 * Página principal del módulo de Permisos Físicos.
 * Orquesta el estado global de la vista, la tabla de datos, los filtros y los modales.
 * Actúa como controlador (Smart Component) inyectando props a los componentes visuales.
 */
export default function PermisosPage() {
  const {
    data,
    isLoading,
    totalPages,
    fetchPermisos,
    createPermiso,
    deletePermiso,
  } = usePermisosFisicos();

  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  const [filters, setFilters] = useState<{
    cedula?: string;
    puntoAcceso?: string;
    ubicacion?: string;
    status?: PermisoFiltroEstado;
  }>({
    status: "all",
  });

  const [selectedPermiso, setSelectedPermiso] = useState<PermisoFisico | null>(null);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

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

  useEffect(() => {
    fetchPermisos({ page: currentPage, limit, ...filters });
  }, [currentPage, filters, fetchPermisos]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const showStatus = (isSuccess: boolean, title: string, message: string) => {
    setStatusModal({ open: true, isSuccess, title, message });
  };

  const handleCreateSubmit = async (values: PermisoCreateValues) => {
    try {
      await createPermiso(values.usuario_id, values.punto_acceso_id, values.horario_id);
      showStatus(true, "Éxito", "Permiso físico registrado correctamente.");
      fetchPermisos({ page: currentPage, limit, ...filters });
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Ocurrió un error inesperado.";
      showStatus(false, "Error", msg);
    }
  };

  const handleDeleteConfirm = async (id: string) => {
    try {
      await deletePermiso(id);
      showStatus(true, "Éxito", "Permiso físico revocado exitosamente.");
      fetchPermisos({ page: currentPage, limit, ...filters });
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Ocurrió un error inesperado.";
      showStatus(false, "Error", msg);
    }
  };

  const openDelete = (p: PermisoFisico) => {
    setSelectedPermiso(p);
    setIsDeleteOpen(true);
  };

  const columns = React.useMemo(
    () =>
      getPermisosColumns({
        onDeleteToggle: openDelete,
      }),
    [],
  );

  return (
    <Box bg="gray.50/40" display="flex" flexDirection="column" h="full">
      <StatusModal
        {...statusModal}
        onClose={() => setStatusModal((prev) => ({ ...prev, open: false }))}
      />

      <PermisosFilterBar
        onSearchChange={(cedula, puntoAcceso, ubicacion) => {
          setFilters((prev) => ({ ...prev, cedula, puntoAcceso, ubicacion }));
          setCurrentPage(1);
        }}
        onStatusChange={(status) => {
          setFilters((prev) => ({ ...prev, status }));
          setCurrentPage(1);
        }}
        onOpenCreate={() => setIsCreateOpen(true)}
      />

      <DataTable
        columns={columns}
        data={data}
        loading={isLoading}
        pageSize={limit}
        tableHeight="calc(100vh - 180px)"
        serverPagination={{
          currentPage,
          totalPages,
          onPageChange: handlePageChange,
        }}
      />

      <PermisoCreateModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreateSubmit}
      />

      <PermisoDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        permiso={selectedPermiso}
        onConfirm={handleDeleteConfirm}
      />
    </Box>
  );
}
