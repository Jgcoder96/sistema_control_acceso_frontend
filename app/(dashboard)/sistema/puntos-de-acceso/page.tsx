"use client";

import { useState } from "react";
import { Box } from "@chakra-ui/react";
import { usePuntosAcceso } from "./hooks/usePuntosAcceso";
import { PuntoAcceso } from "./types/PuntoAcceso";
import { DataTable } from "@/components/dashboard/DataTable";
import { StatusModal } from "@/components/dashboard/StatusModal";
import { PuntosAccesoFilterBar } from "@/components/dashboard/puntos-acceso/PuntosAccesoFilterBar";
import { getPuntosAccesoColumns } from "@/components/dashboard/puntos-acceso/PuntosAccesoColumns";
import { PuntoAccesoFormModal } from "@/components/dashboard/puntos-acceso/PuntoAccesoFormModal";
import { PuntoAccesoDetailModal } from "@/components/dashboard/puntos-acceso/PuntoAccesoDetailModal";
import { PuntoAccesoDeleteModal } from "@/components/dashboard/puntos-acceso/PuntoAccesoDeleteModal";

/**
 * Página principal del módulo de Puntos de Acceso.
 * Gestiona la visualización, filtrado y orquestación de las acciones CRUD
 * delegando la lógica de estado al hook `usePuntosAcceso`.
 */
export default function SistemaPuntosAccesoPage() {
  const {
    data,
    loading,
    filters,
    setFilters,
    totalPages,
    statusModal,
    setStatusModal,
    createPuntoAcceso,
    updatePuntoAcceso,
    toggleDeletePuntoAcceso,
  } = usePuntosAcceso();

  // Estados de Modales
  const [selectedPunto, setSelectedPunto] = useState<PuntoAcceso | null>(null);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Acciones de las Columnas
  const handleView = (punto: PuntoAcceso) => {
    setSelectedPunto(punto);
    setIsDetailOpen(true);
  };

  const handleEdit = (punto: PuntoAcceso) => {
    setSelectedPunto(punto);
    setIsFormOpen(true);
  };

  const handleToggleDelete = (punto: PuntoAcceso) => {
    setSelectedPunto(punto);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async (id: string) => {
    return await toggleDeletePuntoAcceso(id, !!selectedPunto?.eliminado_el);
  };

  const handleOpenCreate = () => {
    setSelectedPunto(null);
    setIsFormOpen(true);
  };

  const handleSaveForm = async (payload: {
    nombre: string;
    mac: string;
    ubicacion_id: string;
  }) => {
    if (selectedPunto) {
      return await updatePuntoAcceso(selectedPunto.id, payload);
    } else {
      return await createPuntoAcceso(payload);
    }
  };

  const columns = getPuntosAccesoColumns({
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

      <PuntosAccesoFilterBar
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
      <PuntoAccesoFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        punto={selectedPunto}
        onSave={handleSaveForm}
      />

      <PuntoAccesoDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        punto={selectedPunto}
      />

      <PuntoAccesoDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        punto={selectedPunto}
        onConfirm={confirmDelete}
      />
    </Box>
  );
}
