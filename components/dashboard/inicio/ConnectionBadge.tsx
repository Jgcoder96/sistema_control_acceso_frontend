import { Flex, Badge } from "@chakra-ui/react";
import { motion } from "framer-motion";

const MotionFlex = motion.create(Flex);

interface ConnectionBadgeProps {
  isConnected: boolean;
}

/**
 * Indicador visual (Badge) que muestra el estado actual de la conexión
 * por WebSockets con el backend.
 * Utiliza animaciones sutiles para resaltar el estado de conectividad.
 *
 * @param {boolean} isConnected - Estado real de la conexión con el servidor.
 */
export function ConnectionBadge({ isConnected }: ConnectionBadgeProps) {
  return (
    <MotionFlex
      animate={{ opacity: isConnected ? [0.5, 1, 0.5] : 1 }}
      transition={{ duration: 2, repeat: Infinity }}
      position="absolute"
      top={4}
      right={4}
      zIndex={10}
    >
      <Badge
        bg={isConnected ? "green.500" : "red.500"}
        color="white"
        px={3}
        py={1}
        borderRadius="full"
        boxShadow={isConnected ? "0 0 15px rgba(72, 187, 120, 0.5)" : "none"}
        textTransform="uppercase"
        fontSize="2xs"
        fontWeight="bold"
      >
        {isConnected ? "En Línea" : "Sin Conexión"}
      </Badge>
    </MotionFlex>
  );
}
