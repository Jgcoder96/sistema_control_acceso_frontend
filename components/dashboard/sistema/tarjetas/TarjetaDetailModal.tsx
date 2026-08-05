import React from "react";
import { VStack, Grid, HStack, Text, Button, Badge, Box } from "@chakra-ui/react";
import {  Calendar, User, ShieldCheck, Eye } from "lucide-react";
import { BaseModal } from "@/components/dashboard/BaseModal";
import { Tarjeta, TarjetaEstado } from "@/app/(dashboard)/sistema/tarjetas/types/Tarjeta";

interface TarjetaDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  tarjeta: Tarjeta | null;
}

export const TarjetaDetailModal = ({
  isOpen,
  onClose,
  tarjeta,
}: TarjetaDetailModalProps) => {
  if (!tarjeta) return null;
  const isDeleted = !!tarjeta.eliminado_el;

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

  const getBadgeColor = (estado: TarjetaEstado) => {
    switch (estado) {
      case "activable": return "cyan";
      case "activa": return "green";
      case "bloqueada": return "orange";
      case "perdida": return "red";
      case "eliminada": return "gray";
      default: return "gray";
    }
  };

  return (
    <BaseModal
      open={isOpen}
      onClose={onClose}
      title="Detalles de la Tarjeta"
      colorPalette="blue"
      size="md"
      bodyScroll={false}
      customFooter={
        <HStack justify="end" w="full">
          <Button colorPalette="blue" borderRadius="full" onClick={onClose} px={8}>
            Cerrar
          </Button>
        </HStack>
      }
      headerExtra={
        <HStack gap={4} align="center">
          <Box p={3} borderRadius="xl" bg="blue.100" color="blue.600" flexShrink={0}>
            <Eye size={24} />
          </Box>
          <VStack align="start" gap={1}>
            <Text fontSize="xs" fontWeight="bold" textTransform="uppercase" letterSpacing="wider" color="blue.600">
              Tarjeta RFID
            </Text>
            <Text fontSize="2xl" fontWeight="bold" color="gray.850" lineHeight="1.2">
              {tarjeta.codigo}
            </Text>
            <HStack gap={2} mt={1} wrap="wrap">
              <Badge colorPalette={isDeleted ? "gray" : getBadgeColor(tarjeta.estado)} variant="solid" borderRadius="full" textTransform="uppercase">
                {isDeleted ? "eliminada" : tarjeta.estado}
              </Badge>
              <Badge colorPalette="gray" variant="subtle" borderRadius="full" textTransform="none">
                ID: {tarjeta.id}
              </Badge>
            </HStack>
          </VStack>
        </HStack>
      }
    >
      <VStack align="stretch" gap={5} w="full" pt={4} pb={4} flex="1" minH="0">
        
        {/* Box superior con 2 columnas: Usuario y Fechas */}
        <Box w="full" p={4} borderWidth="1px" borderColor="gray.100" borderRadius="lg" bg="gray.50">
          <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4}>
            {/* Usuario */}
            <VStack align="start" gap={2}>
              <Text fontWeight="bold" fontSize="xs" color="gray.500" textTransform="uppercase">
                Asignación Actual
              </Text>
              {tarjeta.usuario ? (
                <HStack gap={3}>
                  <Box p={2} bg="white" borderRadius="full" shadow="sm">
                    <User size={18} color="#4A5568" />
                  </Box>
                  <VStack align="start" gap={0}>
                    <Text fontWeight="semibold" color="gray.800" fontSize="sm">
                      {tarjeta.usuario.nombre} {tarjeta.usuario.apellido}
                    </Text>
                    <Text fontSize="xs" color="gray.500">C.I: {tarjeta.usuario.cedula}</Text>
                  </VStack>
                </HStack>
              ) : (
                <Text color="gray.500" fontSize="sm" fontStyle="italic">Sin usuario asignado.</Text>
              )}
            </VStack>

            {/* Fechas */}
            <VStack align="start" gap={2}>
              <Text fontWeight="bold" fontSize="xs" color="gray.500" textTransform="uppercase">
                Tiempos
              </Text>
              <VStack align="start" gap={1}>
                <HStack fontSize="xs" color="gray.600">
                  <Calendar size={12} />
                  <Text><strong>Registro:</strong> {formatDate(tarjeta.creado_el)}</Text>
                </HStack>
                {tarjeta.asignada_el && (
                  <HStack fontSize="xs" color="gray.600">
                    <ShieldCheck size={12} />
                    <Text><strong>Asignada:</strong> {formatDate(tarjeta.asignada_el)}</Text>
                  </HStack>
                )}
              </VStack>
            </VStack>
          </Grid>
        </Box>

        {/* Historial */}
        <Box w="full" flex="1" display="flex" flexDirection="column" overflow="hidden">
           <Text fontWeight="bold" fontSize="sm" color="gray.700" mb={3}>Historial de Eventos</Text>
           {tarjeta.historial_asignaciones && tarjeta.historial_asignaciones.length > 0 ? (
             <VStack align="stretch" gap={2} flex="1" overflowY="auto" pr={2} className="custom-scrollbar">
               {tarjeta.historial_asignaciones.map((hist) => (
                 <HStack key={hist.id} p={3} bg="white" borderWidth="1px" borderColor="gray.100" borderRadius="md" justify="space-between">
                   <VStack align="start" gap={0}>
                      <Badge colorPalette="blue" variant="subtle" size="sm">{hist.accion}</Badge>
                      <Text fontSize="xs" color="gray.500" mt={1}>{formatDate(hist.fecha)}</Text>
                   </VStack>
                   <Text fontSize="sm" fontWeight="medium" color="gray.700" textAlign="right">
                     {hist.usuario.nombre} {hist.usuario.apellido}
                     <br/>
                     <Text as="span" fontSize="xs" color="gray.400">{hist.usuario.cedula}</Text>
                   </Text>
                 </HStack>
               ))}
             </VStack>
           ) : (
             <Text fontSize="sm" color="gray.500" fontStyle="italic" textAlign="center" py={4}>
               No hay eventos registrados.
             </Text>
           )}
        </Box>
      </VStack>
    </BaseModal>
  );
};
