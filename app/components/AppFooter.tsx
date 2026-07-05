import { Flex, Text } from "@chakra-ui/react";

export const AppFooter = () => (
  <Flex justify="center" pb={6} pt={{ base: 4, md: 0 }}>
    {" "}
    {/* Agregamos un pt para que en móvil no se vea tan pegado al contenido */}
    <Text
      fontSize="9px"
      color="gray.400"
      fontWeight="bold"
      letterSpacing="0.3em"
      suppressHydrationWarning
    >
      UCV • EIEE • {new Date().getFullYear()}
    </Text>
  </Flex>
);
