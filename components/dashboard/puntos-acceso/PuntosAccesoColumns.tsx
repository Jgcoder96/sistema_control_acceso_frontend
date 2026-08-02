import React from "react";
import { HStack, Text, Badge, IconButton } from "@chakra-ui/react";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { PuntoAcceso } from "@/app/(dashboard)/sistema/puntos-de-acceso/types/PuntoAcceso";
import { ColumnConfig } from "@/components/dashboard/DataTable";

/**
 * Construye y devuelve la configuración de columnas para la tabla de Puntos de Acceso.
 * Permite inyectar acciones dinámicas desde la vista principal para orquestar la apertura de modales.
 * 
 * @param onEdit Acción disparada para abrir el formulario de edición.
 * @param onView Acción disparada para visualizar detalles.
 * @param onToggleDelete Acción disparada para eliminar lógicamente o restaurar el punto de acceso.
 */
export const getPuntosAccesoColumns = ({
  onView,
  onEdit,
  onToggleDelete,
}: {
  onView: (punto: PuntoAcceso) => void;
  onEdit: (punto: PuntoAcceso) => void;
  onToggleDelete: (punto: PuntoAcceso) => void;
}): ColumnConfig<PuntoAcceso>[] => [
  {
    key: "id",
    header: "ID",
    width: "120px",
    render: (item: PuntoAcceso) => (
      <Text fontSize="xs" color="gray.500" fontFamily="mono">
        {item.id.substring(0, 8)}...
      </Text>
    ),
  },
  {
    key: "nombre",
    header: "Nombre",
    width: "200px",
    render: (item: PuntoAcceso) => (
      <Text fontWeight="semibold" color="gray.800" fontSize="sm">
        {item.nombre}
      </Text>
    ),
  },
  {
    key: "mac",
    header: "Dirección MAC",
    width: "180px",
    render: (item: PuntoAcceso) => (
      <Text color="gray.600" fontSize="sm" fontFamily="mono">
        {item.mac}
      </Text>
    ),
  },
  {
    key: "ubicacion",
    header: "Ubicación",
    width: "200px",
    render: (item: PuntoAcceso) => (
      <Text color="gray.600" fontSize="sm">
        {item.ubicacion?.nombre || "Sin Asignar"}
      </Text>
    ),
  },
  {
    header: "Estado",
    width: "120px",
    textAlign: "center",
    render: (item: PuntoAcceso) => (
      <Badge
        colorPalette={!item.eliminado_el ? "green" : "red"}
        variant="subtle"
        borderRadius="full"
        px={3}
      >
        {!item.eliminado_el ? "Activo" : "Inactivo"}
      </Badge>
    ),
  },
  {
    header: "Acciones",
    width: "150px",
    textAlign: "center",
    render: (item: PuntoAcceso) => {
      const isDeleted = !!item.eliminado_el;
      return (
        <HStack gap={2} justify="center" onClick={(e) => e.stopPropagation()}>
          <IconButton
            aria-label="Ver detalles"
            size="sm"
            colorPalette="blue"
            variant="ghost"
            onClick={() => onView(item)}
          >
            <Eye size={16} />
          </IconButton>

          <IconButton
            aria-label="Editar"
            size="sm"
            colorPalette="orange"
            variant="ghost"
            disabled={isDeleted}
            onClick={() => onEdit(item)}
          >
            <Pencil size={16} />
          </IconButton>

          <IconButton
            aria-label="Eliminar"
            size="sm"
            colorPalette="red"
            variant="ghost"
            disabled={isDeleted}
            onClick={() => onToggleDelete(item)}
          >
            <Trash2 size={16} />
          </IconButton>
        </HStack>
      );
    },
  },
];
