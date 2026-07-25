"use client";

import React from "react";
import { Text } from "@chakra-ui/react";

/** Atributos para configurar el mensaje de confirmación de eliminación */
interface UserDeleteConfirmProps {
  nombre: string;
}

/**
 * Componente de confirmación visual antes de realizar un borrado lógico de un Usuario.
 */
export const UserDeleteConfirm = ({ nombre }: UserDeleteConfirmProps) => {
  return (
    <Text textAlign="center" fontSize="md" py={6} color="gray.700">
      ¿Seguro de eliminar a <b>{nombre}</b>?
    </Text>
  );
};
