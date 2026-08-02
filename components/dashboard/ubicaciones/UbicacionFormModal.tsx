import React, { useState, useEffect } from "react";
import { VStack, Text, Input, HStack, Badge, Field } from "@chakra-ui/react";
import { BaseModal } from "@/components/dashboard/BaseModal";
import { Ubicacion } from "@/app/(dashboard)/sistema/ubicaciones/types/Ubicacion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ubicacionFormSchema,
  UbicacionFormValues,
} from "@/app/(dashboard)/sistema/ubicaciones/schemas";

interface UbicacionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  ubicacion: Ubicacion | null;
  onSave: (payload: { nombre: string; mesh_id: string }) => Promise<boolean>;
}

/**
 * Modal polimórfico utilizado tanto para registrar como para editar una Ubicación.
 * Gestiona el formulario, las validaciones con Zod y React Hook Form y 
 * delega el guardado a la función `onSave`.
 */
export const UbicacionFormModal = ({
  isOpen,
  onClose,
  ubicacion,
  onSave,
}: UbicacionFormModalProps) => {
  const [loading, setLoading] = useState(false);
  const isEditing = !!ubicacion;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UbicacionFormValues>({
    resolver: zodResolver(ubicacionFormSchema),
    defaultValues: { nombre: "", mesh_id: "" },
    mode: "onChange",
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        nombre: ubicacion?.nombre || "",
        mesh_id: ubicacion?.mesh_id || "",
      });
      setLoading(false);
    }
  }, [isOpen, ubicacion, reset]);

  const onSubmit = async (data: UbicacionFormValues) => {
    setLoading(true);
    const success = await onSave({
      nombre: data.nombre,
      mesh_id: data.mesh_id,
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
      onConfirm={handleSubmit(onSubmit)}
      confirmText={isEditing ? "Guardar Cambios" : "Crear Ubicación"}
      confirmLoading={loading}
    >
      <VStack gap={4} align="stretch" pb={4}>
        <Field.Root invalid={!!errors.nombre}>
          <Field.Label>Nombre de la Ubicación</Field.Label>
          <Input
            {...register("nombre")}
            placeholder="Ej: EIEE - Piso 3"
            h="45px"
            borderRadius="lg"
            bg="gray.50"
          />
          {errors.nombre && <Field.ErrorText>{errors.nombre.message}</Field.ErrorText>}
        </Field.Root>

        <Field.Root invalid={!!errors.mesh_id}>
          <Field.Label>Mesh ID (MAC Address)</Field.Label>
          <Input
            {...register("mesh_id")}
            placeholder="Ej: 77:77:77:77:77:77"
            h="45px"
            borderRadius="lg"
            bg="gray.50"
          />
          {errors.mesh_id && <Field.ErrorText>{errors.mesh_id.message}</Field.ErrorText>}
        </Field.Root>
      </VStack>
    </BaseModal>
  );
};
