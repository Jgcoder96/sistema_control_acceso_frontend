import { Box, Text, Icon } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { DoorOpen } from "lucide-react";

const MotionBox = motion.create(Box);

/**
 * Estado vacío (Empty State) para la pantalla de Inicio.
 * Se muestra al usuario cuando aún no se han registrado eventos de acceso
 * o mientras la data está en proceso inicial de carga.
 */
export function EmptyEventsState() {
  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      h="100%"
      py={20}
      color="gray.400"
    >
      <Icon as={DoorOpen} boxSize={16} mb={4} opacity={0.5} />
      <Text fontSize="xl" fontWeight="medium">
        Esperando actividad en los accesos...
      </Text>
      <Text fontSize="sm" mt={2} opacity={0.7}>
        El sistema está monitoreando en tiempo real.
      </Text>
    </MotionBox>
  );
}
