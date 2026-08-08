"use client";

import React from "react";
import { VStack, Text, Center } from "@chakra-ui/react";
import { AlertTriangle } from "lucide-react";

/**
 * Atributos inyectados para configurar la confirmación visual de eliminación.
 */
interface UserDeleteConfirmProps {
  nombre: string;
}

/**
 * Componente funcional de advertencia crítica para la eliminación de usuarios.
 * Muestra información relevante del usuario objetivo antes de proceder con el borrado.
 */
export const UserDeleteConfirm = ({ nombre }: UserDeleteConfirmProps) => {
  return (
    <VStack align="center" gap={4} py={4}>
      <Center w="16" h="16" bg="red.50" borderRadius="full" color="red.500">
        <AlertTriangle size={32} />
      </Center>

      <VStack gap={1} textAlign="center">
        <Text fontSize="lg" fontWeight="bold" color="gray.800">
          ¿Deseas eliminar a {nombre}?
        </Text>
      </VStack>
    </VStack>
  );
};
