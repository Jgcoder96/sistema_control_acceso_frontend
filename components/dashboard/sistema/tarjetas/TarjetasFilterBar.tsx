import React from "react";
import { HStack, Input, Text, Flex, Box, Center } from "@chakra-ui/react";
import { Search, Plus } from "lucide-react";
import { TarjetaFiltroEstado } from "@/app/(dashboard)/sistema/tarjetas/types/Tarjeta";
import { AnimatedDropdown } from "@/components/ui/AnimatedDropdown";
import { GlobalButton } from "@/components/ui/GlobalButton";

interface TarjetasFilterBarProps {
  onSearchChange: (codigo: string, cedula: string) => void;
  onStatusChange: (status: TarjetaFiltroEstado) => void;
  onOpenCreate: () => void;
}

/**
 * Barra superior de búsqueda y filtrado para la sección de Tarjetas.
 * Captura y emite los términos de búsqueda que el padre usa para recargar los datos.
 */
export const TarjetasFilterBar = ({
  onSearchChange,
  onStatusChange,
  onOpenCreate,
}: TarjetasFilterBarProps) => {
  const [codigo, setCodigo] = React.useState("");
  const [cedula, setCedula] = React.useState("");
  const [status, setStatus] = React.useState<TarjetaFiltroEstado>("all");

  React.useEffect(() => {
    const handler = setTimeout(() => {
      onSearchChange(codigo, cedula);
    }, 400);
    return () => clearTimeout(handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [codigo, cedula]);

  const handleStatusChange = (val: string) => {
    const newStatus = val as TarjetaFiltroEstado;
    setStatus(newStatus);
    onStatusChange(newStatus);
  };

  const statusOptions = [
    { value: "all", label: "Todos" },
    { value: "activable", label: "Activable" },
    { value: "activa", label: "Activa" },
    { value: "bloqueada", label: "Bloqueada" },
    { value: "perdida", label: "Perdida" },
    { value: "eliminada", label: "Eliminada" },
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
        <Box
          position="relative"
          flex={{ base: "1", md: "none" }}
          width={{ base: "full", md: "250px" }}
        >
          <Center
            position="absolute"
            left="3"
            top="0"
            bottom="0"
            color="gray.400"
            zIndex="10"
          >
            <Search size={16} />
          </Center>
          <Input
            placeholder="Buscar por código..."
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
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
        <Box
          position="relative"
          flex={{ base: "1", md: "none" }}
          width={{ base: "full", md: "200px" }}
        >
          <Center
            position="absolute"
            left="3"
            top="0"
            bottom="0"
            color="gray.400"
            zIndex="10"
          >
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
        <Box
          flex={{ base: "1", md: "none" }}
          width={{ base: "full", md: "auto" }}
        >
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
            Registrar Tarjeta
          </Text>
        </HStack>
      </GlobalButton>
    </Flex>
  );
};
