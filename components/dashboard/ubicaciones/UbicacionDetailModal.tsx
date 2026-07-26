import React from "react";
import { VStack, Grid, HStack, Text, Button, Badge } from "@chakra-ui/react";
import { Eye, MapPin, Calendar, CheckCircle2, XCircle, Router } from "lucide-react";
import { BaseModal } from "@/components/dashboard/BaseModal";
import { DetailItem } from "@/components";
import { Ubicacion } from "@/app/(dashboard)/sistema/ubicaciones/types/Ubicacion";

interface UbicacionDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  ubicacion: Ubicacion | null;
}

/**
 * Modal de sólo lectura para mostrar los detalles completos de una Ubicación.
 * Presenta la información de forma estructurada con insignias de estado y un diseño unificado.
 */
export const UbicacionDetailModal = ({ isOpen, onClose, ubicacion }: UbicacionDetailModalProps) => {
  if (!ubicacion) return null;

  const isDeleted = !!ubicacion.eliminado_el;

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <BaseModal
      open={isOpen}
      onClose={onClose}
      title="Detalles de Ubicación"
      colorPalette="blue"
      size="md"
      headerExtra={
        <HStack
          gap={{ base: 4, sm: 6 }}
          align="center"
          flexDirection={{ base: "column", sm: "row" }}
          textAlign={{ base: "center", sm: "left" }}
        >
          <VStack align={{ base: "center", sm: "start" }} gap={1}>
            <Text
              fontSize="xs"
              fontWeight="bold"
              textTransform="uppercase"
              letterSpacing="wider"
              color="blue.600"
            >
              Detalles de Ubicación
            </Text>
            <Text
              fontSize="2xl"
              fontWeight="bold"
              color="gray.850"
              lineHeight="1.2"
            >
              {ubicacion.nombre}
            </Text>
            <HStack gap={2} mt={1}>
              <Badge
                colorPalette={isDeleted ? "red" : "green"}
                variant="solid"
                borderRadius="full"
              >
                {isDeleted ? "inactivo" : "activo"}
              </Badge>
              <Badge
                colorPalette="gray"
                variant="subtle"
                borderRadius="full"
                textTransform="none"
              >
                <Text as="span" display={{ base: "none", sm: "inline" }}>
                  ID: {ubicacion.id}
                </Text>
                <Text as="span" display={{ base: "inline", sm: "none" }}>
                  ID: {ubicacion.id.substring(0, 8)}...
                </Text>
              </Badge>
            </HStack>
          </VStack>
        </HStack>
      }
      customFooter={
        <HStack justify="end" w="full">
          <Button colorPalette="blue" borderRadius="full" onClick={onClose} px={8}>
            Cerrar
          </Button>
        </HStack>
      }
    >
      <VStack align="start" gap={6} w="full" h="full" overflow="hidden" pt={2}>
        <Grid
          templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
          gap={6}
          w="full"
        >
          <DetailItem
            icon={<MapPin size={18} />}
            label="Nombre de Ubicación"
            value={ubicacion.nombre}
          />
          <DetailItem
            icon={<Router size={18} />}
            label="Red Mesh (MAC)"
            value={ubicacion.mesh_id}
          />
          <DetailItem
            icon={<Calendar size={18} />}
            label="Registro"
            value={formatDate(ubicacion.creado_el)}
          />
          <DetailItem
            icon={<Calendar size={18} />}
            label="Última Act."
            value={formatDate(ubicacion.actualizado_el)}
          />
        </Grid>
      </VStack>
    </BaseModal>
  );
};
