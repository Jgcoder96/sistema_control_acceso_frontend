"use client";

import React from "react";
import { Field, Input } from "@chakra-ui/react";
import { UseFormRegisterReturn, FieldError } from "react-hook-form";

interface FormInputProps {
  label: string;
  register: UseFormRegisterReturn;
  error?: FieldError;
  type?: string;
  placeholder?: string;
}

export const FormInput = ({
  label,
  register,
  error,
  type = "text",
  placeholder,
}: FormInputProps) => (
  <Field.Root invalid={!!error}>
    <Field.Label fontSize="xs" fontWeight="bold" color="gray.500">
      {label}
    </Field.Label>
    <Input
      variant="subtle"
      type={type}
      placeholder={placeholder}
      borderRadius="lg"
      h="36px"
      fontSize="sm"
      {...register}
    />
    {error && (
      <Field.ErrorText fontSize="xs" color="red.500">
        {error.message}
      </Field.ErrorText>
    )}
  </Field.Root>
);
