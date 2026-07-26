"use client";

import { useState } from "react";
import { Box } from "@chakra-ui/react";
import { DataTable } from "@/components/dashboard/DataTable";
import { useLogs } from "./hooks/useLogs";
import { Log } from "./types/Log";
import { getLogColumns } from "@/components/dashboard/logs/LogColumns";
import { LogFilterBar } from "@/components/dashboard/logs/LogFilterBar";
import { LogDetailModal } from "@/components/dashboard/logs/LogDetailModal";

/**
 * Página principal de Auditoría y Accesos (Logs).
 * Tabla estricta de solo lectura (sin crear, editar o eliminar).
 */
export default function LogsPage() {
  const { data, loading, filters, setFilters, totalPages } = useLogs();

  const [selectedLog, setSelectedLog] = useState<Log | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Acción de visualización (solo lectura)
  const handleView = (log: Log) => {
    setSelectedLog(log);
    setIsModalOpen(true);
  };

  const columns = getLogColumns(handleView);

  return (
    <Box bg="gray.50/40" display="flex" flexDirection="column" h="full">
      {/* Barra de Filtros: Ubicación, Punto de Acceso, Cédula y Tarjeta */}
      <LogFilterBar filters={filters} setFilters={setFilters} />

      {/* Tabla de Datos de Solo Lectura */}
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

      {/* Modal de Detalles */}
      <LogDetailModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedLog(null);
        }}
        log={selectedLog}
      />
    </Box>
  );
}
