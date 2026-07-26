"use client";

import { useState } from "react";
import { Box } from "@chakra-ui/react";
import { useUbicaciones } from "./hooks/useUbicaciones";
import { Ubicacion } from "./types/Ubicacion";
import { DataTable } from "@/components/dashboard/DataTable";
import { StatusModal } from "@/components/dashboard/StatusModal";
import { UbicacionesFilterBar } from "@/components/dashboard/ubicaciones/UbicacionesFilterBar";
import { getUbicacionesColumns } from "@/components/dashboard/ubicaciones/UbicacionesColumns";
import { UbicacionFormModal } from "@/components/dashboard/ubicaciones/UbicacionFormModal";
import { UbicacionDetailModal } from "@/components/dashboard/ubicaciones/UbicacionDetailModal";
import { UbicacionDeleteModal } from "@/components/dashboard/ubicaciones/UbicacionDeleteModal";

/**
 * Página principal del módulo de Ubicaciones.
 * Gestiona la visualización, filtrado y orquestación de las acciones CRUD (Crear, Leer, Actualizar, Eliminar)
 * delegando la lógica de estado al hook `useUbicaciones` y la interfaz a los componentes de presentación.
 */
export default function SistemaUbicacionesPage() {
  const {
    data,
    loading,
    filters,
    setFilters,
    totalPages,
    statusModal,
    setStatusModal,
    createUbicacion,
    updateUbicacion,
    toggleDeleteUbicacion,
  } = useUbicaciones();

  // Estados de Modales
  const [selectedUbicacion, setSelectedUbicacion] = useState<Ubicacion | null>(
    null,
  );

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Acciones de las Columnas
  const handleView = (ubicacion: Ubicacion) => {
    setSelectedUbicacion(ubicacion);
    setIsDetailOpen(true);
  };

  const handleEdit = (ubicacion: Ubicacion) => {
    setSelectedUbicacion(ubicacion);
    setIsFormOpen(true);
  };

  const handleToggleDelete = (ubicacion: Ubicacion) => {
    setSelectedUbicacion(ubicacion);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async (id: string) => {
    return await toggleDeleteUbicacion(id, false);
  };

  const handleOpenCreate = () => {
    setSelectedUbicacion(null);
    setIsFormOpen(true);
  };

  const handleSaveForm = async (payload: {
    nombre: string;
    mesh_id: string;
  }) => {
    if (selectedUbicacion) {
      return await updateUbicacion(selectedUbicacion.id, payload);
    } else {
      return await createUbicacion(payload);
    }
  };

  const columns = getUbicacionesColumns({
    onView: handleView,
    onEdit: handleEdit,
    onToggleDelete: handleToggleDelete,
  });

  return (
    <Box bg="gray.50/40" display="flex" flexDirection="column" h="full">
      <StatusModal
        {...statusModal}
        onClose={() => setStatusModal((prev) => ({ ...prev, open: false }))}
      />

      <UbicacionesFilterBar
        filters={filters}
        setFilters={setFilters}
        onOpenCreate={handleOpenCreate}
      />

      <DataTable
        data={data}
        columns={columns}
        pageSize={filters.limit || 10}
        tableHeight="calc(100vh - 180px)"
        loading={loading}
        serverPagination={{
          currentPage: filters.page || 1,
          totalPages: totalPages,
          onPageChange: (page) => setFilters((prev) => ({ ...prev, page })),
        }}
      />

      {/* Modales */}
      <UbicacionFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        ubicacion={selectedUbicacion}
        onSave={handleSaveForm}
      />

      <UbicacionDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        ubicacion={selectedUbicacion}
      />

      <UbicacionDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        ubicacion={selectedUbicacion}
        onConfirm={confirmDelete}
      />
    </Box>
  );
}
