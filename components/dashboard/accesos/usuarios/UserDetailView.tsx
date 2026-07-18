"use client";

import React from "react";
import { Grid, VStack, HStack, Text, Box, Separator, Spinner } from "@chakra-ui/react";
import { IdCard, Mail, Calendar, Clock, Shield } from "lucide-react";
import { DetailItem } from "./DetailItem";
import { Usuario, RolUsuario } from "@/app/(dashboard)/accesos/usuarios/types/Usuario";

interface UserDetailViewProps {
  formData: Partial<Usuario>;
  loadingRoles: boolean;
  roles: RolUsuario[];
}

export const UserDetailView = ({
  formData,
  loadingRoles,
  roles,
}: UserDetailViewProps) => {
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <VStack align="start" gap={6} w="full">
      <Grid templateColumns="repeat(2, 1fr)" gap={6} w="full">
        <DetailItem
          icon={<IdCard size={18} />}
          label="Cédula"
          value={formData.cedula || ""}
        />
        <DetailItem
          icon={<Mail size={18} />}
          label="Correo"
          value={formData.correo_electronico || ""}
        />
        <DetailItem
          icon={<Calendar size={18} />}
          label="Registro"
          value={formatDate(formData.creado_el)}
        />
        <DetailItem
          icon={<Clock size={18} />}
          label="Última Act."
          value={formatDate(formData.actualizado_el)}
        />
      </Grid>
      <Separator />
      <VStack align="start" w="full">
        <HStack color="blue.500">
          <Shield size={20} />
          <Text fontWeight="bold" fontSize="xs">
            ROLES
          </Text>
        </HStack>
        {loadingRoles ? (
          <Spinner size="sm" />
        ) : roles.length > 0 ? (
          <HStack gap={2} wrap="wrap">
            {roles.map((r) => (
              <Box
                key={r.id}
                p="2"
                px="3"
                borderRadius="lg"
                bg="blue.50"
                border="1px solid"
                borderColor="blue.100"
              >
                <Text fontWeight="bold" fontSize="xs" color="blue.700">
                  {r.nombre}
                </Text>
              </Box>
            ))}
          </HStack>
        ) : (
          <Text fontSize="sm" color="gray.400">
            Sin roles asignados.
          </Text>
        )}
      </VStack>
    </VStack>
  );
};
