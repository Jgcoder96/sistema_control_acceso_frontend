import { Box, Flex, Text, Icon, Badge } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { MapPin, DoorOpen, CheckCircle2, XCircle, User } from "lucide-react";
import Image from "next/image";
import { AccessEventData } from "@/app/(dashboard)/inicio/hooks/useAccessEvents";

const MotionBox = motion.create(Box);

/**
 * Componente visual que representa una tarjeta de evento de acceso.
 * Despliega información detallada del acceso como nombre de usuario, foto,
 * estado (autorizado/denegado), punto de acceso y fecha.
 *
 * @param {AccessEventData} event - Información completa del evento registrado.
 */
export function AccessEventCard({ event }: { event: AccessEventData }) {
  const isGranted = event.autorizado;
  const userName = event.usuario?.nombreCompleto || "Desconocido";
  const avatarUrl = event.usuario?.foto_url || undefined;
  let time = event.fecha;
  try {
    const d = new Date(event.fecha);
    if (!isNaN(d.getTime())) {
      time = d.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    } else {
      time = event.fecha.includes(",")
        ? event.fecha.split(", ")[1] || event.fecha
        : event.fecha;
    }
  } catch (e) {
    time = event.fecha;
  }

  return (
    <MotionBox
      initial={{ opacity: 0, y: 40, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      alignSelf={isGranted ? "flex-start" : "flex-end"}
      w="full"
      maxW="lg"
      _hover={{ transform: "translateY(-2px)" }}
    >
      <Flex
        bg="rgba(255, 255, 255, 0.7)"
        _dark={{ bg: "rgba(31, 41, 55, 0.7)" }}
        backdropFilter="blur(16px)"
        p={5}
        borderRadius="2xl"
        boxShadow="0 4px 15px rgba(0,0,0,0.05)"
        border="1px solid"
        borderColor="whiteAlpha.500"
        gap={5}
        position="relative"
        overflow="hidden"
      >
        {/* Glow indicator */}
        <Box
          position="absolute"
          left={0}
          top={0}
          bottom={0}
          w="6px"
          bgGradient={isGranted ? "to-b" : "to-b"}
          gradientFrom={isGranted ? "green.400" : "red.400"}
          gradientTo={isGranted ? "emerald.600" : "rose.600"}
          boxShadow={
            isGranted
              ? "4px 0 15px rgba(72, 187, 120, 0.4)"
              : "4px 0 15px rgba(245, 101, 101, 0.4)"
          }
        />

        <Box pl={2}>
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={userName}
              width={56}
              height={56}
              unoptimized
              style={{
                borderRadius: "16px",
                objectFit: "cover",
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
              }}
            />
          ) : (
            <Flex
              align="center"
              justify="center"
              bgGradient="to-br"
              gradientFrom="gray.200"
              gradientTo="gray.300"
              _dark={{ gradientFrom: "gray.700", gradientTo: "gray.800" }}
              w="56px"
              h="56px"
              borderRadius="16px"
              boxShadow="0 4px 10px rgba(0,0,0,0.1)"
            >
              <Icon
                as={User}
                color="gray.500"
                _dark={{ color: "gray.400" }}
                boxSize="28px"
              />
            </Flex>
          )}
        </Box>

        <Flex direction="column" flex="1" justify="center">
          <Flex justify="space-between" align="center" mb={1.5}>
            <Text
              fontWeight="extrabold"
              fontSize="xl"
              color={isGranted ? "green.600" : "red.600"}
              _dark={{ color: isGranted ? "green.400" : "red.400" }}
              letterSpacing="tight"
            >
              {userName}
            </Text>
            <Badge
              variant="subtle"
              bg="blackAlpha.50"
              _dark={{ bg: "whiteAlpha.100" }}
              color="gray.500"
              borderRadius="md"
              px={2}
              py={0.5}
              fontSize="2xs"
              fontWeight="bold"
            >
              {time}
            </Badge>
          </Flex>

          <Flex align="center" gap={2} mb={3}>
            <Icon
              as={isGranted ? CheckCircle2 : XCircle}
              color={isGranted ? "green.500" : "red.500"}
              boxSize={4.5}
            />
            <Text
              fontSize="sm"
              fontWeight="bold"
              color={isGranted ? "green.700" : "red.700"}
              _dark={{ color: isGranted ? "green.300" : "red.300" }}
              textTransform="uppercase"
              letterSpacing="wider"
            >
              {isGranted ? "Acceso Autorizado" : "Acceso Denegado"}
            </Text>
          </Flex>

          <Flex
            align="center"
            gap={5}
            bg="blackAlpha.50"
            _dark={{ bg: "blackAlpha.300" }}
            p={2.5}
            borderRadius="lg"
          >
            <Flex
              align="center"
              gap={1.5}
              color="gray.600"
              _dark={{ color: "gray.400" }}
            >
              <Icon as={MapPin} boxSize={4} />
              <Text fontSize="xs" fontWeight="medium">
                {event.ubicacion}
              </Text>
            </Flex>
            <Box w="1px" h="12px" bg="gray.300" _dark={{ bg: "gray.600" }} />
            <Flex
              align="center"
              gap={1.5}
              color="gray.600"
              _dark={{ color: "gray.400" }}
            >
              <Icon as={DoorOpen} boxSize={4} />
              <Text fontSize="xs" fontWeight="medium">
                {event.punto_acceso}
              </Text>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </MotionBox>
  );
}
