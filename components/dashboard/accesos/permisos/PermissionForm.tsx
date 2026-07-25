import React from "react";
import { VStack, Text, Input, Field } from "@chakra-ui/react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { PermissionFormValues } from "@/app/(dashboard)/accesos/permisos/schemas/permissionSchema";

interface PermissionFormProps {
  register: UseFormRegister<PermissionFormValues>;
  errors: FieldErrors<PermissionFormValues>;
}

export const PermissionForm = ({ register, errors }: PermissionFormProps) => {
  return (
    <VStack gap={4} align="stretch" w="full">
      <Text fontSize="sm" color="gray.600" mb={2}>
        Ingresa los datos para registrar un nuevo permiso en el sistema.
      </Text>
      
      <Field.Root invalid={!!errors.slug}>
        <Field.Label>Slug</Field.Label>
        <Input
          placeholder="ej: usuarios.ver"
          {...register("slug")}
          bg="gray.50"
          border="1px solid"
          borderColor="gray.200"
          _focus={{
            borderColor: "green.400",
            boxShadow: "0 0 0 1px var(--chakra-colors-green-400)",
          }}
        />
        {errors.slug && (
          <Field.ErrorText>{errors.slug.message}</Field.ErrorText>
        )}
      </Field.Root>

      <Field.Root invalid={!!errors.descripcion}>
        <Field.Label>Descripción</Field.Label>
        <Input
          placeholder="Describe la función del permiso..."
          {...register("descripcion")}
          bg="gray.50"
          border="1px solid"
          borderColor="gray.200"
          _focus={{
            borderColor: "green.400",
            boxShadow: "0 0 0 1px var(--chakra-colors-green-400)",
          }}
        />
        {errors.descripcion && (
          <Field.ErrorText>{errors.descripcion.message}</Field.ErrorText>
        )}
      </Field.Root>
    </VStack>
  );
};
