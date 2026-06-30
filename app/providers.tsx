// app/providers.tsx
"use client";

import { ChakraProvider } from "@chakra-ui/react";
import { system } from "./theme"; // Importamos nuestro tema personalizado

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    // Pasamos nuestro system personalizado
    // forcedTheme="light" asegura que siempre sea modo claro
    <ChakraProvider value={system}>{children}</ChakraProvider>
  );
}
