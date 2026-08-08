import React from "react";
import { Badge, HStack, Box, Text, VStack, IconButton } from "@chakra-ui/react";
import { Trash2 } from "lucide-react";
import { PermisoFisico } from "@/app/(dashboard)/sistema/permisos/types/PermisoFisico";
import { ColumnConfig } from "@/components/dashboard/DataTable";

interface PermisoColumnsProps {
  onDeleteToggle: (permiso: PermisoFisico) => void;
}

/**
 * Generador de configuración de columnas para la tabla de Permisos Físicos.
 * Define la estructura visual y lógica de renderizado para cada celda de la tabla.
 * @param onDeleteToggle - Función ejecutada al accionar el botón de eliminar.
 * @returns Array de configuración compatible con DataTable.
 */
export const getPermisosColumns = ({
  onDeleteToggle,
}: PermisoColumnsProps): ColumnConfig<PermisoFisico>[] => [
  {
    header: "ID",
    key: "id",
    width: "15%",
    textAlign: "center",
    render: (item) => (
      <Text fontSize="sm" color="gray.500" truncate maxW="120px" mx="auto">
        {item.id.substring(0, 8)}...
      </Text>
    ),
  },
  {
    header: "Usuario",
    width: "25%",
    textAlign: "center",
    render: (item) => (
      <VStack align="center" gap={0}>
        <Text fontWeight="semibold" fontSize="sm" color="gray.800">
          {item.usuario}
        </Text>
        <Text fontSize="xs" color="gray.500">
          CI: {item.cedula}
        </Text>
      </VStack>
    ),
  },
  {
    header: "Punto de Acceso",
    width: "20%",
    textAlign: "center",
    render: (item) => (
      <VStack align="center" gap={0}>
        <Text fontWeight="medium" fontSize="sm" color="gray.700">
          {item.punto_acceso}
        </Text>
        {item.ubicacion && (
          <Text fontSize="xs" color="gray.500">
            {item.ubicacion}
          </Text>
        )}
      </VStack>
    ),
  },
  {
    header: "Horario",
    width: "15%",
    textAlign: "center",
    render: (item) => (
      <Badge
        colorPalette="purple"
        variant="subtle"
        borderRadius="full"
        px={2}
        py={0.5}
        textTransform="none"
      >
        {item.horario || "Sin horario"}
      </Badge>
    ),
  },
  {
    header: "Estado",
    width: "15%",
    textAlign: "center",
    render: (item) => {
      const isDeleted = !!item.eliminado_el;
      return (
        <Badge
          colorPalette={isDeleted ? "gray" : "green"}
          variant="solid"
          borderRadius="full"
        >
          {isDeleted ? "ELIMINADO" : "ACTIVO"}
        </Badge>
      );
    },
  },
  {
    header: "Acciones",
    width: "10%",
    textAlign: "center",
    render: (item) => {
      const isDeleted = !!item.eliminado_el;

      return (
        <HStack justify="center" gap={2} onClick={(e) => e.stopPropagation()}>
          {!isDeleted && (
            <IconButton
              size="sm"
              variant="ghost"
              colorPalette="red"
              aria-label="Revocar Permiso"
              onClick={() => onDeleteToggle(item)}
            >
              <Trash2 size={16} />
            </IconButton>
          )}
        </HStack>
      );
    },
  },
];
