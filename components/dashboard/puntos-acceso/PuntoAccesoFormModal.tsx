import React, { useState, useEffect } from "react";
import { VStack, Text, Input, Box, Field, HStack, Badge } from "@chakra-ui/react";
import { BaseModal } from "@/components/dashboard/BaseModal";
import { PuntoAcceso } from "@/app/(dashboard)/sistema/puntos-de-acceso/types/PuntoAcceso";
import { Ubicacion } from "@/app/(dashboard)/sistema/ubicaciones/types/Ubicacion";
import { useUbicaciones } from "@/app/(dashboard)/sistema/ubicaciones/hooks/useUbicaciones";
import { AnimatedDropdown } from "@/components/ui/AnimatedDropdown";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  puntoAccesoFormSchema,
  PuntoAccesoFormValues,
} from "@/app/(dashboard)/sistema/puntos-de-acceso/schemas";

interface PuntoAccesoFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  punto: PuntoAcceso | null;
  onSave: (payload: { nombre: string; mac: string; ubicacion_id: string }) => Promise<boolean>;
}

/**
 * Modal polimórfico utilizado tanto para registrar como para editar un Punto de Acceso.
 * Gestiona el formulario, las validaciones con Zod y React Hook Form y 
 * la selección de la Ubicación asociada consultando el hook respectivo.
 */
export const PuntoAccesoFormModal = ({
  isOpen,
  onClose,
  punto,
  onSave,
}: PuntoAccesoFormModalProps) => {
  const [loading, setLoading] = useState(false);
  const isEditing = !!punto;

  const { data: ubicaciones, refresh: fetchUbicaciones } = useUbicaciones();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<PuntoAccesoFormValues>({
    resolver: zodResolver(puntoAccesoFormSchema),
    defaultValues: { nombre: "", mac: "", ubicacion_id: "" },
    mode: "onChange",
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        nombre: punto?.nombre || "",
        mac: punto?.mac || "",
        ubicacion_id: punto?.ubicacion?.id || "",
      });
      setLoading(false);
      fetchUbicaciones();
    }
  }, [isOpen, punto, fetchUbicaciones, reset]);

  const onSubmit = async (data: PuntoAccesoFormValues) => {
    setLoading(true);
    const success = await onSave({
      nombre: data.nombre,
      mac: data.mac,
      ubicacion_id: data.ubicacion_id,
    });
    setLoading(false);
    if (success) {
      onClose();
    }
  };

  const ubicacionesOptions = ubicaciones.map((u) => ({ label: u.nombre, value: u.id }));

  return (
    <BaseModal
      open={isOpen}
      onClose={onClose}
      title={isEditing ? "Editar Punto de Acceso" : "Nuevo Punto de Acceso"}
      colorPalette={isEditing ? "orange" : "green"}
      size="md"
      bodyOverflow="visible"
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
              {isEditing ? "Editar Punto de Acceso" : "Nuevo Punto de Acceso"}
            </Text>
            <Text
              fontSize="2xl"
              fontWeight="bold"
              color="gray.850"
              lineHeight="1.2"
            >
              {isEditing ? (punto?.nombre || "Editar") : "Registrar Dispositivo"}
            </Text>
            <HStack gap={2} mt={1}>
              <Badge
                colorPalette={isEditing && punto?.eliminado_el ? "red" : "green"}
                variant="solid"
                borderRadius="full"
              >
                {!isEditing ? "activo" : (punto?.eliminado_el ? "inactivo" : "activo")}
              </Badge>
              {isEditing && punto?.id && (
                <Badge
                  colorPalette="gray"
                  variant="subtle"
                  borderRadius="full"
                  textTransform="none"
                >
                  <Text as="span" display={{ base: "none", sm: "inline" }}>
                    ID: {punto.id}
                  </Text>
                  <Text as="span" display={{ base: "inline", sm: "none" }}>
                    ID: {punto.id.substring(0, 8)}...
                  </Text>
                </Badge>
              )}
            </HStack>
          </VStack>
        </HStack>
      }
      onConfirm={handleSubmit(onSubmit)}
      confirmText={isEditing ? "Guardar Cambios" : "Crear Punto de Acceso"}
      confirmLoading={loading}
    >
      <VStack gap={4} align="stretch" pb={4}>
        <Field.Root invalid={!!errors.ubicacion_id}>
          <Field.Label>Ubicación Asignada</Field.Label>
          <Controller
            name="ubicacion_id"
            control={control}
            render={({ field }) => (
              <AnimatedDropdown
                value={field.value || ""}
                options={[{ value: "", label: "Selecciona una ubicación..." }, ...ubicacionesOptions]}
                onChange={field.onChange}
                width="full"
              />
            )}
          />
          {errors.ubicacion_id && <Field.ErrorText>{errors.ubicacion_id.message}</Field.ErrorText>}
        </Field.Root>

        <Field.Root invalid={!!errors.nombre}>
          <Field.Label>Nombre del Dispositivo</Field.Label>
          <Input
            {...register("nombre")}
            placeholder="Ej: Torniquete Entrada Principal"
            h="45px"
            borderRadius="lg"
            bg="gray.50"
          />
          {errors.nombre && <Field.ErrorText>{errors.nombre.message}</Field.ErrorText>}
        </Field.Root>

        <Field.Root invalid={!!errors.mac}>
          <Field.Label>Dirección MAC</Field.Label>
          <Input
            {...register("mac")}
            placeholder="Ej: AA:BB:CC:DD:EE:FF"
            h="45px"
            borderRadius="lg"
            bg="gray.50"
          />
          {errors.mac && <Field.ErrorText>{errors.mac.message}</Field.ErrorText>}
        </Field.Root>
      </VStack>
    </BaseModal>
  );
};
