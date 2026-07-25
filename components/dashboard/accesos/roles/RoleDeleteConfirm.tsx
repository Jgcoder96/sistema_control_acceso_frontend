"use client";

import React from "react";
import { VStack, Text, Center } from "@chakra-ui/react";
import { AlertTriangle } from "lucide-react";

interface RoleDeleteConfirmProps {
  nombre: string;
}

/**
 * Componente visual de advertencia para confirmar la eliminación de un Rol.
 */
export const RoleDeleteConfirm = ({ nombre }: RoleDeleteConfirmProps) => {
  return (
    <VStack align="center" gap={4} py={4}>
      {/* Icono destacado de Peligro/Alerta */}
      <Center w="16" h="16" bg="red.50" borderRadius="full" color="red.500">
        <AlertTriangle size={32} />
      </Center>

      {/* Mensaje de Confirmación */}
      <VStack gap={1} textAlign="center">
        <Text fontSize="lg" fontWeight="bold" color="gray.800">
          ¿Estás seguro de eliminar este rol?
        </Text>
        <Text fontSize="sm" color="gray.500">
          El rol <strong>{nombre}</strong> será eliminado.
        </Text>
      </VStack>
    </VStack>
  );
};
