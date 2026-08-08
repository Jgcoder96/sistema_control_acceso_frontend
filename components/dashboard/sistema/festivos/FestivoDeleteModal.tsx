import React, { useState } from "react";
import { VStack, Text, Center, HStack, Badge, Box } from "@chakra-ui/react";
import { AlertTriangle, Trash2 } from "lucide-react";
import { BaseModal } from "@/components/dashboard/BaseModal";
import { Festivo } from "@/app/(dashboard)/sistema/festivos/types/Festivo";

interface FestivoDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  festivo: Festivo | null;
  onConfirm: (id: string, currentlyDeleted: boolean) => Promise<boolean>;
}

/**
 * Componente visual de advertencia que intercepta la acción de eliminar (o restaurar)
 * un Día Festivo, requiriendo confirmación explícita del usuario.
 */
export const FestivoDeleteModal = ({
  isOpen,
  onClose,
  festivo,
  onConfirm,
}: FestivoDeleteModalProps) => {
  const [loading, setLoading] = useState(false);

  if (!festivo) return null;
  const isDeleted = !!festivo.eliminado_el;

  const handleConfirm = async () => {
    setLoading(true);
    const success = await onConfirm(festivo.id, isDeleted);
    setLoading(false);
    if (success) {
      onClose();
    }
  };

  return (
    <BaseModal
      open={isOpen}
      onClose={onClose}
      title={isDeleted ? "Restaurar Feriado" : "Eliminar Feriado"}
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
              {isDeleted ? "Restaurar Feriado" : "Eliminar Feriado"}
            </Text>
            <Text
              fontSize="xl"
              fontWeight="bold"
              color="gray.800"
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
              ? `¿Deseas restaurar "${festivo.nombre}"?`
              : `¿Deseas eliminar "${festivo.nombre}"?`}
          </Text>
        </VStack>
      </VStack>
    </BaseModal>
  );
};
