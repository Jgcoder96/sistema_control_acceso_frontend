"use client"; // Importante: los componentes de Chakra v3 necesitan ser Client Components

import { Button, Container, Heading, Text, Stack, Box } from "@chakra-ui/react";

export default function Home() {
  return (
    <Container maxW="container.md" py={20}>
      {/* 
          CAMBIO CLAVE: 
          'spacing' ahora es 'gap'
      */}
      <Stack gap={8} align="center" textAlign="center">
        <Box>
          <Heading size="2xl" mb={4}>
            ¡Chakra UI v3 funcionando!
          </Heading>
          <Text fontSize="lg" color="gray.600">
            Next.js App Router detectado. Los errores de spacing han sido
            corregidos usando gap.
          </Text>
        </Box>

        {/* 
            CAMBIO CLAVE: 
            En v3 se recomienda usar 'colorPalette' en lugar de 'colorScheme' 
        */}
        <Stack direction="row" gap={4}>
          <Button colorPalette="blue" variant="solid" size="lg">
            Empezar ahora
          </Button>

          <Button colorPalette="gray" variant="outline" size="lg">
            Documentación
          </Button>
        </Stack>
      </Stack>
    </Container>
  );
}
