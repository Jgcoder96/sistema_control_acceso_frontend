"use client";

import { useState } from "react";
import { Box } from "@chakra-ui/react";
import { DataTable } from "@/components/dashboard/DataTable";
import { StatusModal } from "@/components/dashboard/StatusModal";
import { UserActionModal, ModalMode } from "@/components/dashboard/accesos/usuarios/UserActionModal";
import { UserFilterBar } from "@/components/dashboard/accesos/usuarios/UserFilterBar";
import { getUserColumns } from "@/components/dashboard/accesos/usuarios/UserColumns";
import { useUsers } from "./hooks/useUsers";
import { Usuario, UserQueryParams } from "./types/Usuario";

/**
 * Pantalla principal para la gestión de Usuarios del sistema.
 * Coordina la tabla, filtros, modales y paginación delegando la lógica al hook useUsers.
 */
export default function UsuariosPage() {
  // Hook central que administra los datos remotos y los parámetros
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

  // Estados locales para controlar qué usuario y qué acción se va a ejecutar en el modal
  const [selectedUser, setSelectedUser] = useState<Usuario | null>(null);
  const [modalMode, setModalMode] = useState<ModalMode>("view");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  /**
   * Inicializa y despliega el modal dinámico.
   */
  const handleOpenModal = (user: Usuario | null, mode: ModalMode): void => {
    setSelectedUser(user);
    setModalMode(mode);
    setIsModalOpen(true);
  };

  /**
   * Orquesta la ejecución del submit del modal dependiendo del modo activo.
   */
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

  /**
   * Sincroniza cambios en el input de búsqueda o dropdown y resetea a la página 1.
   */
  const handleFilterChange = (newParams: Partial<UserQueryParams>): void => {
    setFilters((prev) => ({ ...prev, ...newParams, page: 1 }));
  };

  // Pre-computa la configuración de columnas inyectando el manejador del modal
  const columnas = getUserColumns(handleOpenModal);

  return (
    <Box
      bg="gray.50/40"
      display="flex"
      flexDirection="column"
      h="full"
    >
      {/* Alertas flotantes globales (Errores de API, Notificaciones de Éxito) */}
      <StatusModal
        {...statusModal}
        onClose={() => setStatusModal((prev) => ({ ...prev, open: false }))}
      />

      {/* Modal que muta visualmente dependiendo del modalMode (CRUD) */}
      <UserActionModal
        open={isModalOpen}
        mode={modalMode}
        user={selectedUser}
        onClose={() => setIsModalOpen(false)}
        onAction={handleModalAction}
      />

      {/* Controles de Búsqueda y Botón de Registro */}
      <UserFilterBar
        search={filters.search || ""}
        status={filters.status}
        onFilterChange={handleFilterChange}
        onAddClick={() => handleOpenModal(null, "create")}
      />

      {/* Tabla de Usuarios (Paginación delegada al backend) */}
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
