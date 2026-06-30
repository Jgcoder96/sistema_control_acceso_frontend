// app/login/page.tsx
"use client";

import { useState } from "react";
import {
  Box,
  Button,
  Container,
  Heading,
  Input,
  Stack,
  Text,
  Card,
  Center,
  Flex,
} from "@chakra-ui/react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Center minH="100vh" bg="#f6f7f9" px={4}>
      <Container maxW="md">
        <Card.Root
          variant="elevated"
          borderRadius="2xl"
          boxShadow="sm"
          border="1px solid"
          borderColor="gray.200"
          bg="white"
        >
          <Card.Header textAlign="left" pt={10} px={10}>
            <Heading size="3xl" fontWeight="bold" color="#23272f">
              Iniciar Sesión
            </Heading>
            <Text color="gray.600" mt={2}>
              Usa tu cuenta para continuar.
            </Text>
          </Card.Header>

          <Card.Body gap={6} px={10} pb={10}>
            <Stack gap={4}>
              {/* Email */}
              <Box>
                <Text fontWeight="bold" mb={2} fontSize="sm" color="#23272f">
                  Correo Electrónico
                </Text>
                <Input
                  placeholder="ejemplo@correo.com"
                  size="lg"
                  type="email"
                  focusRingColor="#087ea4" // Azul React
                  bg="white"
                />
              </Box>

              {/* Password */}
              <Box>
                <Flex justifyContent="space-between" mb={2}>
                  <Text fontWeight="bold" fontSize="sm" color="#23272f">
                    Contraseña
                  </Text>
                  <Text
                    fontSize="xs"
                    color="#087ea4"
                    cursor="pointer"
                    fontWeight="bold"
                  >
                    ¿Olvidaste tu contraseña?
                  </Text>
                </Flex>

                <Box position="relative">
                  <Input
                    placeholder="••••••••"
                    size="lg"
                    type={showPassword ? "text" : "password"}
                    focusRingColor="#087ea4"
                    bg="white"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    position="absolute"
                    right="1"
                    top="50%"
                    transform="translateY(-50%)"
                    onClick={() => setShowPassword(!showPassword)}
                    _hover={{ bg: "transparent" }}
                  >
                    {showPassword ? "Ocultar" : "Ver"}
                  </Button>
                </Box>
              </Box>

              <Button
                colorPalette="blue" // Si configuraste el theme.ts, usa "brand"
                style={{ backgroundColor: "#087ea4" }} // Color exacto React
                size="lg"
                mt={4}
                borderRadius="full"
                fontWeight="bold"
                _hover={{ opacity: 0.9 }}
              >
                Continuar
              </Button>
            </Stack>

            <Box textAlign="center" mt={4}>
              <Text fontSize="sm" color="gray.600">
                ¿No tienes una cuenta?{" "}
                <Text
                  as="span"
                  color="#087ea4"
                  fontWeight="bold"
                  cursor="pointer"
                >
                  Regístrate
                </Text>
              </Text>
            </Box>
          </Card.Body>
        </Card.Root>

        <Center mt={8}>
          <Text fontSize="xs" color="gray.400">
            © 2025 Tu Aplicación - Inspirado en React.dev
          </Text>
        </Center>
      </Container>
    </Center>
  );
}
