"use client";

import React, { useState } from "react";
import { Box } from "@chakra-ui/react";
import { useHorarios } from "./hooks/useHorarios";
import { Horario } from "./types/Horario";
import { DataTable } from "@/components/dashboard/DataTable";
import { StatusModal } from "@/components/dashboard/StatusModal";
import { HorariosFilterBar } from "@/components/dashboard/sistema/horarios/HorariosFilterBar";
import { getHorariosColumns } from "@/components/dashboard/sistema/horarios/HorariosColumns";
import { HorarioFormModal } from "@/components/dashboard/sistema/horarios/HorarioFormModal";
import { HorarioDetailModal } from "@/components/dashboard/sistema/horarios/HorarioDetailModal";
import { HorarioDeleteModal } from "@/components/dashboard/sistema/horarios/HorarioDeleteModal";
import { HorarioFormValues } from "@/app/(dashboard)/sistema/horarios/schemas/horarioFormSchema";

/**
 * Página principal del módulo de Horarios.
 * Integra la tabla de datos, barra de filtros y modales CRUD (Crear, Editar, Ver, Eliminar).
 * 
 * Gestiona el estado de los modales y el elemento seleccionado, delegando la
 * lógica de negocio y llamadas a la API al hook `useHorarios`.
 */
export default function HorariosPage() {
  const {
    data,
    loading,
    filters,
    setFilters,
    totalPages,
    statusModal,
    setStatusModal,
    createHorario,
    updateHorario,
    toggleDeleteHorario,
  } = useHorarios();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedHorario, setSelectedHorario] = useState<Horario | null>(null);

  const handleOpenCreate = () => {
    setSelectedHorario(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (horario: Horario) => {
    setSelectedHorario(horario);
    setIsFormOpen(true);
  };

  const handleOpenDetail = (horario: Horario) => {
    setSelectedHorario(horario);
    setIsDetailOpen(true);
  };

  const handleOpenDelete = (horario: Horario) => {
    setSelectedHorario(horario);
    setIsDeleteOpen(true);
  };

  const columns = React.useMemo(
    () =>
      getHorariosColumns({
        onEdit: handleOpenEdit,
        onView: handleOpenDetail,
        onDeleteToggle: handleOpenDelete,
      }),
    [],
  );

  const handleFormSubmit = async (formData: HorarioFormValues) => {
    if (selectedHorario) {
      return await updateHorario(selectedHorario.id, formData);
    } else {
      return await createHorario(formData);
    }
  };

  return (
    <Box bg="gray.50/40" display="flex" flexDirection="column" h="full">
      <StatusModal
        {...statusModal}
        onClose={() => setStatusModal((prev) => ({ ...prev, open: false }))}
      />

      <HorariosFilterBar
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

      <HorarioFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        horario={selectedHorario}
        onSubmit={handleFormSubmit}
      />

      <HorarioDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        horario={selectedHorario}
      />

      <HorarioDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        horario={selectedHorario}
        onConfirm={toggleDeleteHorario}
      />
    </Box>
  );
}
