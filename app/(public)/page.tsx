"use client";

import { Flex, Center, Container, Stack, Button, Box } from "@chakra-ui/react";
import Link from "next/link";

import { AppFooter, PageTransition } from "../../components";
import { HomeHeader, HeroSection, AuthorDetails } from "../../components/home";

/**
 * Página de aterrizaje principal (Landing Page).
 * Agrupa y presenta los componentes visuales de inicio (Hero, Autores, Header)
 * y provee el punto de entrada principal hacia el sistema (Login).
 */
export default function HomePage() {
  return (
    <PageTransition>
      <Flex
        direction="column"
        minH="100dvh"
        w={{ base: "100vw", md: "100%" }}
        minW="320px"
        overflow="hidden"
        bg="white"
        height="100dvh"
      >
        <HomeHeader />

        <Center flex="1" px={8}>
          <Container maxW="4xl">
            <Stack gap={{ base: 10, md: 10 }} align="center" textAlign="center">
              <HeroSection />

              <AuthorDetails />

              <Box pt={4}>
                <Button
                  size="lg"
                  bg="#087ea4"
                  color="white"
                  px={10}
                  height={{ base: "54px", md: "56px" }}
                  borderRadius="full"
                  fontWeight="bold"
                  boxShadow="0 8px 20px rgba(8, 126, 164, 0.15)"
                  _hover={{ bg: "#066583", transform: "translateY(-2px)" }}
                  asChild
                >
                  <Link href="/login">Acceder al Sistema</Link>
                </Button>
              </Box>
            </Stack>
          </Container>
        </Center>

        <AppFooter />
      </Flex>
    </PageTransition>
  );
}
