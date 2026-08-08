import React, { useState } from "react";
import { VStack, Text, Box, HStack, Badge } from "@chakra-ui/react";
import { Trash2 } from "lucide-react";
import { BaseModal } from "@/components/dashboard/BaseModal";
import { PermisoFisico } from "@/app/(dashboard)/sistema/permisos/types/PermisoFisico";

interface PermisoDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  permiso: PermisoFisico | null;
  onConfirm: (id: string) => Promise<void>;
}

/**
 * Componente modal (Premium UI) para confirmar la revocación de un permiso físico.
 * Maneja internamente el estado de carga y notifica al componente padre vía onConfirm.
 */
export const PermisoDeleteModal = ({
  isOpen,
  onClose,
  permiso,
  onConfirm,
}: PermisoDeleteModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!permiso) return null;

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      await onConfirm(permiso.id);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BaseModal
      open={isOpen}
      onClose={onClose}
      title="Revocar Permiso Físico"
      size="md"
      colorPalette="red"
      headerExtra={
        <HStack gap={4} align="center">
          <Box p={3} borderRadius="xl" bg="red.100" color="red.600">
            <Trash2 size={24} />
          </Box>
          <VStack align="start" gap={1}>
            <Text
              fontSize="xs"
              fontWeight="bold"
              textTransform="uppercase"
              letterSpacing="wider"
              color="red.600"
            >
              Eliminar Acceso
            </Text>
            <Text
              fontSize="xl"
              fontWeight="bold"
              color="gray.800"
              lineHeight="1.2"
            >
              {permiso.usuario}
            </Text>
            <HStack gap={2} mt={1}>
              <Badge
                colorPalette="gray"
                variant="subtle"
                borderRadius="full"
                textTransform="none"
              >
                Punto: {permiso.punto_acceso}
              </Badge>
            </HStack>
          </VStack>
        </HStack>
      }
      confirmText="Confirmar"
      cancelText="Cancelar"
      onConfirm={handleConfirm}
      confirmLoading={isSubmitting}
    >
      <VStack align="stretch" gap={4} w="full" pt={4} pb={2}>
        <Text
          fontSize="md"
          color="gray.700"
          lineHeight="tall"
          textAlign="center"
        >
          ¿Deseas revocar permanentemente este permiso de acceso?
        </Text>
      </VStack>
    </BaseModal>
  );
};
