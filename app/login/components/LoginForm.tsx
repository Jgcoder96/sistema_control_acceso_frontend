import React, { useState } from "react";
import { Box, Button, Input, Stack, Field, IconButton } from "@chakra-ui/react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { LoginFormValues } from "../schemas/loginSchema";

interface LoginFormProps {
  register: UseFormRegister<LoginFormValues>;
  errors: FieldErrors<LoginFormValues>;
  isSubmitting: boolean;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
}

export const LoginForm = ({
  register,
  errors,
  isSubmitting,
  onSubmit,
}: LoginFormProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form onSubmit={onSubmit} style={{ width: "100%" }}>
      <Stack gap="5" width="100%">
        <Field.Root invalid={!!errors.correo_electronico} width="100%">
          <Field.Label fontWeight="bold" mb="1" color="#23272f">
            Correo Electrónico
          </Field.Label>
          <Box position="relative" width="100%">
            <Box
              position="absolute"
              left="4"
              top="50%"
              transform="translateY(-50%)"
              zIndex="1"
              color="gray.400"
            >
              <Mail size={20} />
            </Box>
            <Input
              {...register("correo_electronico")}
              placeholder="ejemplo@correo.com"
              pl="12"
              h="14"
              bg="gray.50"
              borderWidth="1px"
              borderColor="gray.200"
              borderRadius="xl"
              width="100%"
              _focus={{ borderColor: "#087ea4", bg: "white", outline: "none" }}
            />
          </Box>
          <Field.ErrorText fontSize="xs" color="red.500">
            {errors.correo_electronico?.message}
          </Field.ErrorText>
        </Field.Root>

        <Field.Root invalid={!!errors.clave} width="100%">
          <Field.Label fontWeight="bold" mb="1" color="#23272f">
            Contraseña
          </Field.Label>
          <Box position="relative" width="100%">
            <Box
              position="absolute"
              left="4"
              top="50%"
              transform="translateY(-50%)"
              zIndex="1"
              color="gray.400"
            >
              <Lock size={20} />
            </Box>
            <Input
              {...register("clave")}
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              pl="12"
              pr="12"
              h="14"
              bg="gray.50"
              borderWidth="1px"
              borderColor="gray.200"
              borderRadius="xl"
              width="100%"
              _focus={{ borderColor: "#087ea4", bg: "white", outline: "none" }}
            />
            <IconButton
              aria-label="Ver"
              variant="ghost"
              position="absolute"
              right="2"
              top="50%"
              transform="translateY(-50%)"
              onClick={() => setShowPassword(!showPassword)}
              color="gray.500"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </IconButton>
          </Box>
          <Field.ErrorText fontSize="xs" color="red.500">
            {errors.clave?.message}
          </Field.ErrorText>
        </Field.Root>

        {/* Botón con el estilo exacto de tu HomePage */}
        <Button
          type="submit"
          bg="#087ea4" // Color exacto de tu home
          color="white"
          size="lg"
          height="56px" // Altura idéntica al botón del home
          borderRadius="full" // Borde redondo idéntico al home
          fontSize="md"
          fontWeight="bold"
          loading={isSubmitting}
          width="100%"
          mt="4" // Margen superior para separarlo de los inputs
          boxShadow="0 8px 20px rgba(8, 126, 164, 0.15)" // Sombra idéntica al home
          _hover={{
            bg: "#066583",
            transform: "translateY(-2px)",
            boxShadow: "0 12px 25px rgba(8, 126, 164, 0.25)",
          }}
          transition="all 0.3s ease" // Transición suave idéntica al home
        >
          Ingresar al Sistema
        </Button>
      </Stack>
    </form>
  );
};
