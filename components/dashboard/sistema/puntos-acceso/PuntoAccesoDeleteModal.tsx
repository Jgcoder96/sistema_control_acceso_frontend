import React, { useState } from "react";
import { VStack, Text, HStack, Badge, Center, Box } from "@chakra-ui/react";
import { AlertTriangle, Trash2 } from "lucide-react";
import { BaseModal } from "@/components/dashboard/BaseModal";
import { PuntoAcceso } from "@/app/(dashboard)/sistema/puntos-de-acceso/types/PuntoAcceso";

interface PuntoAccesoDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  punto: PuntoAcceso | null;
  onConfirm: (id: string) => Promise<boolean>;
}

/**
 * Modal de confirmación para eliminar o restaurar (soft delete) un Punto de Acceso.
 * Destaca visualmente la acción destructiva para prevenir errores del usuario.
 */
export const PuntoAccesoDeleteModal = ({
  isOpen,
  onClose,
  punto,
  onConfirm,
}: PuntoAccesoDeleteModalProps) => {
  const [loading, setLoading] = useState(false);

  if (!punto) return null;
  const isDeleted = !!punto.eliminado_el;

  const handleConfirm = async () => {
    setLoading(true);
    const success = await onConfirm(punto.id);
    setLoading(false);
    if (success) {
      onClose();
    }
  };

  return (
    <BaseModal
      open={isOpen}
      onClose={onClose}
      title={
        isDeleted ? "Restaurar Punto de Acceso" : "Eliminar Punto de Acceso"
      }
      colorPalette={isDeleted ? "blue" : "red"}
      size="md"
      headerExtra={
        <HStack gap={4} align="center">
          <Box
            p={3}
            borderRadius="xl"
            bg={isDeleted ? "blue.100" : "red.100"}
            color={isDeleted ? "blue.600" : "red.600"}
          >
            <Trash2 size={20} />
          </Box>
          <VStack align="start" gap={1}>
            <Text
              fontSize="xs"
              fontWeight="bold"
              textTransform="uppercase"
              letterSpacing="wider"
              color={isDeleted ? "blue.600" : "red.600"}
            >
              {isDeleted ? "Restaurar Dispositivo" : "Eliminar Dispositivo"}
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
                colorPalette={!isDeleted ? "green" : "red"}
                variant="solid"
                borderRadius="full"
              >
                {!isDeleted ? "activo" : "inactivo"}
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
      onConfirm={handleConfirm}
      confirmText="Confirmar"
      cancelText="Cancelar"
      confirmLoading={loading}
    >
      <VStack align="center" gap={4} py={4}>
        <Center
          w="16"
          h="16"
          bg={isDeleted ? "blue.50" : "red.50"}
          borderRadius="full"
          color={isDeleted ? "blue.500" : "red.500"}
        >
          <AlertTriangle size={32} />
        </Center>

        <VStack gap={1} textAlign="center">
          <Text fontSize="lg" fontWeight="bold" color="gray.800">
            {isDeleted
              ? `¿Deseas restaurar "${punto.nombre}"?`
              : `¿Deseas eliminar "${punto.nombre}"?`}
          </Text>
        </VStack>
      </VStack>
    </BaseModal>
  );
};
