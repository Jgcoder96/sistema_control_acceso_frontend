"use client";

import { useState } from "react";
import { Box } from "@chakra-ui/react";
import { DataTable } from "@/components/dashboard/DataTable";
import { StatusModal } from "@/components/dashboard/StatusModal";
import {
  UserActionModal,
  ModalMode,
} from "@/components/dashboard/accesos/usuarios/UserActionModal";
import { UserFilterBar } from "@/components/dashboard/accesos/usuarios/UserFilterBar";
import { getUserColumns } from "@/components/dashboard/accesos/usuarios/UserColumns";
import { useUsers } from "./hooks/useUsers";
import { Usuario, UserQueryParams } from "./types/Usuario";

/**
 * Controlador principal (Smart Component) para la vista de gestión de Usuarios.
 * Orquesta la tabla de datos, la barra de filtros, y los modales dinámicos (CRUD)
 * delegando la gestión de estado y peticiones a red al custom hook `useUsers`.
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
   * Prepara y despliega el modal dinámico con el contexto del usuario seleccionado.
   * @param user - Entidad del usuario a operar o null si es creación.
   * @param mode - Modo de operación (crear, editar, ver, eliminar, asignar roles).
   */
  const handleOpenModal = (user: Usuario | null, mode: ModalMode): void => {
    setSelectedUser(user);
    setModalMode(mode);
    setIsModalOpen(true);
  };

  /**
   * Intercepta el submit del modal y enruta la petición hacia la función del hook
   * correspondiente basándose en el modo de operación activo.
   * @param payload - Datos del formulario (FormData, ID de usuario, o payload de roles).
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
    } else if (
      modalMode === "assign_roles" &&
      typeof payload === "object" &&
      payload !== null &&
      "userId" in payload
    ) {
      await assignRoles(payload.userId, payload.rolesIds);
    }
  };

  /**
   * Actualiza el estado de los filtros y reinicia la paginación a la primera hoja.
   * @param newParams - Objeto con los parámetros de búsqueda o estado actualizados.
   */
  const handleFilterChange = (newParams: Partial<UserQueryParams>): void => {
    setFilters((prev) => ({ ...prev, ...newParams, page: 1 }));
  };

  // Pre-computa la configuración de columnas inyectando el manejador del modal
  const columnas = getUserColumns(handleOpenModal);

  return (
    <Box bg="gray.50/40" display="flex" flexDirection="column" h="full">
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
