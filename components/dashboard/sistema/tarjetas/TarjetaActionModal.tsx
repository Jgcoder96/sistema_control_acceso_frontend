import React, { useState } from "react";
import { VStack, Text, Button, Box, HStack, Icon, Badge } from "@chakra-ui/react";
import { AlertTriangle, ShieldAlert, ArrowLeftRight, RefreshCcw, Ban, Trash2 } from "lucide-react";
import { BaseModal } from "@/components/dashboard/BaseModal";
import { Tarjeta } from "@/app/(dashboard)/sistema/tarjetas/types/Tarjeta";

export type TarjetaActionType = "block" | "reactivate" | "return" | "lost" | "delete";

interface TarjetaActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  tarjeta: Tarjeta | null;
  actionType: TarjetaActionType | null;
  onConfirm: (id: string, action: TarjetaActionType) => Promise<void>;
}

export const TarjetaActionModal = ({
  isOpen,
  onClose,
  tarjeta,
  actionType,
  onConfirm,
}: TarjetaActionModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!tarjeta || !actionType) return null;

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      await onConfirm(tarjeta.id, actionType);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const getConfig = () => {
    switch (actionType) {
      case "block":
        return {
          title: "Bloquear Tarjeta",
          description: `¿Deseas bloquear esta tarjeta?`,
          icon: <Ban size={24} />,
          color: "orange",
          btnLabel: "Bloquear",
        };
      case "reactivate":
        return {
          title: "Reactivar Tarjeta",
          description: `¿Deseas reactivar esta tarjeta?`,
          icon: <RefreshCcw size={24} />,
          color: "green",
          btnLabel: "Reactivar",
        };
      case "return":
        return {
          title: "Devolver Tarjeta",
          description: `¿Confirmas la devolución de esta tarjeta?`,
          icon: <ArrowLeftRight size={24} />,
          color: "blue",
          btnLabel: "Devolver",
        };
      case "lost":
        return {
          title: "Reportar Pérdida",
          description: `¿Reportar esta tarjeta como perdida?`,
          icon: <ShieldAlert size={24} />,
          color: "red",
          btnLabel: "Reportar",
        };
      case "delete":
        return {
          title: "Eliminar Tarjeta",
          description: `¿Deseas eliminar esta tarjeta permanentemente?`,
          icon: <Trash2 size={24} />,
          color: "red",
          btnLabel: "Eliminar",
        };
      default:
        return {
          title: "Acción",
          description: "¿Continuar?",
          icon: <AlertTriangle size={24} />,
          color: "gray",
          btnLabel: "Confirmar",
        };
    }
  };

  const config = getConfig();

  return (
    <BaseModal
      open={isOpen}
      onClose={onClose}
      title={config.title}
      size="md"
      colorPalette={config.color}
      headerExtra={
        <HStack gap={4} align="center">
          <Box p={3} borderRadius="xl" bg={`${config.color}.100`} color={`${config.color}.600`}>
            {React.cloneElement(config.icon as React.ReactElement, { size: 24 })}
          </Box>
          <VStack align="start" gap={1}>
            <Text fontSize="xs" fontWeight="bold" textTransform="uppercase" letterSpacing="wider" color={`${config.color}.600`}>
              {config.title}
            </Text>
            <Text fontSize="xl" fontWeight="bold" color="gray.800" lineHeight="1.2">
              {tarjeta.codigo}
            </Text>
            <HStack gap={2} mt={1}>
              <Badge colorPalette="gray" variant="subtle" borderRadius="full" textTransform="none">
                ID: {tarjeta.id}
              </Badge>
            </HStack>
          </VStack>
        </HStack>
      }
      confirmText={config.btnLabel}
      cancelText="Cancelar"
      onConfirm={handleConfirm}
      confirmLoading={isSubmitting}
    >
      <VStack align="stretch" gap={4} w="full" pt={4} pb={2}>
        <Text fontSize="md" color="gray.700" lineHeight="tall" textAlign="center">
          {config.description}
        </Text>
      </VStack>
    </BaseModal>
  );
};
