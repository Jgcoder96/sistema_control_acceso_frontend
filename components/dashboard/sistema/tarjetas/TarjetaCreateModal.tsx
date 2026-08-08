import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { VStack, Input, Text, Field, HStack, Box } from "@chakra-ui/react";
import { BaseModal } from "@/components/dashboard/BaseModal";
import { CreditCard } from "lucide-react";
import {
  tarjetaCreateSchema,
  TarjetaCreateValues,
} from "@/app/(dashboard)/sistema/tarjetas/schemas/tarjetaSchemas";

interface TarjetaCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TarjetaCreateValues) => Promise<void>;
}

/**
 * Componente modal para registrar en el sistema una nueva tarjeta RFID o dispositivo físico.
 * Valida que el código alfanumérico cumpla con los estándares definidos en Zod.
 */
export const TarjetaCreateModal = ({
  isOpen,
  onClose,
  onSubmit,
}: TarjetaCreateModalProps) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TarjetaCreateValues>({
    resolver: zodResolver(tarjetaCreateSchema),
    defaultValues: { codigo: "" },
    mode: "onChange",
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const submitHandler = async (data: TarjetaCreateValues) => {
    await onSubmit(data);
    handleClose();
  };

  return (
    <BaseModal
      open={isOpen}
      onClose={handleClose}
      title="Registrar Nueva Tarjeta"
      size="md"
      colorPalette="green"
      headerExtra={
        <HStack gap={4} align="center" overflow="hidden" w="full">
          <Box
            p={3}
            borderRadius="xl"
            bg="green.100"
            color="green.600"
            flexShrink={0}
          >
            <CreditCard size={24} />
          </Box>
          <VStack align="start" gap={1} flex="1" overflow="hidden">
            <Text
              fontSize="xs"
              fontWeight="bold"
              textTransform="uppercase"
              letterSpacing="wider"
              color="green.600"
              truncate
            >
              Sistema de Tarjetas
            </Text>
            <Text
              fontSize="xl"
              fontWeight="bold"
              color="gray.800"
              lineHeight="1.2"
              truncate
              w="full"
            >
              Registrar Nueva Tarjeta
            </Text>
          </VStack>
        </HStack>
      }
      confirmText="Guardar Tarjeta"
      cancelText="Cancelar"
      onConfirm={handleSubmit(submitHandler)}
      confirmLoading={isSubmitting}
    >
      <VStack align="stretch" gap={4} w="full" pt={2} pb={2}>
        <Field.Root invalid={!!errors.codigo}>
          <Field.Label fontWeight="medium" color="gray.700">
            Código RFID
          </Field.Label>
          <Controller
            name="codigo"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Ej. 0010725571"
                bg="gray.50"
                borderRadius="lg"
                border="none"
                h="40px"
                _focus={{ ring: 2, ringColor: "green.400" }}
                autoComplete="off"
              />
            )}
          />
          <Field.ErrorText>{errors.codigo?.message}</Field.ErrorText>
        </Field.Root>
      </VStack>
    </BaseModal>
  );
};
