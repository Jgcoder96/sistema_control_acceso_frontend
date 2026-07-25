"use client";

import React from "react";
import { Grid, Text, Field } from "@chakra-ui/react";
import { FormInput } from "@/components";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { UserFormValues } from "@/app/(dashboard)/accesos/usuarios/schemas";

/** Propiedades para inicializar el formulario de usuario */
interface UserFormProps {
  register: UseFormRegister<UserFormValues>;
  errors: FieldErrors<UserFormValues>;
  selectedFile: File | null;
  mode: "create" | "edit";
}

/**
 * Formulario estandarizado para la creación y edición de usuarios.
 * Gestiona el mapeo visual de campos de texto y el label para el input de tipo archivo.
 */
export const UserForm = ({
  register,
  errors,
  selectedFile,
  mode,
}: UserFormProps) => {
  return (
    <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
      <FormInput
        label="NOMBRE"
        register={register("nombre")}
        error={errors.nombre}
      />
      <FormInput
        label="APELLIDO"
        register={register("apellido")}
        error={errors.apellido}
      />
      <FormInput
        label="CÉDULA"
        register={register("cedula")}
        error={errors.cedula}
      />
      <FormInput
        label="CORREO"
        type="email"
        register={register("correo_electronico")}
        error={errors.correo_electronico}
      />
      <FormInput
        label="CONTRASEÑA"
        type="password"
        register={register("clave")}
        error={errors.clave}
        placeholder="Mín 8 caracteres"
      />
      {/* Selector de Archivo customizado para integrarse visualmente a Chakra UI */}
      <Field.Root invalid={!!errors.foto}>
        <Field.Label fontSize="xs" fontWeight="bold" color="gray.500" mb={1}>
          FOTO PERFIL
        </Field.Label>
        <Text
          fontSize="xs"
          color={selectedFile ? "green.500" : "gray.400"}
          fontWeight="medium"
        >
          {selectedFile
            ? selectedFile.name
            : mode === "edit"
              ? "Opcional"
              : "Requerida *"}
        </Text>
        {errors.foto && (
          <Field.ErrorText fontSize="xs" color="red.500" mt={1}>
            {errors.foto.message}
          </Field.ErrorText>
        )}
      </Field.Root>
    </Grid>
  );
};
