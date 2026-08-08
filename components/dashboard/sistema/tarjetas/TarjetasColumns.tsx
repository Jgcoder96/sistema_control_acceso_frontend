import React from "react";
import { HStack, Badge, Text, Box, IconButton } from "@chakra-ui/react";
import {
  UserPlus,
  Trash2,
  Ban,
  RefreshCcw,
  ShieldAlert,
  ArrowLeftRight,
  Eye,
} from "lucide-react";
import {
  Tarjeta,
  TarjetaEstado,
} from "@/app/(dashboard)/sistema/tarjetas/types/Tarjeta";
import { ColumnConfig } from "@/components/dashboard/DataTable";

interface TarjetasColumnsProps {
  onDetail: (t: Tarjeta) => void;
  onAssign: (t: Tarjeta) => void;
  onBlock: (t: Tarjeta) => void;
  onReturn: (t: Tarjeta) => void;
  onReactivate: (t: Tarjeta) => void;
  onLost: (t: Tarjeta) => void;
  onDeleteToggle: (t: Tarjeta) => void;
}

/**
 * Constructor de configuración para la tabla de Tarjetas RFID.
 * Retorna la matriz de columnas inyectando las acciones delegadas a los botones (callbacks).
 */
export const getTarjetasColumns = ({
  onDetail,
  onAssign,
  onBlock,
  onReturn,
  onReactivate,
  onLost,
  onDeleteToggle,
}: TarjetasColumnsProps): ColumnConfig<Tarjeta>[] => [
  {
    header: "ID",
    key: "id",
    width: "10%",
    textAlign: "center",
    render: (item) => (
      <Text fontSize="sm" color="gray.500" truncate maxW="120px" mx="auto">
        {item.id.substring(0, 8)}...
      </Text>
    ),
  },
  {
    header: "Código RFID",
    key: "codigo",
    width: "20%",
    textAlign: "center",
    render: (item) => (
      <Text fontWeight="bold" color="gray.800" letterSpacing="wide">
        {item.codigo}
      </Text>
    ),
  },
  {
    header: "Usuario Asignado",
    width: "25%",
    textAlign: "center",
    render: (item) => {
      if (!item.usuario) {
        return (
          <Text fontSize="sm" color="gray.400" fontStyle="italic">
            Sin asignar
          </Text>
        );
      }
      return (
        <Box>
          <Text fontWeight="semibold" color="gray.800">
            {item.usuario.nombre} {item.usuario.apellido}
          </Text>
          <Text fontSize="xs" color="gray.500">
            C.I: {item.usuario.cedula}
          </Text>
        </Box>
      );
    },
  },
  {
    header: "Estado",
    key: "estado",
    width: "15%",
    textAlign: "center",
    render: (item) => {
      const getBadgeProps = (estado: TarjetaEstado) => {
        switch (estado) {
          case "activable":
            return { colorPalette: "cyan", label: "Activable" };
          case "activa":
            return { colorPalette: "green", label: "Activa" };
          case "bloqueada":
            return { colorPalette: "orange", label: "Bloqueada" };
          case "perdida":
            return { colorPalette: "red", label: "Perdida" };
          case "eliminada":
            return { colorPalette: "gray", label: "Eliminada" };
          default:
            return { colorPalette: "gray", label: estado };
        }
      };
      const { colorPalette, label } = getBadgeProps(item.estado);

      return (
        <Badge
          colorPalette={colorPalette}
          variant="subtle"
          px={3}
          py={1}
          borderRadius="full"
          fontSize="xs"
          textTransform="uppercase"
          fontWeight="bold"
        >
          {label}
        </Badge>
      );
    },
  },
  {
    header: "Acciones",
    width: "25%",
    textAlign: "center",
    render: (item) => {
      const isDeleted = !!item.eliminado_el;

      return (
        <HStack justify="center" gap={1} wrap="wrap">
          <IconButton
            size="sm"
            variant="ghost"
            colorPalette="blue"
            aria-label="Ver Detalles"
            onClick={() => onDetail(item)}
          >
            <Eye size={16} />
          </IconButton>

          {!isDeleted && (
            <>
              {item.estado === "activable" && (
                <IconButton
                  size="sm"
                  variant="ghost"
                  colorPalette="green"
                  aria-label="Asignar Usuario"
                  onClick={() => onAssign(item)}
                >
                  <UserPlus size={16} />
                </IconButton>
              )}

              {item.estado === "activa" && (
                <>
                  <IconButton
                    size="sm"
                    variant="ghost"
                    colorPalette="blue"
                    aria-label="Devolver Tarjeta"
                    onClick={() => onReturn(item)}
                  >
                    <ArrowLeftRight size={16} />
                  </IconButton>
                  <IconButton
                    size="sm"
                    variant="ghost"
                    colorPalette="orange"
                    aria-label="Bloquear Tarjeta"
                    onClick={() => onBlock(item)}
                  >
                    <Ban size={16} />
                  </IconButton>
                </>
              )}

              {item.estado === "bloqueada" && (
                <IconButton
                  size="sm"
                  variant="ghost"
                  colorPalette="green"
                  aria-label="Reactivar Tarjeta"
                  onClick={() => onReactivate(item)}
                >
                  <RefreshCcw size={16} />
                </IconButton>
              )}

              {(item.estado === "activa" || item.estado === "bloqueada") && (
                <IconButton
                  size="sm"
                  variant="ghost"
                  colorPalette="red"
                  aria-label="Reportar Perdida"
                  onClick={() => onLost(item)}
                >
                  <ShieldAlert size={16} />
                </IconButton>
              )}

              <IconButton
                size="sm"
                variant="ghost"
                colorPalette="red"
                aria-label="Eliminar"
                onClick={() => onDeleteToggle(item)}
              >
                <Trash2 size={16} />
              </IconButton>
            </>
          )}
        </HStack>
      );
    },
  },
];
