"use client";

import { Box, Button, Center, Heading, Text, VStack } from "@chakra-ui/react";
import { ArrowLeft, Compass } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NotFoundPage() {
  const router = useRouter();

  return (
    <Center minH="100vh" bg="gray.50" p={6} position="relative" overflow="hidden">
      {/* Elementos decorativos de fondo */}
      <Box
        position="absolute"
        top="-10%"
        left="-10%"
        w="400px"
        h="400px"
        bg="brand.100"
        borderRadius="full"
        filter="blur(80px)"
        opacity="0.6"
        zIndex={0}
      />
      <Box
        position="absolute"
        bottom="-10%"
        right="-10%"
        w="400px"
        h="400px"
        bg="blue.100"
        borderRadius="full"
        filter="blur(80px)"
        opacity="0.6"
        zIndex={0}
      />

      <VStack gap={6} textAlign="center" maxW="sm" zIndex={1}>
        <Box
          bg="white"
          p={6}
          borderRadius="full"
          color="brand.500"
          shadow="lg"
          border="1px solid"
          borderColor="gray.100"
        >
          <Compass size={64} strokeWidth={1.5} />
        </Box>

        <VStack gap={2}>
          <Heading
            fontSize="5xl"
            color="gray.800"
            fontWeight="black"
            letterSpacing="tight"
            lineHeight="1"
          >
            404
          </Heading>
          <Heading size="md" color="gray.700" fontWeight="bold">
            ¡Ups! Ruta Desconocida
          </Heading>
          <Text color="gray.500" fontSize="sm">
            Te has adentrado en territorio inexplorado del sistema.
          </Text>
        </VStack>
        
        <Button
          size="md"
          variant="solid"
          bg="brand.500"
          color="white"
          _hover={{ bg: "brand.600", transform: "translateY(-1px)", shadow: "md" }}
          _active={{ transform: "translateY(0)" }}
          borderRadius="full"
          px={8}
          mt={2}
          onClick={() => router.push("/inicio")}
        >
          <ArrowLeft size={16} style={{ marginRight: "8px" }} />
          Volver al Inicio
        </Button>
      </VStack>
    </Center>
  );
}
