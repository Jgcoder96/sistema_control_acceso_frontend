import React from "react";
import { HStack, IconButton, Badge, Text } from "@chakra-ui/react";
import { Pencil, Eye, Trash2 } from "lucide-react";
import { ColumnConfig } from "@/components/dashboard/DataTable";
import { Ubicacion } from "@/app/(dashboard)/sistema/ubicaciones/types/Ubicacion";

interface UbicacionesColumnsProps {
  onView: (ubicacion: Ubicacion) => void;
  onEdit: (ubicacion: Ubicacion) => void;
  onToggleDelete: (ubicacion: Ubicacion) => void;
}

/**
 * Construye y devuelve la configuración de columnas para la tabla de Ubicaciones.
 * Permite inyectar acciones dinámicas desde la vista principal para orquestar la apertura de modales.
 *
 * @param onEdit Acción disparada para abrir el formulario de edición.
 * @param onView Acción disparada para visualizar detalles.
 * @param onToggleDelete Acción disparada para eliminar lógicamente o restaurar la ubicación.
 */
export const getUbicacionesColumns = ({
  onView,
  onEdit,
  onToggleDelete,
}: UbicacionesColumnsProps): ColumnConfig<Ubicacion>[] => [
  {
    header: "ID",
    key: "id",
    width: "15%",
    textAlign: "center",
    render: (item) => (
      <Text
        fontSize="xs"
        color="gray.500"
        truncate
        maxW="120px"
        textAlign="center"
        mx="auto"
      >
        {item.id}
      </Text>
    ),
  },
  {
    header: "Nombre",
    key: "nombre",
    width: "20%",
    textAlign: "center",
    render: (item) => (
      <Text fontWeight="semibold" color="gray.800" fontSize="sm">
        {item.nombre}
      </Text>
    ),
  },
  {
    header: "Mesh ID (MAC)",
    key: "mesh_id",
    width: "20%",
    textAlign: "center",
  },
  {
    header: "Estado",
    width: "15%",
    textAlign: "center",
    render: (item) => {
      const isDeleted = !!item.eliminado_el;
      return (
        <Badge
          colorPalette={isDeleted ? "red" : "green"}
          variant="subtle"
          borderRadius="full"
          px={3}
          py={1}
          fontSize="xs"
          textTransform="uppercase"
        >
          {isDeleted ? "Eliminado" : "Activo"}
        </Badge>
      );
    },
  },
  {
    header: "Acciones",
    width: "15%",
    textAlign: "center",
    render: (item) => {
      const isDeleted = !!item.eliminado_el;
      return (
        <HStack justify="center" gap={1}>
          <IconButton
            size="sm"
            variant="ghost"
            colorPalette="blue"
            aria-label="Ver detalles"
            onClick={() => onView(item)}
          >
            <Eye size={16} />
          </IconButton>

          <IconButton
            size="sm"
            variant="ghost"
            colorPalette="orange"
            disabled={isDeleted}
            aria-label="Editar"
            onClick={() => onEdit(item)}
          >
            <Pencil size={16} />
          </IconButton>

          <IconButton
            size="sm"
            variant="ghost"
            colorPalette="red"
            disabled={isDeleted}
            aria-label="Eliminar"
            onClick={() => onToggleDelete(item)}
          >
            <Trash2 size={16} />
          </IconButton>
        </HStack>
      );
    },
  },
];
