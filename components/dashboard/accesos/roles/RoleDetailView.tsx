"use client";

import React from "react";
import { Grid, VStack, HStack, Text, Box, Separator, Spinner } from "@chakra-ui/react";
import { Calendar, Clock, Text as TextIcon, Fingerprint, ShieldCheck } from "lucide-react";
import { DetailItem } from "@/components";
import { Role, AppPermission } from "@/app/(dashboard)/accesos/roles/types/Role";

interface RoleDetailViewProps {
  formData: Partial<Role>;
  loadingPermissions: boolean;
  permissions: AppPermission[];
}

export const RoleDetailView = ({
  formData,
  loadingPermissions,
  permissions,
}: RoleDetailViewProps) => {
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
    <VStack align="start" gap={6} w="full" h="full" overflow="hidden">
      <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6} w="full">
        <DetailItem
          icon={<Fingerprint size={18} />}
          label="Nombre del Rol"
          value={formData.nombre || ""}
        />
        <DetailItem
          icon={<TextIcon size={18} />}
          label="Descripción"
          value={formData.descripcion || "Sin descripción"}
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
      <VStack align="start" w="full" flex="1" minH={0} overflow="hidden">
        <HStack color="green.500">
          <ShieldCheck size={20} />
          <Text fontWeight="bold" fontSize="xs">
            PERMISOS ASIGNADOS
          </Text>
        </HStack>
        {loadingPermissions ? (
          <Spinner size="sm" />
        ) : permissions.length > 0 ? (
          <Box flex="1" minH={0} overflowY="auto" w="full" pr={2}>
            <HStack gap={2} wrap="wrap">
              {permissions.map((p) => (
                <Box
                  key={p.id}
                  p="2"
                  px="3"
                  borderRadius="lg"
                  bg="green.50"
                  border="1px solid"
                  borderColor="green.100"
                >
                  <Text fontWeight="bold" fontSize="xs" color="green.700">
                    {p.slug}
                  </Text>
                  {p.descripcion && (
                    <Text fontSize="2xs" color="green.600" mt={0.5}>
                      {p.descripcion}
                    </Text>
                  )}
                </Box>
              ))}
            </HStack>
          </Box>
        ) : (
          <Text fontSize="sm" color="gray.400">
            Sin permisos asignados.
          </Text>
        )}
      </VStack>
    </VStack>
  );
};
