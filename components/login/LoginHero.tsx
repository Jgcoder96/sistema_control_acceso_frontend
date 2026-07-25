import { Flex, Image } from "@chakra-ui/react";

/**
 * Componente puramente visual (Hero/Banner) que ocupa la mitad izquierda 
 * en pantallas grandes, mostrando el logotipo institucional.
 */
export const LoginHero = () => (
  <Flex
    flex="1"
    bg="gray.50"
    align="center"
    justify="center"
    p="12"
    display={{ base: "none", md: "flex" }}
  >
    <Image src="/ucv_logo_ing.png" alt="Logo UCV" width="320px" />
  </Flex>
);
