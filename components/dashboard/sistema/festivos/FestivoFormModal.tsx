import React, { useEffect, useState } from "react";
import {
  VStack,
  HStack,
  Text,
  Field,
  Input,
  Box,
  Badge,
  Grid,
} from "@chakra-ui/react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BaseModal } from "@/components/dashboard/BaseModal";
import { AnimatedDropdown } from "@/components/ui/AnimatedDropdown";
import { Festivo } from "@/app/(dashboard)/sistema/festivos/types/Festivo";
import {
  festivoFormSchema,
  FestivoFormValues,
} from "@/app/(dashboard)/sistema/festivos/schemas/festivoFormSchema";

interface FestivoFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  festivo: Festivo | null;
  onSubmit: (data: FestivoFormValues) => Promise<boolean>;
}

const MESES_OPTIONS = [
  { value: "1", label: "Enero" },
  { value: "2", label: "Febrero" },
  { value: "3", label: "Marzo" },
  { value: "4", label: "Abril" },
  { value: "5", label: "Mayo" },
  { value: "6", label: "Junio" },
  { value: "7", label: "Julio" },
  { value: "8", label: "Agosto" },
  { value: "9", label: "Septiembre" },
  { value: "10", label: "Octubre" },
  { value: "11", label: "Noviembre" },
  { value: "12", label: "Diciembre" },
];

/**
 * Modal polimórfico utilizado tanto para registrar como para editar un Día Festivo.
 * Gestiona el formulario y las validaciones de fecha con Zod y React Hook Form.
 */
export const FestivoFormModal = ({
  isOpen,
  onClose,
  festivo,
  onSubmit,
}: FestivoFormModalProps) => {
  const [loading, setLoading] = useState(false);
  const isEditing = !!festivo;

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FestivoFormValues>({
    resolver: zodResolver(festivoFormSchema),
    defaultValues: { nombre: "", dia: 1, mes: 1, anio: undefined },
    mode: "onChange",
  });

  useEffect(() => {
    if (isOpen) {
      if (isEditing && festivo) {
        reset({
          nombre: festivo.nombre,
          dia: festivo.dia,
          mes: festivo.mes,
          anio: festivo.anio ?? undefined,
        });
      } else {
        reset({
          nombre: "",
          dia: 1,
          mes: 1,
          anio: undefined,
        });
      }
    }
  }, [isOpen, festivo, reset, isEditing]);

  const onFormSubmit: SubmitHandler<FestivoFormValues> = async (data) => {
    setLoading(true);
    // Convert to number explicitly just in case string gets passed from Input type="number"
    const payload = {
      ...data,
      dia: Number(data.dia),
      mes: Number(data.mes),
      anio: data.anio ? Number(data.anio) : null,
    };
    const success = await onSubmit(payload);
    setLoading(false);
    if (success) onClose();
  };

  return (
    <BaseModal
      open={isOpen}
      onClose={onClose}
      title={isEditing ? "Editar Feriado" : "Nuevo Feriado"}
      colorPalette={isEditing ? "orange" : "blue"}
      size="md"
      onConfirm={handleSubmit(onFormSubmit)}
      confirmText="Confirmar"
      confirmLoading={loading}
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
              color={isEditing ? "orange.600" : "blue.600"}
            >
              {isEditing ? "Editar Feriado" : "Nuevo Feriado"}
            </Text>
            <Text
              fontSize="2xl"
              fontWeight="bold"
              color="gray.850"
              lineHeight="1.2"
            >
              {isEditing ? festivo?.nombre || "Editar" : "Registrar Feriado"}
            </Text>
            <HStack gap={2} mt={1}>
              <Badge
                colorPalette={
                  isEditing && festivo?.eliminado_el ? "red" : "green"
                }
                variant="solid"
                borderRadius="full"
              >
                {!isEditing
                  ? "activo"
                  : festivo?.eliminado_el
                    ? "inactivo"
                    : "activo"}
              </Badge>
              {isEditing && festivo?.id && (
                <Badge
                  colorPalette="gray"
                  variant="subtle"
                  borderRadius="full"
                  textTransform="none"
                >
                  <Text as="span" display={{ base: "none", sm: "inline" }}>
                    ID: {festivo.id}
                  </Text>
                  <Text as="span" display={{ base: "inline", sm: "none" }}>
                    ID: {festivo.id.substring(0, 8)}...
                  </Text>
                </Badge>
              )}
            </HStack>
          </VStack>
        </HStack>
      }
      bodyOverflow="visible"
    >
      <VStack align="stretch" gap={6} pt={2} overflow="visible">
        <Field.Root invalid={!!errors.nombre}>
          <Field.Label fontWeight="semibold">Nombre del Feriado</Field.Label>
          <Input
            placeholder="Ej. Día del Trabajador"
            {...register("nombre")}
            autoFocus
          />
          <Field.ErrorText>{errors.nombre?.message}</Field.ErrorText>
        </Field.Root>

        <Box
          p={4}
          borderWidth="1px"
          borderColor="gray.200"
          borderRadius="md"
          bg="gray.50"
        >
          <Text fontWeight="semibold" mb={3} fontSize="sm" color="gray.600">
            Detalles de la Fecha
          </Text>
          <Grid templateColumns={{ base: "1fr", sm: "1fr 1fr" }} gap={4}>
            <Field.Root invalid={!!errors.dia}>
              <Field.Label fontSize="xs">Día</Field.Label>
              <Input
                type="number"
                min={1}
                max={31}
                bg="white"
                placeholder="DD"
                {...register("dia", { valueAsNumber: true })}
              />
              <Field.ErrorText>{errors.dia?.message}</Field.ErrorText>
            </Field.Root>

            <Field.Root invalid={!!errors.mes}>
              <Field.Label fontSize="xs">Mes</Field.Label>
              <Controller
                name="mes"
                control={control}
                render={({ field }) => (
                  <AnimatedDropdown
                    value={field.value ? field.value.toString() : ""}
                    options={MESES_OPTIONS}
                    onChange={(val) => field.onChange(Number(val))}
                  />
                )}
              />
              <Field.ErrorText>{errors.mes?.message}</Field.ErrorText>
            </Field.Root>

            <Field.Root invalid={!!errors.anio} gridColumn={{ sm: "span 2" }}>
              <Field.Label fontSize="xs">
                Año{" "}
                <Text as="span" color="gray.400" fontWeight="normal">
                  (Opcional para feriados recurrentes)
                </Text>
              </Field.Label>
              <Input
                type="number"
                min={2026}
                max={2100}
                bg="white"
                placeholder="AAAA (Ej. 2026)"
                {...register("anio", {
                  setValueAs: (v) =>
                    v === "" || isNaN(v) ? undefined : parseInt(v, 10),
                })}
              />
              <Field.ErrorText>{errors.anio?.message}</Field.ErrorText>
            </Field.Root>
          </Grid>
        </Box>
      </VStack>
    </BaseModal>
  );
};
