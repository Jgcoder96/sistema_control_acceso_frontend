import React from "react";
import { HStack, Text, Badge, IconButton } from "@chakra-ui/react";
import { Eye, Trash2 } from "lucide-react";
import { Permission } from "@/app/(dashboard)/accesos/permisos/types/Permission";

export const getPermissionColumns = (
  onView: (perm: Permission) => void,
  onDelete: (perm: Permission) => void
) => [
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
      <Text color="gray.600" fontSize="sm" noOfLines={1} maxW="250px">
        {item.descripcion || "Sin descripción"}
      </Text>
    ),
  },
  {
    key: "estado",
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
    key: "acciones",
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
        {!item.eliminado_el && (
          <IconButton
            aria-label="Eliminar"
            size="sm"
            colorPalette="red"
            variant="ghost"
            onClick={() => onDelete(item)}
          >
            <Trash2 size={16} />
          </IconButton>
        )}
      </HStack>
    ),
  },
];
