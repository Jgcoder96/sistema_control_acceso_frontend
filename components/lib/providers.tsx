"use client";

import { ChakraProvider } from "@chakra-ui/react";
import { ThemeProvider } from "next-themes";
import { system } from "./theme";

/**
 * Envuelve la aplicación con los contextos globales necesarios (Chakra UI y next-themes).
 * Fija el tema por defecto en "light" y deshabilita la transición automática 
 * para prevenir parpadeos de CSS durante el renderizado inicial.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      disableTransitionOnChange
      defaultTheme="light"
      enableSystem={false}
      enableColorScheme={false}
      storageKey="theme"
    >
      <ChakraProvider value={system}>{children}</ChakraProvider>
    </ThemeProvider>
  );
}
