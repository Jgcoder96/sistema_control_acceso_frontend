import React from "react";
import {
  Input,
  Flex,
  Box,
  Center,
  HStack,
  Text,
  Button,
} from "@chakra-ui/react";
import { Search, X, Plus } from "lucide-react";
import { FestivoQueryParams } from "@/app/(dashboard)/sistema/festivos/types/Festivo";
import { AnimatedDropdown } from "@/components/ui/AnimatedDropdown";
import { GlobalButton } from "@/components/ui/GlobalButton";

interface FestivosFilterBarProps {
  filters: FestivoQueryParams;
  setFilters: React.Dispatch<React.SetStateAction<FestivoQueryParams>>;
  onOpenCreate: () => void;
}

const statusOptions = [
  { value: "all", label: "Todos" },
  { value: "active", label: "Activos" },
  { value: "deleted", label: "Eliminados" },
];

/**
 * Barra de filtrado avanzado para la tabla de Días Festivos.
 * Gestiona el debounce de la búsqueda por texto y los filtros de estado (activos/inactivos),
 * además de proveer el punto de entrada principal para crear un nuevo festivo.
 */
export const FestivosFilterBar = ({
  filters,
  setFilters,
  onOpenCreate,
}: FestivosFilterBarProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value || undefined,
      page: 1,
    }));
  };

  const handleDropdownChange = (name: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value || undefined,
      page: 1,
    }));
  };

  const handleClear = () => {
    setFilters({ page: 1, limit: 10, status: "active" });
  };

  const hasFilters = !!filters.search || filters.status !== "active";

  return (
    <Flex
      align="center"
      gap={4}
      w="full"
      flexDirection={{ base: "column", md: "row" }}
      mb={2}
    >
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
            Nuevo Feriado
          </Text>
        </HStack>
      </GlobalButton>

      <HStack gap={4} w={{ base: "full", md: "auto" }}>
        <Box
          position="relative"
          flex={{ base: "1", md: "none" }}
          width={{ md: "350px" }}
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
            placeholder="Buscar feriado..."
            name="search"
            value={filters.search || ""}
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

        <AnimatedDropdown
          value={filters.status || "all"}
          options={statusOptions}
          onChange={(val) => handleDropdownChange("status", val)}
        />
      </HStack>

      {hasFilters && (
        <Button
          size="sm"
          variant="ghost"
          colorPalette="gray"
          onClick={handleClear}
        >
          <X size={16} /> Limpiar Filtros
        </Button>
      )}
    </Flex>
  );
};
