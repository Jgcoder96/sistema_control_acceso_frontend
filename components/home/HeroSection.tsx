import { Box, Heading, Text, chakra } from "@chakra-ui/react";

export const HeroSection = () => (
  <Box>
    <Box mb={10}>
      <Text
        fontWeight="extrabold"
        color="#087ea4"
        fontSize="10px"
        letterSpacing="0.2em"
        textTransform="uppercase"
      >
        Trabajo Especial de Grado
      </Text>
      <Box h="2px" w="30px" bg="#087ea4" mx="auto" mt={1.5} />
    </Box>

    <Heading
      as="h1"
      size={{ base: "2xl", sm: "3xl", md: "5xl" }}
      color="#23272f"
      lineHeight="1.2"
      fontWeight="900"
      letterSpacing="tight"
    >
      Diseño de un Sistema de Control de Acceso basado en el protocolo{" "}
      <chakra.span color="#087ea4">ESP-MESH</chakra.span> y Gestión en la Nube
    </Heading>
  </Box>
);
