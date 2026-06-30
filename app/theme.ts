// app/theme.ts
import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const customConfig = defineConfig({
  theme: {
    tokens: {
      colors: {
        brand: {
          50: { value: "#e6f6fa" },
          100: { value: "#b3e1ef" },
          200: { value: "#80cbe3" },
          300: { value: "#4db5d7" },
          400: { value: "#1a9fcc" },
          500: { value: "#087ea4" }, // El azul oficial de React
          600: { value: "#066583" },
          700: { value: "#044c62" },
          800: { value: "#023341" },
          900: { value: "#011a21" },
        },
        reactBg: { value: "#f6f7f9" }, // Gris muy claro de fondo
        reactText: { value: "#23272f" }, // El negro/azul oscuro de React
      },
    },
    // Forzamos a que el sistema use estos colores por defecto
    semanticTokens: {
      colors: {
        mainBg: { value: "{colors.reactBg}" },
        mainText: { value: "{colors.reactText}" },
      },
    },
  },
});

export const system = createSystem(defaultConfig, customConfig);
