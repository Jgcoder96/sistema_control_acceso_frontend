import React from "react";
import {
  VStack,
  SimpleGrid,
  Box,
  HStack,
  Text,
  Button,
  Avatar,
  Center,
} from "@chakra-ui/react";
import {
  Eye,
  User,
  Calendar,
  MapPin,
  Radio,
  Fingerprint,
  Mail,
  CreditCard,
  Key,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import { BaseModal } from "@/components/dashboard/BaseModal";
import { Log } from "@/app/(dashboard)/logs/types/Log";

interface LogDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  log: Log | null;
}

export const LogDetailModal = ({
  isOpen,
  onClose,
  log,
}: LogDetailModalProps) => {
  if (!log) return null;

  const ubiName =
    typeof log.ubicacion === "object" && log.ubicacion !== null
      ? log.ubicacion.nombre
      : log.ubicacion;
  const ptoName =
    typeof log.punto_acceso === "object" && log.punto_acceso !== null
      ? log.punto_acceso.nombre
      : log.punto_acceso;

  const tarjeta =
    typeof log.tarjeta === "object" && log.tarjeta !== null
      ? log.tarjeta
      : null;
  const usuario = tarjeta ? tarjeta.usuario : null;
  const tarjetaCodigo = tarjeta ? tarjeta.codigo : null;

  const estadoTexto = log.autorizado ? "Acceso Concedido" : "Acceso Denegado";

  return (
    <BaseModal
      open={isOpen}
      onClose={onClose}
      title="Registro de Auditoría"
      subtitle="Detalles completos del evento de acceso"
      headerIcon={<Eye />}
      size="xl"
      customFooter={
        <HStack justify="end" w="full">
          <Button
            colorPalette="blue"
            borderRadius="full"
            onClick={onClose}
            px={8}
          >
            Cerrar
          </Button>
        </HStack>
      }
    >
      <VStack gap={3} align="stretch" pb={0}>
        {/* Fila Superior: Estado y Perfil */}
        <SimpleGrid columns={{ base: 1, md: 2 }} gap={3}>
          {/* Tarjeta de Estado y Fecha */}
          <Box
            bg={log.autorizado ? "green.50" : "red.50"}
            border="1px solid"
            borderColor={log.autorizado ? "green.200" : "red.200"}
            borderRadius="xl"
            p={3}
          >
            <Text
              fontSize="xs"
              color="gray.500"
              fontWeight="bold"
              textTransform="uppercase"
              letterSpacing="wider"
              mb={2}
            >
              Estado del Acceso
            </Text>

            <VStack align="start" gap={3}>
              <HStack gap={3}>
                <Center
                  p={1.5}
                  bg={log.autorizado ? "green.100" : "red.100"}
                  borderRadius="full"
                  color={log.autorizado ? "green.600" : "red.600"}
                >
                  {log.autorizado ? (
                    <ShieldCheck size={16} />
                  ) : (
                    <ShieldAlert size={16} />
                  )}
                </Center>
                <Text
                  fontSize="sm"
                  fontWeight="bold"
                  color={log.autorizado ? "green.700" : "red.700"}
                >
                  {estadoTexto}
                </Text>
              </HStack>

              <Box
                w="full"
                borderTop="1px solid"
                borderColor={log.autorizado ? "green.200" : "red.200"}
                pt={2}
              >
                <HStack
                  color={log.autorizado ? "green.600" : "red.600"}
                  gap={1}
                  mb={0.5}
                >
                  <Calendar size={12} />
                  <Text fontSize="xs" fontWeight="bold" letterSpacing="wider">
                    FECHA Y HORA
                  </Text>
                </HStack>
                <Text
                  fontSize="sm"
                  fontWeight="bold"
                  color={log.autorizado ? "green.800" : "red.800"}
                >
                  {log.fecha}
                </Text>
              </Box>
            </VStack>
          </Box>

          {/* Tarjeta de Usuario */}
          <Box
            border="1px solid"
            borderColor="gray.200"
            borderRadius="xl"
            p={3}
            bg="gray.50"
            shadow="sm"
          >
            <Text
              fontSize="xs"
              color="gray.500"
              fontWeight="bold"
              textTransform="uppercase"
              letterSpacing="wider"
              mb={2}
            >
              Perfil del Usuario
            </Text>

            <HStack gap={3} align="start">
              <Avatar.Root
                size="md"
                shape={usuario ? "full" : "rounded"}
                colorPalette={usuario ? "blue" : "gray"}
              >
                <Avatar.Image src={usuario?.foto || undefined} />
                <Avatar.Fallback
                  name={
                    usuario?.nombre
                      ? `${usuario.nombre} ${usuario.apellido || ""}`
                      : undefined
                  }
                >
                  {!usuario && <User size={20} opacity={0.6} />}
                </Avatar.Fallback>
              </Avatar.Root>

              <VStack align="start" gap={1} flex="1" justify="center" h="full">
                <Text fontSize="sm" fontWeight="bold" color="gray.800">
                  {usuario
                    ? `${usuario.nombre} ${usuario.apellido || ""}`
                    : tarjeta
                      ? "Tarjeta Sin Asignar"
                      : "Usuario Desconocido"}
                </Text>

                <VStack align="start" gap={1} mt={1}>
                  {usuario?.cedula && (
                    <HStack color="gray.500" fontSize="xs">
                      <Fingerprint size={12} />{" "}
                      <Text>CI: {usuario.cedula}</Text>
                    </HStack>
                  )}
                  {usuario?.correo && (
                    <HStack color="gray.500" fontSize="xs">
                      <Mail size={12} /> <Text>{usuario.correo}</Text>
                    </HStack>
                  )}
                  {!usuario && (
                    <Text fontSize="xs" color="gray.400" fontStyle="italic">
                      Sin información de contacto.
                    </Text>
                  )}
                </VStack>
              </VStack>
            </HStack>
          </Box>
        </SimpleGrid>

        {/* Tarjetas de Detalles del Sistema */}
        <SimpleGrid columns={{ base: 1, md: 2 }} gap={3}>
          {/* Datos de Autenticación */}
          <Box
            border="1px solid"
            borderColor="gray.200"
            borderRadius="xl"
            p={3}
            bg="gray.50"
          >
            <Text
              fontSize="xs"
              color="gray.500"
              fontWeight="bold"
              textTransform="uppercase"
              letterSpacing="wider"
              mb={3}
            >
              Datos de Autenticación
            </Text>

            <VStack align="start" gap={3}>
              <Box>
                <Text fontSize="xs" color="gray.500" mb={0.5}>
                  ID Tarjeta Pasada (RAW)
                </Text>
                <HStack>
                  <CreditCard size={14} color="var(--chakra-colors-blue-500)" />
                  <Text fontSize="sm" fontWeight="bold" color="gray.800">
                    {log.codigo_tarjeta_raw || "N/A"}
                  </Text>
                </HStack>
              </Box>
              <Box>
                <Text fontSize="xs" color="gray.500" mb={0.5}>
                  Tarjeta Vinculada al Sistema
                </Text>
                <HStack>
                  <Key size={14} color="var(--chakra-colors-blue-500)" />
                  <Text fontSize="sm" fontWeight="bold" color="gray.800">
                    {tarjetaCodigo || "Ninguna"}
                  </Text>
                </HStack>
              </Box>
            </VStack>
          </Box>

          {/* Datos de Ubicación */}
          <Box
            border="1px solid"
            borderColor="gray.200"
            borderRadius="xl"
            p={3}
            bg="gray.50"
          >
            <Text
              fontSize="xs"
              color="gray.500"
              fontWeight="bold"
              textTransform="uppercase"
              letterSpacing="wider"
              mb={3}
            >
              Lugar del Evento
            </Text>

            <VStack align="start" gap={3}>
              <Box>
                <Text fontSize="xs" color="gray.500" mb={0.5}>
                  Ubicación / Piso
                </Text>
                <HStack>
                  <MapPin size={14} color="var(--chakra-colors-orange-500)" />
                  <Text fontSize="sm" fontWeight="bold" color="gray.800">
                    {ubiName || "N/A"}
                  </Text>
                </HStack>
              </Box>
              <Box>
                <Text fontSize="xs" color="gray.500" mb={0.5}>
                  Punto de Acceso Específico
                </Text>
                <HStack>
                  <Radio size={14} color="var(--chakra-colors-purple-500)" />
                  <Text fontSize="sm" fontWeight="bold" color="gray.800">
                    {ptoName || "N/A"}
                  </Text>
                </HStack>
              </Box>
            </VStack>
          </Box>
        </SimpleGrid>

        {log.detalles && (
          <Box
            border="1px solid"
            borderColor="orange.200"
            borderRadius="xl"
            p={3}
            bg="orange.50"
          >
            <Text
              fontSize="xs"
              color="orange.600"
              fontWeight="bold"
              textTransform="uppercase"
              letterSpacing="wider"
              mb={1}
            >
              Detalles Adicionales
            </Text>
            <Text fontSize="xs" color="orange.800">
              {log.detalles}
            </Text>
          </Box>
        )}
      </VStack>
    </BaseModal>
  );
};
