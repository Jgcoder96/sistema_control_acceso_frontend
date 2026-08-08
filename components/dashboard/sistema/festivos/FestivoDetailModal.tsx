import React from "react";
import {
  VStack,
  Grid,
  HStack,
  Text,
  Button,
  Badge,
  Box,
} from "@chakra-ui/react";
import { Calendar, Clock } from "lucide-react";
import { DetailItem } from "@/components";
import { BaseModal } from "@/components/dashboard/BaseModal";
import { Festivo } from "@/app/(dashboard)/sistema/festivos/types/Festivo";

interface FestivoDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  festivo: Festivo | null;
}

const meses = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

/**
 * Modal de sólo lectura (display-only) que presenta los detalles completos
 * de un Día Festivo, incluyendo descripciones y el estado actual de eliminación lógica.
 */
export const FestivoDetailModal = ({
  isOpen,
  onClose,
  festivo,
}: FestivoDetailModalProps) => {
  if (!festivo) return null;

  const formatDate = (dateStr?: string | null) => {
    return dateStr || "-";
  };

  const mesName = meses[festivo.mes - 1] || festivo.mes.toString();

  return (
    <BaseModal
      open={isOpen}
      onClose={onClose}
      title="Detalles del Feriado"
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
        <HStack gap={4} align="center">
          <VStack align="start" gap={1}>
            <Text
              fontSize="xs"
              fontWeight="bold"
              textTransform="uppercase"
              letterSpacing="wider"
              color="blue.600"
            >
              Información del Feriado
            </Text>
            <Text
              fontSize="2xl"
              fontWeight="bold"
              color="gray.850"
              lineHeight="1.2"
            >
              {festivo.nombre}
            </Text>
            <HStack gap={2} mt={1}>
              <Badge
                colorPalette={!festivo.eliminado_el ? "green" : "red"}
                variant="solid"
                borderRadius="full"
              >
                {!festivo.eliminado_el ? "activo" : "inactivo"}
              </Badge>
              <Badge
                colorPalette="gray"
                variant="subtle"
                borderRadius="full"
                textTransform="none"
              >
                <Text as="span" display={{ base: "none", sm: "inline" }}>
                  ID: {festivo.id}
                </Text>
                <Text as="span" display={{ base: "inline", sm: "none" }}>
                  ID: {festivo.id.substring(0, 8)}...
                </Text>
              </Badge>
            </HStack>
          </VStack>
        </HStack>
      }
      bodyScroll={false}
    >
      <VStack align="start" gap={6} w="full" flex="1" minH="0" pt={2}>
        <Grid
          templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
          gap={6}
          w="full"
          flexShrink={0}
        >
          <DetailItem
            icon={<Calendar size={18} />}
            label="Registro"
            value={formatDate(festivo.creado_el)}
          />
          <DetailItem
            icon={<Clock size={18} />}
            label="Última Act."
            value={formatDate(festivo.actualizado_el)}
          />
        </Grid>

        <Box
          w="full"
          borderTopWidth="1px"
          borderColor="gray.200"
          pt={4}
          display="flex"
          flexDirection="column"
          flex="1"
          minH="0"
        >
          <Text
            fontSize="sm"
            fontWeight="bold"
            color="gray.700"
            mb={4}
            flexShrink={0}
          >
            Fecha Exacta
          </Text>
          <VStack align="stretch" gap={3} flex="1" minH="0">
            <HStack
              p={3}
              bg="gray.50"
              borderRadius="md"
              borderWidth="1px"
              borderColor="gray.200"
              justify="flex-start"
            >
              <HStack gap={3}>
                <Badge
                  colorPalette="blue"
                  variant="subtle"
                  px={2}
                  py={1}
                  borderRadius="md"
                  w="50px"
                  textAlign="center"
                >
                  {festivo.dia}
                </Badge>
                <Badge
                  colorPalette="blue"
                  variant="subtle"
                  px={2}
                  py={1}
                  borderRadius="md"
                  w="100px"
                  textAlign="center"
                >
                  {mesName}
                </Badge>
                <Badge
                  colorPalette={festivo.anio ? "blue" : "purple"}
                  variant="subtle"
                  px={2}
                  py={1}
                  borderRadius="md"
                  w="90px"
                  textAlign="center"
                >
                  {festivo.anio ? festivo.anio : "Anual"}
                </Badge>
              </HStack>
            </HStack>
          </VStack>
        </Box>
      </VStack>
    </BaseModal>
  );
};
