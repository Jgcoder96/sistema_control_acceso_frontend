"use client";

import React from "react";
import { Text } from "@chakra-ui/react";

interface UserDeleteConfirmProps {
  nombre: string;
}

export const UserDeleteConfirm = ({ nombre }: UserDeleteConfirmProps) => {
  return (
    <Text textAlign="center" fontSize="md" py={6} color="gray.700">
      ¿Seguro de eliminar a <b>{nombre}</b>?
    </Text>
  );
};
