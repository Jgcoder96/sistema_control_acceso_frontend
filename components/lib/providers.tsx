"use client";

import { ChakraProvider } from "@chakra-ui/react";
import { ThemeProvider } from "next-themes";
import { system } from "./theme";

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
