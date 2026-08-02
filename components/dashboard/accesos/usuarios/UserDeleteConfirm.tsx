"use client";

import React from "react";
import { VStack, Text, Center } from "@chakra-ui/react";
import { AlertTriangle } from "lucide-react";

/** Atributos para configurar el mensaje de confirmación de eliminación */
interface UserDeleteConfirmProps {
  nombre: string;
}

/**
 * Componente de confirmación visual antes de realizar un borrado lógico de un Usuario.
 */
export const UserDeleteConfirm = ({ nombre }: UserDeleteConfirmProps) => {
  return (
    <VStack align="center" gap={4} py={4}>
      <Center w="16" h="16" bg="red.50" borderRadius="full" color="red.500">
        <AlertTriangle size={32} />
      </Center>

      <VStack gap={1} textAlign="center">
        <Text fontSize="lg" fontWeight="bold" color="gray.800">
          ¿Deseas eliminar "{nombre}"?
        </Text>
      </VStack>
    </VStack>
  );
};
