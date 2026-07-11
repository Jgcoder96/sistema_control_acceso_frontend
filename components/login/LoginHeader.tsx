import { Stack, Heading, Text } from "@chakra-ui/react";

export const LoginHeader = () => (
  <Stack gap={2} textAlign="center" align="center">
    <Heading
      size={{ base: "2xl", md: "3xl" }}
      color="#23272f"
      letterSpacing="tight"
      fontWeight="900"
    >
      Iniciar Sesión
    </Heading>
    <Text color="gray.500" fontSize="md" fontWeight="medium">
      Introduce tus credenciales para acceder al sistema
    </Text>
  </Stack>
);
