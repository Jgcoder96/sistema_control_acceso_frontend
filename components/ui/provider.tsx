"use client"

import { ChakraProvider, defaultSystem } from "@chakra-ui/react"
import {
  ColorModeProvider,
  type ColorModeProviderProps,
} from "./color-mode"

/**
 * Componente superior (Root Provider) de Chakra UI v3.
 * Orquesta el sistema de diseño principal y el proveedor de modos de color (light/dark).
 */
export function Provider(props: ColorModeProviderProps) {
  return (
    <ChakraProvider value={defaultSystem}>
      <ColorModeProvider {...props} />
    </ChakraProvider>
  )
}
