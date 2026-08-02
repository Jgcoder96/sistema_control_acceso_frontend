import React from "react";
import { VStack, Grid, HStack, Text, Button, Badge } from "@chakra-ui/react";
import { Router, MapPin, Calendar, Clock } from "lucide-react";
import { DetailItem } from "@/components";
import { BaseModal } from "@/components/dashboard/BaseModal";
import { PuntoAcceso } from "@/app/(dashboard)/sistema/puntos-de-acceso/types/PuntoAcceso";

interface PuntoAccesoDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  punto: PuntoAcceso | null;
}

/**
 * Modal de sólo lectura para mostrar los detalles completos de un Punto de Acceso.
 * Presenta la información de forma estructurada con insignias de estado y un diseño unificado.
 */
export const PuntoAccesoDetailModal = ({
  isOpen,
  onClose,
  punto,
}: PuntoAccesoDetailModalProps) => {
  if (!punto) return null;

  const formatDate = (dateStr?: string | null) => {
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
      title="Detalles del Punto de Acceso"
      colorPalette="blue"
      size="md"
      customFooter={
        <HStack justify="end" w="full">
          <Button
            colorPalette="blue"
            borderRadius="full"
            onClick={onClose}
            px={8}
          >
            Cerrar
          </Button>
        </HStack>
      }
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
              Detalles del Dispositivo
            </Text>
            <Text
              fontSize="2xl"
              fontWeight="bold"
              color="gray.850"
              lineHeight="1.2"
            >
              {punto.nombre}
            </Text>
            <HStack gap={2} mt={1}>
              <Badge
                colorPalette={!punto.eliminado_el ? "green" : "red"}
                variant="solid"
                borderRadius="full"
              >
                {!punto.eliminado_el ? "activo" : "inactivo"}
              </Badge>
              <Badge
                colorPalette="gray"
                variant="subtle"
                borderRadius="full"
                textTransform="none"
              >
                <Text as="span" display={{ base: "none", sm: "inline" }}>
                  ID: {punto.id}
                </Text>
                <Text as="span" display={{ base: "inline", sm: "none" }}>
                  ID: {punto.id.substring(0, 8)}...
                </Text>
              </Badge>
            </HStack>
          </VStack>
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
            icon={<Router size={18} />}
            label="Dirección MAC"
            value={punto.mac}
          />
          <DetailItem
            icon={<MapPin size={18} />}
            label="Ubicación Asignada"
            value={punto.ubicacion?.nombre || "Sin Asignar"}
          />
          <DetailItem
            icon={<Calendar size={18} />}
            label="Registro"
            value={formatDate(punto.creado_el)}
          />
          <DetailItem
            icon={<Clock size={18} />}
            label="Última Act."
            value={formatDate(punto.actualizado_el)}
          />
        </Grid>
      </VStack>
    </BaseModal>
  );
};
