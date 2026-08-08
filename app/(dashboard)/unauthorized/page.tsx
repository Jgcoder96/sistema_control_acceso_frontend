"use client";

import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  VStack,
  Icon,
} from "@chakra-ui/react";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

/**
 * Pantalla de Acceso Denegado (403 Forbidden simulado).
 * Se muestra cuando el middleware del Layout detecta que el usuario
 * intentó forzar la navegación por URL hacia un módulo para el que
 * no tiene los roles (RBAC) requeridos.
 */
export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <Flex
      w="full"
      h="calc(100vh - 120px)"
      align="center"
      justify="center"
      px={4}
    >
      <Box
        bg="white"
        p={8}
        borderRadius="xl"
        boxShadow="xl"
        textAlign="center"
        maxW="md"
        w="full"
      >
        <VStack gap={6}>
          <Box
            w="80px"
            h="80px"
            bg="red.50"
            borderRadius="full"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Icon as={ShieldAlert} w={10} h={10} color="red.500" />
          </Box>

          <Box>
            <Heading size="lg" color="gray.800" mb={2}>
              Acceso Denegado
            </Heading>
            <Text color="gray.500" fontSize="md">
              No tienes los permisos necesarios para acceder a este módulo. Si
              crees que esto es un error, contacta a un administrador.
            </Text>
          </Box>

          <Button
            size="lg"
            color="white"
            bg="brand.500"
            _hover={{ bg: "brand.600" }}
            w="full"
            borderRadius="full"
            onClick={() => router.push("/inicio")}
          >
            <ArrowLeft size={20} style={{ marginRight: "8px" }} />
            Volver al Inicio
          </Button>
        </VStack>
      </Box>
    </Flex>
  );
}
