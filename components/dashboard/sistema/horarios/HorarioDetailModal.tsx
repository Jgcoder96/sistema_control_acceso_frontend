import React from "react";
import { VStack, Grid, HStack, Text, Button, Badge, Box } from "@chakra-ui/react";
import { Calendar, Clock, CheckCircle2, XCircle } from "lucide-react";
import { DetailItem } from "@/components";
import { BaseModal } from "@/components/dashboard/BaseModal";
import { Horario } from "@/app/(dashboard)/sistema/horarios/types/Horario";

interface HorarioDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  horario: Horario | null;
}

/**
 * Modal de sólo lectura para previsualizar todos los detalles de un Horario.
 * Muestra las fechas de registro, el estado actual, y desglosa en una lista 
 * scrollable cada una de las configuraciones de días y rangos horarios asociados.
 */
export const HorarioDetailModal = ({ isOpen, onClose, horario }: HorarioDetailModalProps) => {
  if (!horario) return null;

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
      title="Detalles del Horario"
      colorPalette="blue"
      size="xl"
      customFooter={
        <HStack justify="end" w="full">
          <Button colorPalette="blue" borderRadius="full" onClick={onClose} px={8}>
            Cerrar
          </Button>
        </HStack>
      }
      headerExtra={
        <HStack gap={4} align="center">
          <VStack align="start" gap={1}>
            <Text fontSize="xs" fontWeight="bold" textTransform="uppercase" letterSpacing="wider" color="blue.600">
              Información del Horario
            </Text>
            <Text fontSize="2xl" fontWeight="bold" color="gray.850" lineHeight="1.2">
              {horario.nombre}
            </Text>
            <HStack gap={2} mt={1}>
              <Badge colorPalette={!horario.eliminado_el ? "green" : "red"} variant="solid" borderRadius="full">
                {!horario.eliminado_el ? "activo" : "inactivo"}
              </Badge>
              <Badge colorPalette="gray" variant="subtle" borderRadius="full" textTransform="none">
                <Text as="span" display={{ base: "none", sm: "inline" }}>
                  ID: {horario.id}
                </Text>
                <Text as="span" display={{ base: "inline", sm: "none" }}>
                  ID: {horario.id.substring(0, 8)}...
                </Text>
              </Badge>
            </HStack>
          </VStack>
        </HStack>
      }
      bodyScroll={false}
    >
      <VStack align="start" gap={6} w="full" flex="1" minH="0" pt={2}>
        <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6} w="full" flexShrink={0}>
          <DetailItem icon={<Calendar size={18} />} label="Registro" value={formatDate(horario.creado_el)} />
          <DetailItem icon={<Clock size={18} />} label="Última Act." value={formatDate(horario.actualizado_el)} />
        </Grid>

        <Box w="full" borderTopWidth="1px" borderColor="gray.200" pt={4} display="flex" flexDirection="column" flex="1" minH="0">
          <Text fontSize="sm" fontWeight="bold" color="gray.700" mb={4} flexShrink={0}>
            Detalles por Día
          </Text>
          <VStack
            align="stretch"
            gap={3}
            flex="1"
            minH="0"
            overflowY="auto"
            pr={2}
            css={{
              "&::-webkit-scrollbar": { width: "6px" },
              "&::-webkit-scrollbar-track": { background: "transparent" },
              "&::-webkit-scrollbar-thumb": { background: "#CBD5E1", borderRadius: "10px" },
            }}
          >
            {horario.horario_detalles.map((det) => (
              <HStack
                key={det.id}
                p={3}
                bg="gray.50"
                borderRadius="md"
                borderWidth="1px"
                borderColor="gray.200"
                justify="space-between"
              >
                <HStack gap={3}>
                  <Badge colorPalette="blue" variant="subtle" px={2} py={1} borderRadius="md" w="90px" textAlign="center">
                    {det.dia_semana || "Festivo"}
                  </Badge>
                  <HStack gap={1} color="gray.600" fontSize="sm">
                    <Clock size={14} />
                    <Text>
                      {det.hora_inicio} - {det.hora_fin}
                    </Text>
                  </HStack>
                </HStack>
                {det.es_festivo ? (
                  <HStack gap={1} color="orange.500" fontSize="xs" fontWeight="semibold">
                    <CheckCircle2 size={14} /> <Text>Aplica a Festivos</Text>
                  </HStack>
                ) : (
                  <HStack gap={1} color="gray.400" fontSize="xs">
                    <XCircle size={14} /> <Text>No Festivo</Text>
                  </HStack>
                )}
              </HStack>
            ))}
            {horario.horario_detalles.length === 0 && (
              <Text fontSize="sm" color="gray.500" fontStyle="italic">
                No hay días configurados.
              </Text>
            )}
          </VStack>
        </Box>
      </VStack>
    </BaseModal>
  );
};
