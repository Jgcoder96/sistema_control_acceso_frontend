import React from "react";
import { HStack, Text, Badge, IconButton } from "@chakra-ui/react";
import { Eye, Trash2 } from "lucide-react";
import { Permission } from "@/app/(dashboard)/accesos/permisos/types/Permission";
import { ColumnConfig } from "@/components/dashboard/DataTable";

/**
 * Construye y devuelve la configuración de columnas para la tabla de Permisos.
 * Permite inyectar las acciones dinámicas (Ver y Eliminar) desde la vista principal.
 * 
 * @param onView Acción disparada al hacer clic en el botón de visualizar.
 * @param onDelete Acción disparada al hacer clic en el botón de eliminar.
 */
export const getPermissionColumns = (
  onView: (perm: Permission) => void,
  onDelete: (perm: Permission) => void
): ColumnConfig<Permission>[] => [
  {
    key: "id",
    header: "ID",
    render: (item: Permission) => (
      <Text fontSize="xs" color="gray.500" fontFamily="mono">
        {item.id.substring(0, 8)}...
      </Text>
    ),
  },
  {
    key: "slug",
    header: "Slug",
    render: (item: Permission) => (
      <Text fontWeight="semibold" color="gray.800" fontSize="sm">
        {item.slug}
      </Text>
    ),
  },
  {
    key: "descripcion",
    header: "Descripción",
    render: (item: Permission) => (
      <Text
        color="gray.600"
        fontSize="sm"
        maxW="250px"
        // Truncado de texto nativo compatible con todas las versiones de Chakra/React
        whiteSpace="nowrap"
        overflow="hidden"
        textOverflow="ellipsis"
      >
        {item.descripcion || "Sin descripción"}
      </Text>
    ),
  },
  {
    header: "Estado",
    render: (item: Permission) => (
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
    render: (item: Permission) => (
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
          aria-label="Eliminar"
          size="sm"
          colorPalette="red"
          variant="ghost"
          disabled={!!item.eliminado_el}
          onClick={() => onDelete(item)}
        >
          <Trash2 size={16} />
        </IconButton>
      </HStack>
    ),
  },
];
