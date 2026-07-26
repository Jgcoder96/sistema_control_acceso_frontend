import { Input, Button, Flex, Box, Center } from "@chakra-ui/react";
import { Search, X } from "lucide-react";
import { LogQueryParams } from "@/app/(dashboard)/logs/types/Log";
import { AnimatedDropdown } from "@/components/ui/AnimatedDropdown";
import { useFiltrosDinamicos } from "@/app/(dashboard)/logs/hooks/useFiltrosDinamicos";

interface LogFilterBarProps {
  filters: LogQueryParams;
  setFilters: React.Dispatch<React.SetStateAction<LogQueryParams>>;
}

/**
 * Barra de filtrado para Logs.
 * Provee entradas de texto para buscar por ubicación, punto de acceso, cédula y tarjeta.
 */
export const LogFilterBar = ({ filters, setFilters }: LogFilterBarProps) => {
  const { ubicaciones, puntosAcceso } = useFiltrosDinamicos(filters.ubicacion);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value || undefined, // Si está vacío, enviamos undefined para limpiar el filtro
      page: 1, // Reiniciamos a la primera página al filtrar
    }));
  };

  const handleDropdownChange = (name: string, value: string) => {
    setFilters((prev) => {
      const nextFilters = {
        ...prev,
        [name]: value || undefined,
        page: 1,
      };

      // Si cambia la ubicación, debemos resetear el punto de acceso
      if (name === "ubicacion") {
        nextFilters.punto_acceso = undefined;
      }

      return nextFilters;
    });
  };

  const handleClear = () => {
    setFilters({ page: 1, limit: 10 });
  };

  const hasFilters =
    !!filters.ubicacion ||
    !!filters.punto_acceso ||
    !!filters.cedula ||
    !!filters.tarjeta;

  return (
    <Flex
      direction={{ base: "column", md: "row" }}
      gap={{ base: 3, md: 4 }}
      w="full"
      align={{ base: "stretch", md: "center" }}
      wrap="wrap"
      mb={2}
    >
      {/* Selector de Ubicación */}
      <Box w={{ base: "full", md: "200px" }}>
        <AnimatedDropdown
          value={filters.ubicacion || ""}
          options={ubicaciones}
          onChange={(val) => handleDropdownChange("ubicacion", val)}
          width="full"
        />
      </Box>

      {/* Selector de Punto de Acceso (dependiente de ubicación) */}
      <Box w={{ base: "full", md: "200px" }}>
        <AnimatedDropdown
          value={filters.punto_acceso || ""}
          options={puntosAcceso}
          onChange={(val) => handleDropdownChange("punto_acceso", val)}
          isDisabled={!filters.ubicacion}
          width="full"
        />
      </Box>

      {/* Búsqueda por Cédula (estilo unificado) */}
      <Box
        position="relative"
        flex={{ base: "1", md: "none" }}
        w={{ base: "full", md: "220px" }}
      >
        <Center
          position="absolute"
          left="4"
          top="0"
          bottom="0"
          color="gray.400"
          zIndex="10"
        >
          <Search size={16} />
        </Center>
        <Input
          placeholder="Buscar cédula..."
          name="cedula"
          value={filters.cedula || ""}
          onChange={handleChange}
          pl="11"
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

      {/* Búsqueda por Tarjeta (estilo unificado) */}
      <Box
        position="relative"
        flex={{ base: "1", md: "none" }}
        w={{ base: "full", md: "220px" }}
      >
        <Center
          position="absolute"
          left="4"
          top="0"
          bottom="0"
          color="gray.400"
          zIndex="10"
        >
          <Search size={16} />
        </Center>
        <Input
          placeholder="Buscar tarjeta..."
          name="tarjeta"
          value={filters.tarjeta || ""}
          onChange={handleChange}
          pl="11"
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

      {hasFilters && (
        <Button
          size="sm"
          variant="ghost"
          colorPalette="gray"
          onClick={handleClear}
          w={{ base: "full", md: "auto" }}
          mt={{ base: 1, md: 0 }}
        >
          <X size={16} /> Limpiar Filtros
        </Button>
      )}
    </Flex>
  );
};
