import React, { useState } from "react";
import { VStack, Text, Center, HStack, Badge, Box } from "@chakra-ui/react";
import { AlertTriangle, Trash2 } from "lucide-react";
import { BaseModal } from "@/components/dashboard/BaseModal";
import { Horario } from "@/app/(dashboard)/sistema/horarios/types/Horario";

interface HorarioDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  horario: Horario | null;
  onConfirm: (id: string, currentlyDeleted: boolean) => Promise<boolean>;
}

/**
 * Modal de confirmación para eliminar (soft-delete) o restaurar un horario existente.
 * Muestra información relevante del horario para asegurar al usuario la acción que va a realizar.
 */
export const HorarioDeleteModal = ({
  isOpen,
  onClose,
  horario,
  onConfirm,
}: HorarioDeleteModalProps) => {
  const [loading, setLoading] = useState(false);

  if (!horario) return null;
  const isDeleted = !!horario.eliminado_el;

  const handleConfirm = async () => {
    setLoading(true);
    const success = await onConfirm(horario.id, isDeleted);
    setLoading(false);
    if (success) {
      onClose();
    }
  };

  return (
    <BaseModal
      open={isOpen}
      onClose={onClose}
      title={isDeleted ? "Restaurar Horario" : "Eliminar Horario"}
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
              {isDeleted ? "Restaurar Horario" : "Eliminar Horario"}
            </Text>
            <Text
              fontSize="xl"
              fontWeight="bold"
              color="gray.800"
              lineHeight="1.2"
            >
              {horario.nombre}
            </Text>
            <HStack gap={2} mt={1}>
              <Badge
                colorPalette={!horario.eliminado_el ? "green" : "red"}
                variant="solid"
                borderRadius="full"
              >
                {!horario.eliminado_el ? "activo" : "inactivo"}
              </Badge>
              <Badge
                colorPalette="gray"
                variant="subtle"
                borderRadius="full"
                textTransform="none"
              >
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
              ? `¿Deseas restaurar "${horario.nombre}"?`
              : `¿Deseas eliminar "${horario.nombre}"?`}
          </Text>
        </VStack>
      </VStack>
    </BaseModal>
  );
};
