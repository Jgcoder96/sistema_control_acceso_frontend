import React from "react";
import { Grid, VStack, Separator } from "@chakra-ui/react";
import { Calendar, Clock, Text as TextIcon, KeyRound } from "lucide-react";
import { DetailItem } from "@/components";
import { Permission } from "@/app/(dashboard)/accesos/permisos/types/Permission";

interface PermissionDetailViewProps {
  formData: Partial<Permission>;
}

/**
 * Vista de sólo lectura para mostrar los detalles completos de un Permiso.
 * Organiza la información clave en una cuadrícula responsiva.
 */
export const PermissionDetailView = ({
  formData,
}: PermissionDetailViewProps) => {
  /** Parsea y formatea una fecha ISO a un formato local legible */
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
      return dateStr; // Retorna el valor original si falla el parseo
    }
  };

  return (
    <VStack align="start" gap={6} w="full" h="full" overflow="hidden">
      {/* Cuadrícula adaptable para organizar los atributos del permiso */}
      <Grid
        templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
        gap={6}
        w="full"
      >
        <DetailItem
          icon={<KeyRound size={18} />}
          label="Slug"
          value={formData.slug || ""}
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
    </VStack>
  );
};
