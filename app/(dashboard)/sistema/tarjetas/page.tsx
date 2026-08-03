"use client";

import React, { useState, useEffect } from "react";
import { Box } from "@chakra-ui/react";
import { DataTable } from "@/components/dashboard/DataTable";
import { StatusModal } from "@/components/dashboard/StatusModal";
import { useTarjetas } from "@/app/(dashboard)/sistema/tarjetas/hooks/useTarjetas";
import { TarjetasFilterBar } from "@/components/dashboard/sistema/tarjetas/TarjetasFilterBar";
import { getTarjetasColumns } from "@/components/dashboard/sistema/tarjetas/TarjetasColumns";
import { TarjetaCreateModal } from "@/components/dashboard/sistema/tarjetas/TarjetaCreateModal";
import { TarjetaAssignModal } from "@/components/dashboard/sistema/tarjetas/TarjetaAssignModal";
import { TarjetaActionModal, TarjetaActionType } from "@/components/dashboard/sistema/tarjetas/TarjetaActionModal";
import { TarjetaDetailModal } from "@/components/dashboard/sistema/tarjetas/TarjetaDetailModal";
import { Tarjeta, TarjetaFiltroEstado } from "@/app/(dashboard)/sistema/tarjetas/types/Tarjeta";
import { TarjetaCreateValues } from "@/app/(dashboard)/sistema/tarjetas/schemas/tarjetaSchemas";

export default function TarjetasPage() {
  const {
    data,
    isLoading,
    totalPages,
    totalItems,
    fetchTarjetas,
    createTarjeta,
    assignTarjeta,
    returnTarjeta,
    blockTarjeta,
    reactivateTarjeta,
    reportLostTarjeta,
    deleteTarjeta,
  } = useTarjetas();

  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;
  
  const [filters, setFilters] = useState<{ codigo?: string; cedula?: string; status?: TarjetaFiltroEstado }>({
    status: "all",
  });

  const [selectedTarjeta, setSelectedTarjeta] = useState<Tarjeta | null>(null);

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  
  // Generic action modal state
  const [isActionOpen, setIsActionOpen] = useState(false);
  const [actionType, setActionType] = useState<TarjetaActionType | null>(null);

  // Status modal state
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
    fetchTarjetas({ page: currentPage, limit, ...filters });
  }, [currentPage, filters, fetchTarjetas]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const showStatus = (isSuccess: boolean, title: string, message: string) => {
    setStatusModal({ open: true, isSuccess, title, message });
  };

  const handleCreateSubmit = async (values: TarjetaCreateValues) => {
    try {
      await createTarjeta(values.codigo);
      showStatus(true, "Éxito", "Tarjeta registrada correctamente.");
      fetchTarjetas({ page: currentPage, limit, ...filters });
    } catch (error: any) {
      showStatus(false, "Error", error.message || "Ocurrió un error inesperado.");
    }
  };

  const handleAssignSubmit = async (id: string, usuario_id: string) => {
    try {
      await assignTarjeta(id, usuario_id);
      showStatus(true, "Éxito", "Tarjeta asignada exitosamente.");
      fetchTarjetas({ page: currentPage, limit, ...filters });
    } catch (error: any) {
      showStatus(false, "Error", error.message || "Ocurrió un error inesperado.");
    }
  };

  const handleActionConfirm = async (id: string, action: TarjetaActionType) => {
    try {
      switch (action) {
        case "block":
          await blockTarjeta(id);
          showStatus(true, "Éxito", "Tarjeta bloqueada exitosamente.");
          break;
        case "reactivate":
          await reactivateTarjeta(id);
          showStatus(true, "Éxito", "Tarjeta reactivada exitosamente.");
          break;
        case "return":
          await returnTarjeta(id);
          showStatus(true, "Éxito", "Tarjeta devuelta exitosamente.");
          break;
        case "lost":
          await reportLostTarjeta(id);
          showStatus(true, "Éxito", "Tarjeta reportada como perdida.");
          break;
        case "delete":
          await deleteTarjeta(id);
          showStatus(true, "Éxito", "Tarjeta eliminada exitosamente.");
          break;
      }
      fetchTarjetas({ page: currentPage, limit, ...filters });
    } catch (error: any) {
      showStatus(false, "Error", error.message || "Ocurrió un error inesperado.");
    }
  };

  // Handlers for opening modals
  const openDetail = (t: Tarjeta) => { setSelectedTarjeta(t); setIsDetailOpen(true); };
  const openAssign = (t: Tarjeta) => { setSelectedTarjeta(t); setIsAssignOpen(true); };
  
  const openAction = (t: Tarjeta, action: TarjetaActionType) => {
    setSelectedTarjeta(t);
    setActionType(action);
    setIsActionOpen(true);
  };

  const columns = React.useMemo(
    () =>
      getTarjetasColumns({
        onDetail: openDetail,
        onAssign: openAssign,
        onBlock: (t) => openAction(t, "block"),
        onReturn: (t) => openAction(t, "return"),
        onReactivate: (t) => openAction(t, "reactivate"),
        onLost: (t) => openAction(t, "lost"),
        onDeleteToggle: (t) => openAction(t, "delete"),
      }),
    []
  );

  return (
    <Box bg="gray.50/40" display="flex" flexDirection="column" h="full">
      <StatusModal
        {...statusModal}
        onClose={() => setStatusModal(prev => ({ ...prev, open: false }))}
      />

      <TarjetasFilterBar
        onSearchChange={(codigo, cedula) => {
          setFilters(prev => ({ ...prev, codigo, cedula }));
          setCurrentPage(1);
        }}
        onStatusChange={(status) => {
          setFilters(prev => ({ ...prev, status }));
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

      <TarjetaCreateModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreateSubmit}
      />

      <TarjetaAssignModal
        isOpen={isAssignOpen}
        onClose={() => setIsAssignOpen(false)}
        tarjeta={selectedTarjeta}
        onSubmit={handleAssignSubmit}
      />

      <TarjetaActionModal
        isOpen={isActionOpen}
        onClose={() => setIsActionOpen(false)}
        tarjeta={selectedTarjeta}
        actionType={actionType}
        onConfirm={handleActionConfirm}
      />

      <TarjetaDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        tarjeta={selectedTarjeta}
      />
    </Box>
  );
}
