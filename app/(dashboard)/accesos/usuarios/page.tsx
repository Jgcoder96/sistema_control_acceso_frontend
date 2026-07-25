"use client";

import { useState } from "react";
import { Box, Center, Spinner } from "@chakra-ui/react";
import { DataTable } from "../../../../components/dashboard/DataTable";
import { StatusModal } from "../../../../components/dashboard/StatusModal";
import { UserActionModal, ModalMode } from "@/components/dashboard/accesos/usuarios/UserActionModal";
import { UserFilterBar } from "@/components/dashboard/accesos/usuarios/UserFilterBar";
import { getUserColumns } from "@/components/dashboard/accesos/usuarios/UserColumns";
import { useUsers } from "./hooks/useUsers";
import { Usuario, UserQueryParams } from "./types/Usuario";

export default function UsuariosPage() {
  const {
    data,
    loading,
    filters,
    setFilters,
    totalPages,
    statusModal,
    setStatusModal,
    createUser,
    updateUser,
    deleteUser,
    assignRoles,
  } = useUsers();

  const [selectedUser, setSelectedUser] = useState<Usuario | null>(null);
  const [modalMode, setModalMode] = useState<ModalMode>("view");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleOpenModal = (user: Usuario | null, mode: ModalMode): void => {
    setSelectedUser(user);
    setModalMode(mode);
    setIsModalOpen(true);
  };

  const handleModalAction = async (
    payload: FormData | string | { userId: string; rolesIds: string[] },
  ): Promise<void> => {
    if (modalMode === "create") {
      await createUser(payload as FormData);
    } else if (modalMode === "edit" && selectedUser) {
      await updateUser(selectedUser.id, payload as FormData);
    } else if (modalMode === "delete" && typeof payload === "string") {
      await deleteUser(payload);
    } else if (modalMode === "assign_roles" && typeof payload === "object" && payload !== null && "userId" in payload) {
      await assignRoles(payload.userId, payload.rolesIds);
    }
  };

  const handleFilterChange = (newParams: Partial<UserQueryParams>): void => {
    setFilters((prev) => ({ ...prev, ...newParams, page: 1 }));
  };

  const columnas = getUserColumns(handleOpenModal);

  return (
    <Box
      bg="gray.50/40"
      display="flex"
      flexDirection="column"
      h="full"
    >
      {/* CORRECCIÓN AQUÍ: Eliminado el 'open' duplicado */}
      <StatusModal
        {...statusModal}
        onClose={() => setStatusModal((prev) => ({ ...prev, open: false }))}
      />

      <UserActionModal
        open={isModalOpen}
        mode={modalMode}
        user={selectedUser}
        onClose={() => setIsModalOpen(false)}
        onAction={handleModalAction}
      />

      <UserFilterBar
        search={filters.search || ""}
        status={filters.status}
        onFilterChange={handleFilterChange}
        onAddClick={() => handleOpenModal(null, "create")}
      />

      <DataTable
        columns={columnas}
        data={data}
        pageSize={filters.limit}
        tableHeight="calc(100vh - 180px)"
        loading={loading}
        serverPagination={{
          currentPage: filters.page,
          totalPages: totalPages,
          onPageChange: (page) => setFilters((prev) => ({ ...prev, page })),
        }}
      />
    </Box>
  );
}
