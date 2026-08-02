import { HStack, Badge, IconButton, Text } from "@chakra-ui/react";
import { Edit2, Eye, Trash2 } from "lucide-react";
import { Horario } from "@/app/(dashboard)/sistema/horarios/types/Horario";
import { ColumnConfig } from "@/components/dashboard/DataTable";

interface HorariosColumnsProps {
  onEdit: (h: Horario) => void;
  onView: (h: Horario) => void;
  onDeleteToggle: (h: Horario) => void;
}

/**
 * Define las columnas para la tabla de Horarios (DataTable).
 * Configura la representación visual de cada celda y provee los botones
 * de acción asociados (Ver, Editar, Eliminar/Restaurar) con sus respectivos callbacks.
 */
export const getHorariosColumns = ({
  onEdit,
  onView,
  onDeleteToggle,
}: HorariosColumnsProps): ColumnConfig<Horario>[] => [
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
    header: "Nombre",
    key: "nombre",
    width: "30%",
    textAlign: "center",
    render: (item) => (
      <Text fontWeight="semibold" color="gray.850">
        {item.nombre}
      </Text>
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
          colorPalette={!isDeleted ? "green" : "red"}
          variant="subtle"
          px={3}
          py={1}
          borderRadius="full"
          fontSize="xs"
          textTransform="uppercase"
          letterSpacing="wide"
          fontWeight="bold"
        >
          {!isDeleted ? "Activo" : "Inactivo"}
        </Badge>
      );
    },
  },
  {
    header: "Acciones",
    width: "20%",
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
            <Edit2 size={16} />
          </IconButton>

          <IconButton
            size="sm"
            variant="ghost"
            colorPalette="red"
            disabled={isDeleted}
            aria-label="Eliminar"
            onClick={() => onDeleteToggle(item)}
          >
            <Trash2 size={16} />
          </IconButton>
        </HStack>
      );
    },
  },
];
