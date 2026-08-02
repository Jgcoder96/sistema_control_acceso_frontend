import React from "react";
import { VStack, Text, Center } from "@chakra-ui/react";
import { AlertTriangle } from "lucide-react";

interface PermissionDeleteConfirmProps {
  slug: string;
}

/**
 * Componente visual para la advertencia de eliminación de un permiso.
 * Muestra un mensaje crítico de confirmación antes de proceder con el borrado.
 */
export const PermissionDeleteConfirm = ({
  slug,
}: PermissionDeleteConfirmProps) => {
  return (
    <VStack align="center" gap={4} py={4}>
      <Center w="16" h="16" bg="red.50" borderRadius="full" color="red.500">
        <AlertTriangle size={32} />
      </Center>

      <VStack gap={1} textAlign="center">
        <Text fontSize="lg" fontWeight="bold" color="gray.800">
          ¿Deseas eliminar "{slug}"?
        </Text>
      </VStack>
    </VStack>
  );
};
