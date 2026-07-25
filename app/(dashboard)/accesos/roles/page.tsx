"use client";

import { useState } from "react";
import { Box, Flex, VStack } from "@chakra-ui/react";
import { RoleFilterBar } from "@/components/dashboard/accesos/roles/RoleFilterBar";
import { RoleActionModal, RoleModalMode } from "@/components/dashboard/accesos/roles/RoleActionModal";
import { DataTable } from "@/components/dashboard/DataTable";
import { StatusModal } from "@/components/dashboard/StatusModal";
import { getRoleColumns } from "@/components/dashboard/accesos/roles/RoleColumns";
import { useRoles } from "./hooks/useRoles";
import { Role } from "./types/Role";
import { PageTransition } from "@/components";

export default function RolesPage() {
  const {
    data,
    loading,
    filters,
    setFilters,
    totalPages,
    statusModal,
    setStatusModal,
    createRole,
    updateRole,
    deleteRole,
    assignPermissions,
  } = useRoles();

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<RoleModalMode>("create");
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const openModal = (
    mode: RoleModalMode,
    role: Role | null = null
  ) => {
    setModalMode(mode);
    setSelectedRole(role);
    setModalOpen(true);
  };

  const handleAction = async (data: any) => {
    if (modalMode === "create") {
      await createRole(data);
    } else if (modalMode === "edit" && selectedRole) {
      await updateRole(selectedRole.id, data);
    } else if (modalMode === "delete" && selectedRole) {
      await deleteRole(selectedRole.id);
    } else if (modalMode === "assign_permissions" && selectedRole) {
      await assignPermissions(selectedRole.id, data.permisosIds);
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

      {/* Filtros */}
        <RoleFilterBar
          search={filters.search}
          status={filters.status}
          onFilterChange={(newFilters) =>
            setFilters({ ...filters, ...newFilters })
          }
          onAddClick={() => openModal("create")}
        />

        {/* Tabla */}
        <DataTable
          columns={getRoleColumns((role, mode) => openModal(mode, role))}
          data={data}
          pageSize={filters.limit || 10}
          tableHeight="calc(100vh - 180px)"
          loading={loading}
          serverPagination={{
            currentPage: filters.page,
            totalPages: totalPages,
            onPageChange: (page) => setFilters({ ...filters, page }),
          }}
        />
      {/* Modal Reutilizable de Acciones */}
      <RoleActionModal
        role={selectedRole}
        mode={modalMode}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onAction={handleAction}
      />
    </Box>
  );
}
