"use client";

import React from "react";
import { Grid } from "@chakra-ui/react";
import { FormInput } from "@/components";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { RoleFormValues } from "@/app/(dashboard)/accesos/roles/schemas/roleSchema";

interface RoleFormProps {
  register: UseFormRegister<RoleFormValues>;
  errors: FieldErrors<RoleFormValues>;
}

export const RoleForm = ({
  register,
  errors,
}: RoleFormProps) => {
  return (
    <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
      <FormInput
        label="NOMBRE DEL ROL"
        register={register("nombre")}
        error={errors.nombre}
      />
      <FormInput
        label="DESCRIPCIÓN"
        register={register("descripcion")}
        error={errors.descripcion}
      />
    </Grid>
  );
};
