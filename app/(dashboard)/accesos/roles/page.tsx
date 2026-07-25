"use client";

import { useState } from "react";
import { Box } from "@chakra-ui/react";
import { RoleFilterBar } from "@/components/dashboard/accesos/roles/RoleFilterBar";
import {
  RoleActionModal,
  RoleModalMode,
} from "@/components/dashboard/accesos/roles/RoleActionModal";
import { DataTable } from "@/components/dashboard/DataTable";
import { StatusModal } from "@/components/dashboard/StatusModal";
import { getRoleColumns } from "@/components/dashboard/accesos/roles/RoleColumns";
import { useRoles } from "./hooks/useRoles";
import { Role } from "./types/Role";
import { RoleFormValues } from "./schemas/roleSchema";

/**
 * Pantalla principal para la gestión de Roles del sistema.
 * Integra de forma reactiva la tabla de datos, los filtros de búsqueda y los modales CRUD.
 */
export default function RolesPage() {
  // Hook central que administra los datos remotos y los filtros
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

  // Control local para la visibilidad y contexto de los modales de acción
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<RoleModalMode>("create");
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  /**
   * Abre el modal configurando su comportamiento y el rol seleccionado.
   */
  const openModal = (mode: RoleModalMode, role: Role | null = null) => {
    setModalMode(mode);
    setSelectedRole(role);
    setModalOpen(true);
  };

  /**
   * Procesa la confirmación de acciones dentro del modal (Crear, Editar, Eliminar, Permisos).
   * Parsea explícitamente el tipo de dato subyacente de forma segura (sin `any`).
   */
  const handleAction = async (data: unknown) => {
    if (modalMode === "create") {
      await createRole(data as RoleFormValues);
    } else if (modalMode === "edit" && selectedRole) {
      await updateRole(selectedRole.id, data as RoleFormValues);
    } else if (modalMode === "delete" && selectedRole) {
      await deleteRole(selectedRole.id);
    } else if (modalMode === "assign_permissions" && selectedRole) {
      await assignPermissions(
        selectedRole.id,
        (data as { permisosIds: string[] }).permisosIds
      );
    }
  };

  return (
    <Box bg="gray.50/40" display="flex" flexDirection="column" h="full">
      {/* Alertas flotantes (Errores, Éxito) */}
      <StatusModal
        {...statusModal}
        onClose={() => setStatusModal((prev) => ({ ...prev, open: false }))}
      />

      {/* Barra superior de filtrado y botón "Nuevo Rol" */}
      <RoleFilterBar
        search={filters.search}
        status={filters.status}
        onFilterChange={(newFilters) =>
          setFilters({ ...filters, ...newFilters })
        }
        onAddClick={() => openModal("create")}
      />

      {/* Tabla de Roles (Paginación delegada al backend) */}
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
      
      {/* Modal que muta visualmente dependiendo del modalMode (CRUD) */}
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
