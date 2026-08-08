"use client";

import React, { useState } from "react";
import { Box } from "@chakra-ui/react";
import { useFestivos } from "./hooks/useFestivos";
import { Festivo } from "./types/Festivo";
import { DataTable } from "@/components/dashboard/DataTable";
import { StatusModal } from "@/components/dashboard/StatusModal";
import { FestivosFilterBar } from "@/components/dashboard/sistema/festivos/FestivosFilterBar";
import { getFestivosColumns } from "@/components/dashboard/sistema/festivos/FestivosColumns";
import { FestivoFormModal } from "@/components/dashboard/sistema/festivos/FestivoFormModal";
import { FestivoDetailModal } from "@/components/dashboard/sistema/festivos/FestivoDetailModal";
import { FestivoDeleteModal } from "@/components/dashboard/sistema/festivos/FestivoDeleteModal";
import { FestivoFormValues } from "@/app/(dashboard)/sistema/festivos/schemas/festivoFormSchema";

/**
 * Página principal del módulo de Días Festivos.
 * Orquesta la visualización, filtrado y las acciones CRUD (Crear, Leer, Actualizar, Eliminar)
 * delegando la gestión del estado al hook `useFestivos` y la UI a los modales.
 */
export default function FestivosPage() {
  const {
    data,
    loading,
    filters,
    setFilters,
    totalPages,
    statusModal,
    setStatusModal,
    createFestivo,
    updateFestivo,
    toggleDeleteFestivo,
  } = useFestivos();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedFestivo, setSelectedFestivo] = useState<Festivo | null>(null);

  const handleOpenDetail = (festivo: Festivo) => {
    setSelectedFestivo(festivo);
    setIsDetailOpen(true);
  };

  const handleOpenCreate = () => {
    setSelectedFestivo(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (festivo: Festivo) => {
    setSelectedFestivo(festivo);
    setIsFormOpen(true);
  };

  const handleOpenDelete = (festivo: Festivo) => {
    setSelectedFestivo(festivo);
    setIsDeleteOpen(true);
  };

  const columns = React.useMemo(
    () =>
      getFestivosColumns({
        onDetail: handleOpenDetail,
        onEdit: handleOpenEdit,
        onDeleteToggle: handleOpenDelete,
      }),
    [],
  );

  const handleFormSubmit = async (formData: FestivoFormValues) => {
    if (selectedFestivo) {
      return await updateFestivo(selectedFestivo.id, formData);
    } else {
      return await createFestivo(formData);
    }
  };

  return (
    <Box bg="gray.50/40" display="flex" flexDirection="column" h="full">
      <StatusModal
        {...statusModal}
        onClose={() => setStatusModal((prev) => ({ ...prev, open: false }))}
      />

      <FestivosFilterBar
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

      <FestivoFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        festivo={selectedFestivo}
        onSubmit={handleFormSubmit}
      />

      <FestivoDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        festivo={selectedFestivo}
      />

      <FestivoDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        festivo={selectedFestivo}
        onConfirm={toggleDeleteFestivo}
      />
    </Box>
  );
}
