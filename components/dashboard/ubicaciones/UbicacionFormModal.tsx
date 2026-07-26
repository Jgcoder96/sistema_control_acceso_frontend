import React, { useState, useEffect } from "react";
import { VStack, Text, Input, Box, Field, HStack, Badge } from "@chakra-ui/react";
import { BaseModal } from "@/components/dashboard/BaseModal";
import { Ubicacion } from "@/app/(dashboard)/sistema/ubicaciones/types/Ubicacion";
import { MapPin } from "lucide-react";

interface UbicacionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  ubicacion: Ubicacion | null;
  onSave: (payload: { nombre: string; mesh_id: string }) => Promise<boolean>;
}

/**
 * Modal polimórfico utilizado tanto para registrar como para editar una Ubicación.
 * Gestiona el formulario, las validaciones locales (nombre y formato MAC Address) y 
 * delega el guardado a la función `onSave`.
 */
export const UbicacionFormModal = ({
  isOpen,
  onClose,
  ubicacion,
  onSave,
}: UbicacionFormModalProps) => {
  const [nombre, setNombre] = useState("");
  const [meshId, setMeshId] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ nombre?: string; meshId?: string }>({});

  const isEditing = !!ubicacion;

  useEffect(() => {
    if (isOpen) {
      setNombre(ubicacion?.nombre || "");
      setMeshId(ubicacion?.mesh_id || "");
      setErrors({});
      setLoading(false);
    }
  }, [isOpen, ubicacion]);

  const validate = () => {
    const newErrors: { nombre?: string; meshId?: string } = {};
    if (!nombre.trim()) newErrors.nombre = "El nombre es obligatorio";
    else if (nombre.length < 3) newErrors.nombre = "Debe tener al menos 3 caracteres";

    const meshRegex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
    if (!meshId.trim()) newErrors.meshId = "El Mesh ID es obligatorio";
    else if (!meshRegex.test(meshId)) newErrors.meshId = "Formato de MAC inválido (ej. 77:77:77:77:77:77)";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setLoading(true);
    const success = await onSave({
      nombre: nombre.trim(),
      mesh_id: meshId.trim().toUpperCase(),
    });
    setLoading(false);
    if (success) {
      onClose();
    }
  };

  return (
    <BaseModal
      open={isOpen}
      onClose={onClose}
      title={isEditing ? "Editar Ubicación" : "Nueva Ubicación"}
      colorPalette={isEditing ? "orange" : "green"}
      size="md"
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
              color={isEditing ? "orange.600" : "green.600"}
            >
              {isEditing ? "Editar Ubicación" : "Nueva Ubicación"}
            </Text>
            <Text
              fontSize="2xl"
              fontWeight="bold"
              color="gray.850"
              lineHeight="1.2"
            >
              {isEditing ? (ubicacion?.nombre || "Editar") : "Registrar Ubicación"}
            </Text>
            <HStack gap={2} mt={1}>
              <Badge
                colorPalette={isEditing && ubicacion?.eliminado_el ? "red" : "green"}
                variant="solid"
                borderRadius="full"
              >
                {!isEditing ? "activo" : (ubicacion?.eliminado_el ? "inactivo" : "activo")}
              </Badge>
              {isEditing && ubicacion?.id && (
                <Badge
                  colorPalette="gray"
                  variant="subtle"
                  borderRadius="full"
                  textTransform="none"
                >
                  <Text as="span" display={{ base: "none", sm: "inline" }}>
                    ID: {ubicacion.id}
                  </Text>
                  <Text as="span" display={{ base: "inline", sm: "none" }}>
                    ID: {ubicacion.id.substring(0, 8)}...
                  </Text>
                </Badge>
              )}
            </HStack>
          </VStack>
        </HStack>
      }
      onConfirm={handleSave}
      confirmText={isEditing ? "Guardar Cambios" : "Crear Ubicación"}
      confirmLoading={loading}
    >
      <VStack gap={4} align="stretch" pb={4}>
        <Field.Root invalid={!!errors.nombre}>
          <Field.Label>Nombre de la Ubicación</Field.Label>
          <Input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej: EIEE - Piso 3"
            h="45px"
            borderRadius="lg"
            bg="gray.50"
          />
          {errors.nombre && <Field.ErrorText>{errors.nombre}</Field.ErrorText>}
        </Field.Root>

        <Field.Root invalid={!!errors.meshId}>
          <Field.Label>Mesh ID (MAC Address)</Field.Label>
          <Input
            value={meshId}
            onChange={(e) => setMeshId(e.target.value)}
            placeholder="Ej: 77:77:77:77:77:77"
            h="45px"
            borderRadius="lg"
            bg="gray.50"
          />
          {errors.meshId && <Field.ErrorText>{errors.meshId}</Field.ErrorText>}
        </Field.Root>
      </VStack>
    </BaseModal>
  );
};
