"use client";

import React, { useState } from "react";
import { Box, VStack, HStack, Text } from "@chakra-ui/react";

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

export default function PermisosPage() {
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

  const [modalState, setModalState] = useState<{
    open: boolean;
    mode: PermissionModalMode;
    permission: Permission | null;
  }>({
    open: false,
    mode: "view",
    permission: null,
  });

  const columns = getPermissionColumns(
    (perm) => setModalState({ open: true, mode: "view", permission: perm }),
    (perm) => setModalState({ open: true, mode: "delete", permission: perm })
  );

  const handleFilterChange = (newFilters: {
    search?: string;
    status?: "active" | "deleted" | "all";
  }) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleAction = async (payload: PermissionFormValues | string) => {
    if (modalState.mode === "create") {
      await createPermission(payload as PermissionFormValues);
    } else if (modalState.mode === "delete") {
      await deletePermission(payload as string);
    }
  };

  return (
    <Box
      bg="gray.50/40"
      display="flex"
      flexDirection="column"
      h="full"
    >
      <StatusModal
        {...statusModal}
        onClose={() => setStatusModal((prev) => ({ ...prev, open: false }))}
      />

      <PermissionFilterBar
        search={filters.search}
        status={filters.status}
        onFilterChange={handleFilterChange}
        onAddClick={() =>
          setModalState({ open: true, mode: "create", permission: null })
        }
      />

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
