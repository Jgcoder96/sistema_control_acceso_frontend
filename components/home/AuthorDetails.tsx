import { Flex, Box, Text } from "@chakra-ui/react";

/**
 * Sub-componente interno para renderizar un par clave-valor (ej. Tutor: Nombre).
 */
const InfoItem = ({ label, name }: { label: string; name: string }) => (
  <Box>
    <Text fontSize="9px" color="gray.400" fontWeight="bold" mb={1}>
      {label}
    </Text>
    <Text fontSize={{ base: "sm", md: "lg" }} fontWeight="bold" color="#23272f">
      {name}
    </Text>
  </Box>
);

/**
 * Componente visual de presentación que muestra los créditos
 * del Trabajo Especial de Grado (Autor y Tutor).
 */
export const AuthorDetails = () => (
  <Flex
    gap={{ base: 10, md: 16 }}
    direction="row"
    justify="center"
    width="full"
  >
    <InfoItem label="AUTOR" name="Br. Pérez, José" />
    <InfoItem label="TUTOR" name="Ing. Gutiérrez, Iván" />
  </Flex>
);
