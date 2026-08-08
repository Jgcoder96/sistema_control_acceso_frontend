import React, { useEffect, useState } from "react";
import { HStack, VStack, Text, Badge, Box, Button } from "@chakra-ui/react";
import { Eye, Trash2, Plus } from "lucide-react";
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

/**
 * Modal centralizado para gestionar operaciones sobre Permisos (Ver, Crear, Eliminar).
 * El modal muta dinámicamente según la propiedad 'mode'.
 */
export const PermissionActionModal = ({
  permission,
  mode,
  open,
  onClose,
  onAction,
}: PermissionActionModalProps) => {
  const [loadingAction, setLoadingAction] = useState(false);

  // Configuración visual y textos dinámicos según la acción a realizar
  const configMap: Record<
    PermissionModalMode,
    { title: string; color: string; icon: React.ReactNode }
  > = {
    view: { title: "Detalles", color: "blue", icon: <Eye size={20} /> },
    create: {
      title: "Nuevo Permiso",
      color: "green",
      icon: <Plus size={20} />,
    },
    delete: {
      title: "Eliminar Permiso",
      color: "red",
      icon: <Trash2 size={20} />,
    },
  };

  // Inicialización de validaciones con React Hook Form + Zod
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PermissionFormValues>({
    resolver: zodResolver(createPermissionSchema),
    mode: "onTouched",
  });

  // Limpia el formulario automáticamente cada vez que se abre el modal para crear
  useEffect(() => {
    if (open && mode === "create") {
      reset({ slug: "", descripcion: "" });
    }
  }, [open, mode, reset]);

  /**
   * Procesa y delega la acción principal (crear o eliminar).
   */
  const handleConfirm = async (data: PermissionFormValues | null) => {
    if (mode === "view") return;

    setLoadingAction(true);
    try {
      if (mode === "delete" && permission) {
        await onAction(permission.id);
      } else if (mode === "create" && data) {
        await onAction(data);
      }
    } finally {
      setLoadingAction(false);
      onClose();
    }
  };

  const currentConfig = configMap[mode];

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title={
        mode === "create" ? "Crear Permiso" : permission?.slug || "Detalles"
      }
      colorPalette={currentConfig.color}
      size="md"
      // Personalización del encabezado del modal con íconos e identificadores de estado
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
            <Text
              fontSize="xl"
              fontWeight="bold"
              color="gray.800"
              lineHeight="1.2"
            >
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
                <Badge
                  colorPalette="gray"
                  variant="subtle"
                  borderRadius="full"
                  textTransform="none"
                >
                  <Text as="span" display={{ base: "none", sm: "inline" }}>
                    ID: {permission.id}
                  </Text>
                  <Text as="span" display={{ base: "inline", sm: "none" }}>
                    ID: {permission.id.substring(0, 8)}...
                  </Text>
                </Badge>
              </HStack>
            )}
          </VStack>
        </HStack>
      }
      showFooter={true}
      confirmText={mode === "delete" ? "Eliminar" : "Confirmar"}
      cancelText="Cancelar"
      // En modo creación valida con hook-form antes de invocar handleConfirm
      onConfirm={
        mode === "delete"
          ? () => handleConfirm(null)
          : handleSubmit(handleConfirm)
      }
      confirmLoading={loadingAction}
      // Oculta los botones por defecto en modo lectura ("view") y provee un botón único de Cerrar
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
      {/* Renderizado condicional del cuerpo del modal según el modo seleccionado */}
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
