import React, { useState } from "react";
import { VStack, Text, Center, HStack, Badge, Box } from "@chakra-ui/react";
import { AlertTriangle, Trash2 } from "lucide-react";
import { BaseModal } from "@/components/dashboard/BaseModal";
import { Ubicacion } from "@/app/(dashboard)/sistema/ubicaciones/types/Ubicacion";

interface UbicacionDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  ubicacion: Ubicacion | null;
  onConfirm: (id: string) => Promise<boolean>;
}

/**
 * Modal de confirmación para eliminar o restaurar (soft delete) una Ubicación.
 * Destaca visualmente la acción destructiva para prevenir errores del usuario.
 */
export const UbicacionDeleteModal = ({
  isOpen,
  onClose,
  ubicacion,
  onConfirm,
}: UbicacionDeleteModalProps) => {
  const [loading, setLoading] = useState(false);

  if (!ubicacion) return null;
  const isDeleted = !!ubicacion.eliminado_el;

  const handleConfirm = async () => {
    setLoading(true);
    const success = await onConfirm(ubicacion.id);
    setLoading(false);
    if (success) {
      onClose();
    }
  };

  return (
    <BaseModal
      open={isOpen}
      onClose={onClose}
      title={isDeleted ? "Restaurar Ubicación" : "Eliminar Ubicación"}
      colorPalette={isDeleted ? "blue" : "red"}
      size="md"
      headerExtra={
        <HStack gap={4} align="center">
          <Box p={3} borderRadius="xl" bg="red.100" color="red.600">
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
              {isDeleted ? "Restaurar Ubicación" : "Eliminar Ubicación"}
            </Text>
            <Text
              fontSize="xl"
              fontWeight="bold"
              color="gray.800"
              lineHeight="1.2"
            >
              {ubicacion.nombre}
            </Text>
            <HStack gap={2} mt={1}>
              <Badge
                colorPalette={!ubicacion.eliminado_el ? "green" : "red"}
                variant="solid"
                borderRadius="full"
              >
                {!ubicacion.eliminado_el ? "activo" : "inactivo"}
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
              ? `¿Deseas restaurar "${ubicacion.nombre}"?`
              : `¿Deseas eliminar "${ubicacion.nombre}"?`}
          </Text>
        </VStack>
      </VStack>
    </BaseModal>
  );
};
