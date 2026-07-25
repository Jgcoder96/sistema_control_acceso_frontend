"use client";

import React, { useEffect, useState } from "react";
import { HStack, VStack, Text, Badge, Button } from "@chakra-ui/react";
import { Eye, Pencil, Trash2, Plus, ShieldCheck } from "lucide-react";
import { BaseModal } from "@/components";
import { Role, AppPermission, RolePermissionsApiResponse, AppPermissionsApiResponse } from "@/app/(dashboard)/accesos/roles/types/Role";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createRoleSchema, updateRoleSchema, RoleFormValues } from "@/app/(dashboard)/accesos/roles/schemas/roleSchema";
import { API_CONFIG } from "@/config/api";

import { RoleForm } from "./RoleForm";
import { RoleDetailView } from "./RoleDetailView";
import { RoleDeleteConfirm } from "./RoleDeleteConfirm";
import { RolePermissionsForm } from "./RolePermissionsForm";

export type RoleModalMode = "view" | "create" | "edit" | "delete" | "assign_permissions";

interface RoleActionModalProps {
  role: Role | null;
  mode: RoleModalMode;
  open: boolean;
  onClose: () => void;
  onAction: (data: any) => Promise<void>;
}

export const RoleActionModal = ({
  role,
  mode,
  open,
  onClose,
  onAction,
}: RoleActionModalProps) => {
  const [loadingPermissions, setLoadingPermissions] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);
  const [rolePermissions, setRolePermissions] = useState<AppPermission[]>([]);
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<string[]>([]);
  const [allPermissions, setAllPermissions] = useState<AppPermission[]>([]);
  const [loadingAllPermissions, setLoadingAllPermissions] = useState(false);

  const configMap: Record<
    RoleModalMode,
    { title: string; color: string; icon: React.ReactNode }
  > = {
    view: { title: "Detalles", color: "blue", icon: <Eye size={20} /> },
    create: { title: "Nuevo Rol", color: "green", icon: <Plus size={20} /> },
    edit: { title: "Editar Rol", color: "orange", icon: <Pencil size={20} /> },
    delete: { title: "Eliminar Rol", color: "red", icon: <Trash2 size={20} /> },
    assign_permissions: { title: "Asignar Permisos", color: "green", icon: <ShieldCheck size={20} /> },
  };

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<RoleFormValues>({
    resolver: zodResolver(mode === "create" ? createRoleSchema : updateRoleSchema),
    mode: "onTouched",
  });

  const nombreVal = watch("nombre");

  useEffect(() => {
    if (open) {
      if (role) {
        reset({
          nombre: role.nombre,
          descripcion: role.descripcion || "",
        });
        if (mode === "view" || mode === "assign_permissions") {
          fetchRolePermissions(role.id);
        }
        if (mode === "assign_permissions") {
          fetchAllPermissions();
        }
      } else {
        reset({
          nombre: "",
          descripcion: "",
        });
      }
    }
  }, [open, role, mode, reset]);

  useEffect(() => {
    if (rolePermissions && mode === "assign_permissions") {
      setSelectedPermissionIds(rolePermissions.map((p) => p.id));
    }
  }, [rolePermissions, mode]);

  const fetchRolePermissions = async (roleId: string) => {
    setLoadingPermissions(true);
    setRolePermissions([]);
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(API_CONFIG.ENDPOINTS.ROLE_PERMISSIONS(roleId), {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result: RolePermissionsApiResponse = await res.json();
      if (result.success) setRolePermissions(result.data.permisos);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingPermissions(false);
    }
  };

  const fetchAllPermissions = async (search?: string) => {
    setLoadingAllPermissions(true);
    try {
      const token = localStorage.getItem("access_token");
      const searchParam = search ? `&search=${encodeURIComponent(search)}` : "";
      const res = await fetch(`${API_CONFIG.ENDPOINTS.APP_PERMISSIONS}?limit=100&status=active${searchParam}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result: AppPermissionsApiResponse = await res.json();
      if (result.success) {
        setAllPermissions(result.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAllPermissions(false);
    }
  };

  const handleConfirm = async (data: RoleFormValues | null) => {
    if (mode === "view") return;
    
    setLoadingAction(true);
    if (mode === "delete" && role) {
      await onAction(role.id);
    } else if (mode === "assign_permissions" && role) {
      await onAction({ roleId: role.id, permisosIds: selectedPermissionIds });
    } else if (data) {
      await onAction(data);
    }
    setLoadingAction(false);
    onClose();
  };

  const currentConfig = configMap[mode];
  const isActivo = !role?.eliminado_el;

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title={mode === "create" ? "Registrar Rol" : nombreVal || role?.nombre || ""}
      colorPalette={currentConfig.color}
      size="lg"
      headerExtra={
        <HStack
          gap={{ base: 4, sm: 6 }}
          align="center"
          flexDirection={{ base: "column", sm: "row" }}
          textAlign={{ base: "center", sm: "left" }}
        >
          <VStack align={{ base: "center", sm: "start" }} gap={1}>
            <Text
              fontSize="xs"
              fontWeight="bold"
              textTransform="uppercase"
              letterSpacing="wider"
              color={`${currentConfig.color}.600`}
            >
              {mode === "view" ? "Detalles del Rol" : currentConfig.title}
            </Text>
            <Text fontSize="2xl" fontWeight="bold" color="gray.850" lineHeight="1.2">
              {mode === "create" ? "Registrar Rol" : nombreVal || role?.nombre || ""}
            </Text>
            <HStack gap={2} mt={1}>
              <Badge
                colorPalette={isActivo || mode === "create" ? "green" : "red"}
                variant="solid"
                borderRadius="full"
              >
                {mode === "create" ? "activo" : isActivo ? "activo" : "inactivo"}
              </Badge>
              {mode !== "create" && role?.id && (
                <Badge
                  colorPalette="gray"
                  variant="subtle"
                  borderRadius="full"
                  textTransform="none"
                >
                  <Text as="span" display={{ base: "none", sm: "inline" }}>
                    ID: {role.id}
                  </Text>
                  <Text as="span" display={{ base: "inline", sm: "none" }}>
                    ID: {role.id.substring(0, 8)}...
                  </Text>
                </Badge>
              )}
            </HStack>
          </VStack>
        </HStack>
      }
      showFooter={true}
      confirmText={
        mode === "delete" ? "Eliminar" : mode === "assign_permissions" ? "Asignar Permisos" : "Confirmar"
      }
      cancelText="Cancelar"
      onConfirm={
        mode === "delete" || mode === "assign_permissions"
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
        <RoleDetailView
          formData={role || {}}
          loadingPermissions={loadingPermissions}
          permissions={rolePermissions}
        />
      ) : mode === "delete" ? (
        <RoleDeleteConfirm nombre={role?.nombre || ""} />
      ) : mode === "assign_permissions" ? (
        <RolePermissionsForm
          allPermissions={allPermissions}
          loadingAllPermissions={loadingAllPermissions}
          selectedPermissionIds={selectedPermissionIds}
          onChange={setSelectedPermissionIds}
          onSearch={fetchAllPermissions}
        />
      ) : (
        <RoleForm register={register} errors={errors} />
      )}
    </BaseModal>
  );
};
