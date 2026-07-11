import { Flex, Image } from "@chakra-ui/react";

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
