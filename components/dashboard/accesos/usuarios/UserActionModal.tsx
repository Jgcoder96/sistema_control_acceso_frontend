"use client";

import React, { useEffect, useState, useRef, ChangeEvent } from "react";
import {
  Box,
  HStack,
  VStack,
  Text,
  Avatar,
  Badge,
  IconButton,
  Button,
} from "@chakra-ui/react";
import { Camera, Eye, Pencil, Trash2, UserPlus, UserCog } from "lucide-react";
import { BaseModal } from "@/components";
import {
  Usuario,
  RolUsuario,
  RolesApiResponse,
} from "@/app/(dashboard)/accesos/usuarios/types/Usuario";
import { useForm, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createUserSchema,
  updateUserSchema,
  UserFormValues,
} from "@/app/(dashboard)/accesos/usuarios/schemas";
import { API_CONFIG } from "@/config/api";

import { UserForm } from "./UserForm";
import { UserDetailView } from "./UserDetailView";
import { UserDeleteConfirm } from "./UserDeleteConfirm";
import { UserRolesForm } from "./UserRolesForm";

export type ModalMode = "view" | "create" | "edit" | "delete" | "assign_roles";

/** Propiedades para la correcta orquestación del modal CRUD de Usuarios */
interface UserActionModalProps {
  user: Usuario | null;
  mode: ModalMode;
  open: boolean;
  onClose: () => void;
  onAction: (
    data: FormData | string | { userId: string; rolesIds: string[] }
  ) => Promise<void>;
}

/**
 * Modal polimórfico para la gestión de Usuarios.
 * Soporta creación/edición (con previsualización de imágenes), vista de solo lectura,
 * eliminación, y la asignación interactiva de roles.
 */
export const UserActionModal = ({
  user,
  mode,
  open,
  onClose,
  onAction,
}: UserActionModalProps) => {
  const [loadingRoles, setLoadingRoles] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);

  // Estados para asignación de roles
  const [roles, setRoles] = useState<RolUsuario[]>([]);
  const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>([]);
  const [allRoles, setAllRoles] = useState<RolUsuario[]>([]);
  const [loadingAllRoles, setLoadingAllRoles] = useState(false);

  // Estados para manejo de avatar
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Diccionario de configuración estética por modo
  const configMap: Record<
    ModalMode,
    { title: string; color: string; icon: React.ReactNode }
  > = {
    view: { title: "Detalles", color: "blue", icon: <Eye size={20} /> },
    create: {
      title: "Nuevo Usuario",
      color: "green",
      icon: <UserPlus size={20} />,
    },
    edit: {
      title: "Editar Usuario",
      color: "orange",
      icon: <Pencil size={20} />,
    },
    delete: {
      title: "Eliminar Usuario",
      color: "red",
      icon: <Trash2 size={20} />,
    },
    assign_roles: {
      title: "Asignar Roles",
      color: "purple",
      icon: <UserCog size={20} />,
    },
  };

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<UserFormValues>({
    resolver: zodResolver(
      mode === "create" ? createUserSchema : updateUserSchema,
    ) as unknown as Resolver<UserFormValues>, // Cast seguro para evitar error de TypeScript con schema dinámico
    mode: "onTouched",
  });

  const nombreVal = watch("nombre");
  const apellidoVal = watch("apellido");

  // Reactividad inicial al abrir el modal (Resetea estado y pre-carga API según necesidad)
  useEffect(() => {
    if (open) {
      if (user) {
        reset({
          nombre: user.nombre,
          apellido: user.apellido,
          cedula: user.cedula,
          correo_electronico: user.correo_electronico,
          clave: "",
          foto: null,
        });
        setPreviewUrl(user.foto_url || null);
        setSelectedFile(null);
        if (mode === "view" || mode === "assign_roles") {
          fetchUserRoles(user.id);
        }
        if (mode === "assign_roles") {
          fetchAllRoles();
        }
      } else {
        reset({
          nombre: "",
          apellido: "",
          cedula: "",
          correo_electronico: "",
          clave: "",
          foto: null,
        });
        setPreviewUrl(null);
        setSelectedFile(null);
      }
    }
  }, [open, user, mode, reset]);

  // Asegura que los checkboxes iniciales coincidan con los roles del backend
  useEffect(() => {
    if (roles && mode === "assign_roles") {
      setSelectedRoleIds(roles.map((r) => r.id));
    }
  }, [roles, mode]);

  /** Obtiene únicamente los roles asociados al usuario actual */
  const fetchUserRoles = async (userId: string) => {
    setLoadingRoles(true);
    setRoles([]);
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(API_CONFIG.ENDPOINTS.USER_ROLES(userId), {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result: RolesApiResponse = await res.json();
      if (result.success) setRoles(result.data);
    } catch {
      // Ignorado silenciosamente
    } finally {
      setLoadingRoles(false);
    }
  };

  /** Consulta el catálogo completo de roles disponibles */
  const fetchAllRoles = async (search?: string) => {
    setLoadingAllRoles(true);
    try {
      const token = localStorage.getItem("access_token");
      const searchParam = search ? `&search=${encodeURIComponent(search)}` : "";
      const res = await fetch(
        `${API_CONFIG.ENDPOINTS.ROLES}?limit=100&status=active${searchParam}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const result = await res.json();
      if (result.success) {
        setAllRoles(result.data);
      }
    } catch {
      // Ignorado silenciosamente
    } finally {
      setLoadingAllRoles(false);
    }
  };

  /** Despacha la acción de submit final hacia page.tsx (FormData o Payload directo) */
  const handleConfirm = async (data: UserFormValues | null) => {
    if (mode === "view") return;
    if (mode === "delete" && user) {
      setLoadingAction(true);
      await onAction(user.id);
      setLoadingAction(false);
      onClose();
      return;
    }
    if (mode === "assign_roles" && user) {
      setLoadingAction(true);
      await onAction({ userId: user.id, rolesIds: selectedRoleIds });
      setLoadingAction(false);
      onClose();
      return;
    }

    if (!data) return;

    // Compone el FormData para soportar la subida del avatar
    const payload = new FormData();
    payload.append("nombre", data.nombre || "");
    payload.append("apellido", data.apellido || "");
    payload.append("cedula", data.cedula || "");
    payload.append("correo_electronico", data.correo_electronico || "");
    payload.append("estado", user?.estado || "activo");

    if (data.clave) payload.append("clave", data.clave);
    if (selectedFile) payload.append("foto", selectedFile);

    setLoadingAction(true);
    await onAction(payload);
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
          ? "Registrar Usuario"
          : `${nombreVal || user?.nombre || ""} ${apellidoVal || user?.apellido || ""}`
      }
      colorPalette={currentConfig.color}
      size={mode === "delete" ? "md" : "lg"}
      bodyScroll={mode !== "assign_roles"}
      headerExtra={
        <HStack
          gap={{ base: 4, sm: 6 }}
          align="center"
          flexDirection={{ base: "column", sm: "row" }}
          textAlign={{ base: "center", sm: "left" }}
        >
          {/* Módulo de previsualización y carga del avatar */}
          <Box position="relative">
            <Avatar.Root
              size="2xl"
              border="4px solid"
              borderColor="white"
              boxShadow="md"
              bg="gray.150"
            >
              <Avatar.Image src={previewUrl || undefined} />
              <Avatar.Fallback name={nombreVal || user?.nombre || "U"} />
            </Avatar.Root>
            {(mode === "create" || mode === "edit") && (
              <IconButton
                aria-label="Foto"
                size="sm"
                colorPalette="green"
                borderRadius="full"
                position="absolute"
                bottom="-2px"
                right="-2px"
                boxShadow="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                <Camera size={14} />
              </IconButton>
            )}
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              accept="image/*"
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                const file = e.target.files?.[0];
                if (file) {
                  setValue("foto", file, { shouldValidate: true });
                  setSelectedFile(file);
                  setPreviewUrl(URL.createObjectURL(file));
                }
              }}
            />
          </Box>
          <VStack align={{ base: "center", sm: "start" }} gap={1}>
            <Text
              fontSize="xs"
              fontWeight="bold"
              textTransform="uppercase"
              letterSpacing="wider"
              color={`${currentConfig.color}.600`}
            >
              {mode === "view" ? "Detalles del Usuario" : currentConfig.title}
            </Text>
            <Text
              fontSize="2xl"
              fontWeight="bold"
              color="gray.850"
              lineHeight="1.2"
            >
              {mode === "create"
                ? "Registrar Usuario"
                : `${nombreVal || user?.nombre || ""} ${apellidoVal || user?.apellido || ""}`}
            </Text>
            <HStack gap={2} mt={1}>
              <Badge
                colorPalette={
                  user?.estado === "activo" || mode === "create"
                    ? "green"
                    : "red"
                }
                variant="solid"
                borderRadius="full"
              >
                {mode === "create" ? "activo" : user?.estado || "activo"}
              </Badge>
              {mode !== "create" && user?.id && (
                <Badge
                  colorPalette="gray"
                  variant="subtle"
                  borderRadius="full"
                  textTransform="none"
                >
                  <Text as="span" display={{ base: "none", sm: "inline" }}>
                    ID: {user.id}
                  </Text>
                  <Text as="span" display={{ base: "inline", sm: "none" }}>
                    ID: {user.id.substring(0, 8)}...
                  </Text>
                </Badge>
              )}
            </HStack>
          </VStack>
        </HStack>
      }
      showFooter={true}
      confirmText={
        mode === "delete"
          ? "Eliminar"
          : mode === "assign_roles"
            ? "Asignar Roles"
            : "Confirmar"
      }
      cancelText="Cancelar"
      onConfirm={
        mode === "delete"
          ? () => handleConfirm(null)
          : mode === "assign_roles"
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
      {/* Sub-componente inyectado dependiente del modo */}
      {mode === "view" ? (
        <UserDetailView
          formData={user || {}}
          loadingRoles={loadingRoles}
          roles={roles}
        />
      ) : mode === "delete" ? (
        <UserDeleteConfirm nombre={user?.nombre || ""} />
      ) : mode === "assign_roles" ? (
        <UserRolesForm
          allRoles={allRoles}
          loadingAllRoles={loadingAllRoles}
          selectedRoleIds={selectedRoleIds}
          onChange={setSelectedRoleIds}
          onSearch={fetchAllRoles}
        />
      ) : (
        <UserForm
          register={register}
          errors={errors}
          selectedFile={selectedFile}
          mode={mode}
        />
      )}
    </BaseModal>
  );
};
