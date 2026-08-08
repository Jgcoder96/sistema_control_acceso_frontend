import React from "react";
import { VStack } from "@chakra-ui/react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { FormInput } from "@/components/ui/FormInput";
import { PermissionFormValues } from "@/app/(dashboard)/accesos/permisos/schemas/permissionSchema";

interface PermissionFormProps {
  register: UseFormRegister<PermissionFormValues>;
  errors: FieldErrors<PermissionFormValues>;
}

/**
 * Formulario para la creación de permisos.
 * No maneja estado interno, depende de las props inyectadas por react-hook-form.
 */
export const PermissionForm = ({ register, errors }: PermissionFormProps) => {
  return (
    <VStack gap={4} align="stretch" w="full">
      {/* Campo: Slug */}
      <FormInput
        label="SLUG"
        placeholder="ej: usuarios.ver"
        register={register("slug")}
        error={errors.slug}
      />

      {/* Campo: Descripción */}
      <FormInput
        label="DESCRIPCIÓN"
        placeholder="Describe la función del permiso..."
        register={register("descripcion")}
        error={errors.descripcion}
      />
    </VStack>
  );
};
