import React, { useEffect, useState } from "react";
import { HStack, VStack, Text, Badge, Box, Button } from "@chakra-ui/react";
import { Eye, Trash2, Plus, KeyRound } from "lucide-react";
import { BaseModal } from "@/components";
import { Permission } from "@/app/(dashboard)/accesos/permisos/types/Permission";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createPermissionSchema,
  PermissionFormValues,
} from "@/app/(dashboard)/accesos/permisos/schemas/permissionSchema";

import { PermissionForm } from "./PermissionForm";
import { PermissionDetailView } from "./PermissionDetailView";
import { PermissionDeleteConfirm } from "./PermissionDeleteConfirm";

export type PermissionModalMode = "view" | "create" | "delete";

interface PermissionActionModalProps {
  permission: Permission | null;
  mode: PermissionModalMode;
  open: boolean;
  onClose: () => void;
  onAction: (data: PermissionFormValues | string) => Promise<void>;
}

export const PermissionActionModal = ({
  permission,
  mode,
  open,
  onClose,
  onAction,
}: PermissionActionModalProps) => {
  const [loadingAction, setLoadingAction] = useState(false);

  const configMap: Record<
    PermissionModalMode,
    { title: string; color: string; icon: React.ReactNode }
  > = {
    view: { title: "Detalles", color: "blue", icon: <Eye size={20} /> },
    create: { title: "Nuevo Permiso", color: "green", icon: <Plus size={20} /> },
    delete: { title: "Eliminar Permiso", color: "red", icon: <Trash2 size={20} /> },
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PermissionFormValues>({
    resolver: zodResolver(createPermissionSchema),
    mode: "onTouched",
  });

  useEffect(() => {
    if (open) {
      if (mode === "create") {
        reset({ slug: "", descripcion: "" });
      }
    }
  }, [open, mode, reset]);

  const handleConfirm = async (data: PermissionFormValues | null) => {
    if (mode === "view") return;
    
    setLoadingAction(true);
    if (mode === "delete" && permission) {
      await onAction(permission.id);
    } else if (mode === "create" && data) {
      await onAction(data);
    }
    setLoadingAction(false);
    onClose();
  };

  const currentConfig = configMap[mode];

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title={
        mode === "create"
          ? "Crear Permiso"
          : permission?.slug || "Detalles"
      }
      colorPalette={currentConfig.color}
      size="md"
      headerExtra={
        <HStack gap={4} align="center">
          <Box
            p={3}
            borderRadius="xl"
            bg={`${currentConfig.color}.100`}
            color={`${currentConfig.color}.600`}
          >
            {currentConfig.icon}
          </Box>
          <VStack align="start" gap={1}>
            <Text
              fontSize="xs"
              fontWeight="bold"
              textTransform="uppercase"
              letterSpacing="wider"
              color={`${currentConfig.color}.600`}
            >
              {currentConfig.title}
            </Text>
            <Text fontSize="xl" fontWeight="bold" color="gray.800" lineHeight="1.2">
              {mode === "create" ? "Registrar Permiso" : permission?.slug}
            </Text>
            {mode !== "create" && permission && (
              <HStack gap={2} mt={1}>
                <Badge
                  colorPalette={!permission.eliminado_el ? "green" : "red"}
                  variant="solid"
                  borderRadius="full"
                >
                  {!permission.eliminado_el ? "activo" : "inactivo"}
                </Badge>
                <Badge colorPalette="gray" variant="subtle" borderRadius="full">
                  ID: {permission.id.substring(0, 8)}...
                </Badge>
              </HStack>
            )}
          </VStack>
        </HStack>
      }
      showFooter={true}
      confirmText={mode === "delete" ? "Eliminar" : "Confirmar"}
      cancelText="Cancelar"
      onConfirm={
        mode === "delete"
          ? () => handleConfirm(null)
          : handleSubmit(handleConfirm)
      }
      confirmLoading={loadingAction}
      customFooter={
        mode === "view" ? (
          <HStack justify="end" w="full">
            <Button
              colorPalette="blue"
              borderRadius="full"
              px={8}
              onClick={onClose}
            >
              Cerrar
            </Button>
          </HStack>
        ) : undefined
      }
    >
      {mode === "view" ? (
        <PermissionDetailView formData={permission || {}} />
      ) : mode === "delete" ? (
        <PermissionDeleteConfirm slug={permission?.slug || ""} />
      ) : (
        <PermissionForm register={register} errors={errors} />
      )}
    </BaseModal>
  );
};
