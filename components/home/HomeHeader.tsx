import { Box, Flex, Stack, Text, chakra } from "@chakra-ui/react";

/**
 * Cabecera institucional de la página de inicio.
 * Contiene el membrete completo de la Universidad Central de Venezuela.
 * Oculto automáticamente en pantallas muy pequeñas (móviles).
 */
export const HomeHeader = () => (
  <Box
    as="header"
    w="full"
    px={{ base: 8, md: 16 }}
    py={6}
    borderBottom="1px solid"
    borderColor="gray.50"
    display={{ base: "none", md: "block" }}
  >
    <Flex align="center" justify="space-between" maxW="1400px" mx="auto">
      <Stack gap={0.5}>
        <Text
          fontWeight="900"
          fontSize="md"
          color="#23272f"
          letterSpacing="tight"
        >
          UNIVERSIDAD CENTRAL DE VENEZUELA
        </Text>
        <Text fontWeight="medium" fontSize="11px" color="#23272f">
          FACULTAD DE INGENIERÍA
        </Text>
        <Text fontWeight="medium" fontSize="11px" color="#23272f">
          ESCUELA DE INGENIERÍA ELÉCTRICA
        </Text>
        <Text fontWeight="medium" fontSize="11px" color="#23272f">
          DEPARTAMENTO DE ELECTRÓNICA, COMPUTACIÓN Y CONTROL
        </Text>
      </Stack>
      <chakra.img src="/logo_ucv.webp" alt="Logo UCV" width="100px" />
    </Flex>
  </Box>
);
