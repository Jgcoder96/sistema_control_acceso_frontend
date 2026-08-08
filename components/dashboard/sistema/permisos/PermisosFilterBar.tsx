import React from "react";
import { HStack, Input, Text, Flex, Box, Center } from "@chakra-ui/react";
import { Search, Plus } from "lucide-react";
import { PermisoFiltroEstado } from "@/app/(dashboard)/sistema/permisos/types/PermisoFisico";
import { AnimatedDropdown } from "@/components/ui/AnimatedDropdown";
import { GlobalButton } from "@/components/ui/GlobalButton";

interface PermisosFilterBarProps {
  onSearchChange: (cedula: string, puntoAcceso: string, ubicacion: string) => void;
  onStatusChange: (status: PermisoFiltroEstado) => void;
  onOpenCreate: () => void;
}

/**
 * Componente de barra de filtros para la tabla de Permisos Físicos.
 * Incluye campos de búsqueda por texto y selectores de estado, junto con
 * el botón de acción principal para crear nuevos registros.
 */
export const PermisosFilterBar = ({
  onSearchChange,
  onStatusChange,
  onOpenCreate,
}: PermisosFilterBarProps) => {
  const [cedula, setCedula] = React.useState("");
  const [puntoAcceso, setPuntoAcceso] = React.useState("");
  const [ubicacion, setUbicacion] = React.useState("");
  const [status, setStatus] = React.useState<PermisoFiltroEstado>("all");

  React.useEffect(() => {
    const handler = setTimeout(() => {
      onSearchChange(cedula, puntoAcceso, ubicacion);
    }, 400);
    return () => clearTimeout(handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cedula, puntoAcceso, ubicacion]);

  const handleStatusChange = (val: string) => {
    const newStatus = val as PermisoFiltroEstado;
    setStatus(newStatus);
    onStatusChange(newStatus);
  };

  const statusOptions = [
    { value: "all", label: "Todos los Estados" },
    { value: "active", label: "Activos" },
    { value: "deleted", label: "Eliminados" },
  ];

  return (
    <Flex
      justify="space-between"
      align={{ base: "stretch", md: "center" }}
      gap={4}
      w="full"
      flexDirection={{ base: "column", md: "row" }}
      mb={2}
    >
      <Flex
        gap={4}
        w="full"
        flex="1"
        flexDirection={{ base: "column", md: "row" }}
      >
        <Box position="relative" flex={{ base: "1", md: "none" }} width={{ base: "full", md: "200px" }}>
          <Center position="absolute" left="3" top="0" bottom="0" color="gray.400" zIndex="10">
            <Search size={16} />
          </Center>
          <Input
            placeholder="Buscar por cédula..."
            value={cedula}
            onChange={(e) => setCedula(e.target.value)}
            pl="10"
            h="36px"
            bg="white"
            borderRadius="full"
            border="1px solid"
            borderColor="gray.200"
            fontSize="sm"
            _focus={{
              borderColor: "brand.500",
              ring: "1px",
              ringColor: "brand.500",
            }}
          />
        </Box>
        <Box position="relative" flex={{ base: "1", md: "none" }} width={{ base: "full", md: "200px" }}>
          <Center position="absolute" left="3" top="0" bottom="0" color="gray.400" zIndex="10">
            <Search size={16} />
          </Center>
          <Input
            placeholder="Punto de acceso..."
            value={puntoAcceso}
            onChange={(e) => setPuntoAcceso(e.target.value)}
            pl="10"
            h="36px"
            bg="white"
            borderRadius="full"
            border="1px solid"
            borderColor="gray.200"
            fontSize="sm"
            _focus={{
              borderColor: "brand.500",
              ring: "1px",
              ringColor: "brand.500",
            }}
          />
        </Box>
        <Box position="relative" flex={{ base: "1", md: "none" }} width={{ base: "full", md: "200px" }}>
          <Center position="absolute" left="3" top="0" bottom="0" color="gray.400" zIndex="10">
            <Search size={16} />
          </Center>
          <Input
            placeholder="Ubicación..."
            value={ubicacion}
            onChange={(e) => setUbicacion(e.target.value)}
            pl="10"
            h="36px"
            bg="white"
            borderRadius="full"
            border="1px solid"
            borderColor="gray.200"
            fontSize="sm"
            _focus={{
              borderColor: "brand.500",
              ring: "1px",
              ringColor: "brand.500",
            }}
          />
        </Box>
        <Box flex={{ base: "1", md: "none" }} width={{ base: "full", md: "auto" }}>
          <AnimatedDropdown
            value={status}
            options={statusOptions}
            onChange={handleStatusChange}
            width="full"
          />
        </Box>
      </Flex>
      <GlobalButton
        color="green.600"
        hoverColor="green.700"
        size="sm"
        height="36px"
        px={5}
        w={{ base: "full", md: "auto" }}
        onClick={onOpenCreate}
      >
        <HStack gap={2} align="center">
          <Plus size={16} strokeWidth={3} />
          <Text fontSize="sm" fontWeight="bold">
            Nuevo Permiso
          </Text>
        </HStack>
      </GlobalButton>
    </Flex>
  );
};
