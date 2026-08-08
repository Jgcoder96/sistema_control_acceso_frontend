import React, { useState, useEffect } from "react";
import { VStack, HStack, Text, Box } from "@chakra-ui/react";
import { LockKeyhole } from "lucide-react";
import { BaseModal } from "@/components/dashboard/BaseModal";
import { API_CONFIG } from "@/config/api";
import { apiFetch } from "@/utils/apiClient";
import {
  AsyncDropdown,
  AsyncDropdownOption,
} from "@/components/ui/AsyncDropdown";
import { PermisoCreateValues } from "@/app/(dashboard)/sistema/permisos/schemas/permisoSchemas";

interface UserResponse {
  id: string;
  nombre: string;
  apellido: string;
  cedula: string;
}
interface NameResponse {
  id: string;
  nombre: string;
}

interface PermisoCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: PermisoCreateValues) => Promise<void>;
}

/**
 * Componente modal para la creación de un nuevo Permiso Físico.
 * Integra menús desplegables asíncronos (AsyncDropdown) para realizar búsquedas
 * escalables directas en el backend con filtros dependientes (Ubicación -> Punto de Acceso).
 */
export const PermisoCreateModal = ({
  isOpen,
  onClose,
  onSubmit,
}: PermisoCreateModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [usuarioId, setUsuarioId] = useState("");
  const [ubicacionId, setUbicacionId] = useState("");
  const [puntoAccesoId, setPuntoAccesoId] = useState("");
  const [horarioId, setHorarioId] = useState("");

  useEffect(() => {
    if (isOpen) {
      setUsuarioId("");
      setUbicacionId("");
      setPuntoAccesoId("");
      setHorarioId("");
    }
  }, [isOpen]);

  const fetchUsuarios = async (
    search: string,
  ): Promise<AsyncDropdownOption[]> => {
    const query = new URLSearchParams({ limit: "10", status: "active" });
    if (search) query.append("search", search);
    const res = await apiFetch(
      `${API_CONFIG.ENDPOINTS.USERS}?${query.toString()}`,
    );
    if (!res.ok) return [];
    const json = await res.json();
    const items = Array.isArray(json.data?.data)
      ? json.data.data
      : Array.isArray(json.data)
        ? json.data
        : [];
    return items.map((u: UserResponse) => ({
      value: u.id,
      label: `${u.nombre} ${u.apellido} (CI: ${u.cedula})`,
    }));
  };

  const fetchUbicaciones = async (
    search: string,
  ): Promise<AsyncDropdownOption[]> => {
    const query = new URLSearchParams({ limit: "10", status: "active" });
    if (search) query.append("search", search);
    const res = await apiFetch(
      `${API_CONFIG.ENDPOINTS.UBICACIONES}?${query.toString()}`,
    );
    if (!res.ok) return [];
    const json = await res.json();
    const items = Array.isArray(json.data?.data)
      ? json.data.data
      : Array.isArray(json.data)
        ? json.data
        : [];
    return items.map((u: NameResponse) => ({ value: u.id, label: u.nombre }));
  };

  const fetchPuntosAcceso = async (
    search: string,
  ): Promise<AsyncDropdownOption[]> => {
    const query = new URLSearchParams({ limit: "10", status: "active" });
    if (search) query.append("search", search);
    if (ubicacionId) query.append("location", ubicacionId);

    const res = await apiFetch(
      `${API_CONFIG.ENDPOINTS.PUNTOS_ACCESO}?${query.toString()}`,
    );
    if (!res.ok) return [];
    const json = await res.json();
    const items = Array.isArray(json.data?.data)
      ? json.data.data
      : Array.isArray(json.data)
        ? json.data
        : [];
    return items.map((p: NameResponse) => ({ value: p.id, label: p.nombre }));
  };

  const fetchHorarios = async (
    search: string,
  ): Promise<AsyncDropdownOption[]> => {
    const query = new URLSearchParams({ limit: "10", status: "active" });
    if (search) query.append("search", search);
    const res = await apiFetch(
      `${API_CONFIG.ENDPOINTS.HORARIOS}?${query.toString()}`,
    );
    if (!res.ok) return [];
    const json = await res.json();
    const items = Array.isArray(json.data?.data)
      ? json.data.data
      : Array.isArray(json.data)
        ? json.data
        : [];
    return items.map((h: NameResponse) => ({ value: h.id, label: h.nombre }));
  };

  const handleSubmit = async () => {
    if (!usuarioId || !puntoAccesoId || !horarioId) return;
    setIsSubmitting(true);
    try {
      await onSubmit({
        usuario_id: usuarioId,
        punto_acceso_id: puntoAccesoId,
        horario_id: horarioId,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = usuarioId && puntoAccesoId && horarioId;

  return (
    <BaseModal
      open={isOpen}
      onClose={onClose}
      title="Nuevo Permiso"
      size="md"
      colorPalette="green"
      headerExtra={
        <HStack gap={4} align="center">
          <Box
            p={3}
            borderRadius="xl"
            bg="green.100"
            color="green.600"
            flexShrink={0}
          >
            <LockKeyhole size={24} />
          </Box>
          <VStack align="start" gap={1}>
            <Text
              fontSize="xs"
              fontWeight="bold"
              textTransform="uppercase"
              letterSpacing="wider"
              color="green.600"
            >
              Permiso Físico
            </Text>
            <Text
              fontSize="xl"
              fontWeight="bold"
              color="gray.800"
              lineHeight="1.2"
            >
              Otorgar Acceso
            </Text>
          </VStack>
        </HStack>
      }
      confirmText="Crear Permiso"
      cancelText="Cancelar"
      onConfirm={handleSubmit}
      confirmLoading={isSubmitting}
      confirmDisabled={!isFormValid}
    >
      <VStack align="stretch" gap={5} w="full" pt={4} pb={2}>
        <Box>
          <Text fontSize="sm" fontWeight="medium" color="gray.700" mb={2}>
            Usuario
          </Text>
          <AsyncDropdown
            value={usuarioId}
            fetchOptions={fetchUsuarios}
            onChange={setUsuarioId}
            placeholder="Seleccione un usuario..."
            width="full"
          />
        </Box>
        <Box>
          <Text fontSize="sm" fontWeight="medium" color="gray.700" mb={2}>
            Ubicación (Opcional)
          </Text>
          <AsyncDropdown
            value={ubicacionId}
            fetchOptions={fetchUbicaciones}
            onChange={(val) => {
              setUbicacionId(val);
              setPuntoAccesoId(""); // Limpiar el punto de acceso al cambiar la ubicación
            }}
            placeholder="Todas las ubicaciones..."
            width="full"
          />
          <Text fontSize="xs" color="gray.500" mt={1}>
            Filtra los puntos de acceso por ubicación
          </Text>
        </Box>
        <Box>
          <Text fontSize="sm" fontWeight="medium" color="gray.700" mb={2}>
            Punto de Acceso
          </Text>
          <AsyncDropdown
            value={puntoAccesoId}
            fetchOptions={fetchPuntosAcceso}
            onChange={setPuntoAccesoId}
            placeholder="Seleccione un punto de acceso..."
            width="full"
          />
        </Box>
        <Box>
          <Text fontSize="sm" fontWeight="medium" color="gray.700" mb={2}>
            Horario Permitido
          </Text>
          <AsyncDropdown
            value={horarioId}
            fetchOptions={fetchHorarios}
            onChange={setHorarioId}
            placeholder="Seleccione un horario..."
            width="full"
          />
        </Box>
      </VStack>
    </BaseModal>
  );
};
