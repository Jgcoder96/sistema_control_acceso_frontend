import { HStack, Badge, IconButton, Text } from "@chakra-ui/react";
import { Edit2, Trash2, Eye } from "lucide-react";
import { Festivo } from "@/app/(dashboard)/sistema/festivos/types/Festivo";
import { ColumnConfig } from "@/components/dashboard/DataTable";

interface FestivosColumnsProps {
  onDetail: (f: Festivo) => void;
  onEdit: (f: Festivo) => void;
  onDeleteToggle: (f: Festivo) => void;
}

const meses = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

export const getFestivosColumns = ({
  onDetail,
  onEdit,
  onDeleteToggle,
}: FestivosColumnsProps): ColumnConfig<Festivo>[] => [
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
    width: "35%",
    textAlign: "center",
    render: (item) => (
      <Text fontWeight="semibold" color="gray.850">
        {item.nombre}
      </Text>
    ),
  },
  {
    header: "Fecha",
    width: "20%",
    textAlign: "center",
    render: (item) => {
      const mes = meses[item.mes - 1] || item.mes;
      return (
        <Text fontSize="sm" color="gray.600" fontWeight="medium">
          {item.dia} de {mes}{item.anio ? ` de ${item.anio}` : " (Anual)"}
        </Text>
      );
    },
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
            aria-label="Ver Detalles"
            onClick={() => onDetail(item)}
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
