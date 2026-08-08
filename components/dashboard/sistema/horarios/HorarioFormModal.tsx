import React, { useEffect, useState } from "react";
import {
  VStack,
  HStack,
  Button,
  Text,
  Field,
  Input,
  Box,
  IconButton,
  Grid,
  Badge,
} from "@chakra-ui/react";
import { Plus, Trash2 } from "lucide-react";
import {
  useForm,
  useFieldArray,
  Controller,
  SubmitHandler,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BaseModal } from "@/components/dashboard/BaseModal";
import { AnimatedDropdown } from "@/components/ui/AnimatedDropdown";
import { Horario } from "@/app/(dashboard)/sistema/horarios/types/Horario";
import {
  horarioFormSchema,
  HorarioFormValues,
} from "@/app/(dashboard)/sistema/horarios/schemas/horarioFormSchema";

interface HorarioFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  horario: Horario | null;
  onSubmit: (data: HorarioFormValues) => Promise<boolean>;
}

const DAYS_OPTIONS = [
  { value: "lunes", label: "Lunes" },
  { value: "martes", label: "Martes" },
  { value: "miercoles", label: "Miércoles" },
  { value: "jueves", label: "Jueves" },
  { value: "viernes", label: "Viernes" },
  { value: "sabado", label: "Sábado" },
  { value: "domingo", label: "Domingo" },
  { value: "festivo", label: "Días Festivos" },
];

const parseTime12To24 = (timeStr: string) => {
  if (!timeStr) return "";
  if (/^([01]\d|2[0-3]):([0-5]\d)(:([0-5]\d))?$/.test(timeStr))
    return timeStr.substring(0, 5);
  const match = timeStr.match(/(\d{1,2}):(\d{2})\s*([aApP])/i);
  if (match) {
    const [, h, m, ampm] = match;
    let hours = parseInt(h, 10);
    if (ampm.toLowerCase() === "p" && hours < 12) hours += 12;
    if (ampm.toLowerCase() === "a" && hours === 12) hours = 0;
    return `${hours.toString().padStart(2, "0")}:${m}`;
  }
  return timeStr;
};

/**
 * Modal polimórfico interactivo para Crear o Editar un Horario.
 * Utiliza `react-hook-form` y Zod para la gestión y validación del estado del formulario,
 * y permite agregar/eliminar bloques de configuración de horas dinámicamente (`useFieldArray`).
 */
export const HorarioFormModal = ({
  isOpen,
  onClose,
  horario,
  onSubmit,
}: HorarioFormModalProps) => {
  const [loading, setLoading] = useState(false);
  const isEditing = !!horario;

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<HorarioFormValues>({
    resolver: zodResolver(horarioFormSchema),
    defaultValues: { nombre: "", detalles: [] },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "detalles",
  });

  useEffect(() => {
    if (isOpen) {
      if (isEditing && horario) {
        reset({
          nombre: horario.nombre,
          detalles: horario.horario_detalles.map((d) => ({
            dia_semana: d.es_festivo ? "festivo" : d.dia_semana,
            hora_inicio: parseTime12To24(d.hora_inicio),
            hora_fin: parseTime12To24(d.hora_fin),
            es_festivo: d.es_festivo,
          })),
        });
      } else {
        reset({
          nombre: "",
          detalles: [
            {
              dia_semana: "lunes",
              hora_inicio: "08:00",
              hora_fin: "17:00",
              es_festivo: false,
            },
          ],
        });
      }
    }
  }, [isOpen, horario, reset, isEditing]);

  const onFormSubmit: SubmitHandler<HorarioFormValues> = async (data) => {
    setLoading(true);
    const payload = {
      ...data,
      detalles: data.detalles.map((d) => ({
        dia_semana: d.dia_semana === "festivo" ? undefined : d.dia_semana,
        es_festivo: d.dia_semana === "festivo",
        hora_inicio:
          d.hora_inicio.length === 5 ? `${d.hora_inicio}:00` : d.hora_inicio,
        hora_fin: d.hora_fin.length === 5 ? `${d.hora_fin}:00` : d.hora_fin,
      })),
    };
    const success = await onSubmit(payload);
    setLoading(false);
    if (success) onClose();
  };

  return (
    <BaseModal
      open={isOpen}
      onClose={onClose}
      title={isEditing ? "Editar Horario" : "Nuevo Horario"}
      colorPalette={isEditing ? "orange" : "blue"}
      size="xl"
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
              {isEditing ? "Editar Horario" : "Nuevo Horario"}
            </Text>
            <Text
              fontSize="2xl"
              fontWeight="bold"
              color="gray.850"
              lineHeight="1.2"
            >
              {isEditing ? horario?.nombre || "Editar" : "Registrar Horario"}
            </Text>
            <HStack gap={2} mt={1}>
              <Badge
                colorPalette={
                  isEditing && horario?.eliminado_el ? "red" : "green"
                }
                variant="solid"
                borderRadius="full"
              >
                {!isEditing
                  ? "activo"
                  : horario?.eliminado_el
                    ? "inactivo"
                    : "activo"}
              </Badge>
              {isEditing && horario?.id && (
                <Badge
                  colorPalette="gray"
                  variant="subtle"
                  borderRadius="full"
                  textTransform="none"
                >
                  <Text as="span" display={{ base: "none", sm: "inline" }}>
                    ID: {horario.id}
                  </Text>
                  <Text as="span" display={{ base: "inline", sm: "none" }}>
                    ID: {horario.id.substring(0, 8)}...
                  </Text>
                </Badge>
              )}
            </HStack>
          </VStack>
        </HStack>
      }
      bodyScroll={false}
    >
      <VStack align="stretch" gap={6} pt={2} flex="1" minH="0">
        <Field.Root invalid={!!errors.nombre} flexShrink={0}>
          <Field.Label fontWeight="semibold">Nombre del Horario</Field.Label>
          <Input
            placeholder="Ej. Horario de Oficina"
            {...register("nombre")}
            autoFocus
          />
          <Field.ErrorText>{errors.nombre?.message}</Field.ErrorText>
        </Field.Root>

        <Box display="flex" flexDirection="column" flex="1" minH="0">
          <HStack justify="space-between" mb={2} flexShrink={0}>
            <Text fontWeight="semibold">Días Configurados</Text>
            <Button
              size="sm"
              colorPalette="green"
              variant="solid"
              borderRadius="full"
              px={4}
              boxShadow="sm"
              _hover={{ transform: "translateY(-1px)", boxShadow: "md" }}
              transition="all 0.2s"
              onClick={() =>
                append({
                  dia_semana: "lunes",
                  hora_inicio: "08:00",
                  hora_fin: "17:00",
                  es_festivo: false,
                })
              }
            >
              <Plus size={14} style={{ marginRight: 4 }} /> Agregar Día
            </Button>
          </HStack>

          {errors.detalles?.root && (
            <Text fontSize="sm" color="red.500" mb={2} flexShrink={0}>
              {errors.detalles.root.message}
            </Text>
          )}

          <VStack
            align="stretch"
            gap={3}
            pb={16}
            flex="1"
            minH="0"
            overflowY="auto"
            overflowX="hidden"
            pr={2}
            css={{
              "&::-webkit-scrollbar": { width: "6px" },
              "&::-webkit-scrollbar-track": { background: "transparent" },
              "&::-webkit-scrollbar-thumb": {
                background: "#CBD5E1",
                borderRadius: "10px",
              },
            }}
          >
            {fields.map((field, index) => (
              <Box
                key={field.id}
                p={3}
                borderWidth="1px"
                borderColor="gray.200"
                borderRadius="md"
                bg="gray.50"
              >
                <Grid
                  templateColumns={{ base: "1fr", md: "2fr 1fr 1fr auto" }}
                  gap={3}
                  alignItems="end"
                >
                  <Field.Root invalid={!!errors.detalles?.[index]?.dia_semana}>
                    <Field.Label fontSize="xs">Día</Field.Label>
                    <Controller
                      name={`detalles.${index}.dia_semana`}
                      control={control}
                      render={({ field }) => (
                        <AnimatedDropdown
                          value={field.value || ""}
                          options={DAYS_OPTIONS}
                          onChange={field.onChange}
                        />
                      )}
                    />
                  </Field.Root>

                  <Field.Root invalid={!!errors.detalles?.[index]?.hora_inicio}>
                    <Field.Label fontSize="xs">Desde</Field.Label>
                    <Input
                      type="time"
                      bg="white"
                      {...register(`detalles.${index}.hora_inicio`)}
                    />
                  </Field.Root>

                  <Field.Root invalid={!!errors.detalles?.[index]?.hora_fin}>
                    <Field.Label fontSize="xs">Hasta</Field.Label>
                    <Input
                      type="time"
                      bg="white"
                      {...register(`detalles.${index}.hora_fin`)}
                    />
                  </Field.Root>

                  <IconButton
                    aria-label="Eliminar"
                    colorPalette="red"
                    variant="ghost"
                    onClick={() => remove(index)}
                    disabled={fields.length === 1}
                  >
                    <Trash2 size={16} />
                  </IconButton>
                </Grid>
                {(errors.detalles?.[index]?.hora_inicio ||
                  errors.detalles?.[index]?.hora_fin) && (
                  <Text fontSize="xs" color="red.500" mt={1}>
                    Revise las horas ingresadas.
                  </Text>
                )}
              </Box>
            ))}
          </VStack>
        </Box>
      </VStack>
    </BaseModal>
  );
};
