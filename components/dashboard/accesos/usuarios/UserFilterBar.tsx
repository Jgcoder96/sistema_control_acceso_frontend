"use client";

import React, { ChangeEvent } from "react";
import {
  Flex,
  HStack,
  Box,
  Center,
  Input,
  Text,
  Button,
} from "@chakra-ui/react";
import { Search, Plus, X } from "lucide-react";
import { GlobalButton } from "@/components/ui/GlobalButton";
import { AnimatedDropdown } from "@/components/ui/AnimatedDropdown";
import {
  UserQueryParams,
  UserStatusFilter,
} from "@/app/(dashboard)/accesos/usuarios/types/Usuario";

/**
 * Interfaz que define las dependencias y eventos emitidos por la barra de filtrado.
 */
interface UserFilterBarProps {
  search: string;
  status: UserStatusFilter;
  onFilterChange: (newFilters: Partial<UserQueryParams>) => void;
  onAddClick: () => void;
}

/**
 * Componente superior que agrupa los controles de filtrado (Búsqueda por texto y Estado)
 * y expone la acción principal de registro para el catálogo de usuarios.
 */
export const UserFilterBar = ({
  search,
  status,
  onFilterChange,
  onAddClick,
}: UserFilterBarProps) => {
  /**
   * Invoca el evento del padre para sobreescribir los parámetros de búsqueda.
   * Por convención, una nueva búsqueda reinicia la vista a la página 1.
   * @param params - Fragmento de la entidad de query con los nuevos valores.
   */
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ search: e.target.value, page: 1 });
  };

  const handleClear = () => {
    onFilterChange({ search: "", status: "all", page: 1 });
  };

  const hasFilters = !!search || status !== "all";

  return (
    <Flex
      align="center"
      gap={4}
      w="full"
      flexDirection={{ base: "column", md: "row" }}
      mb={2}
    >
      {/* Botón de Alta */}
      <GlobalButton
        color="green.600"
        hoverColor="green.700"
        size="sm"
        height="36px"
        px={5}
        w={{ base: "full", md: "auto" }}
        onClick={onAddClick}
      >
        <HStack gap={2} align="center">
          <Plus size={16} strokeWidth={3} />
          <Text fontSize="sm" fontWeight="bold">
            Nuevo Usuario
          </Text>
        </HStack>
      </GlobalButton>

      {/* Controles: Búsqueda y Dropdown de Estado */}
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
            placeholder="Buscar por cédula..."
            value={search}
            onChange={handleSearchChange}
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

        {/* Selector de Estado (Componente Reutilizable) */}
        <AnimatedDropdown
          value={status}
          options={[
            { value: "all", label: "Todos" },
            { value: "active", label: "Activos" },
            { value: "deleted", label: "Eliminados" },
          ]}
          onChange={(val) =>
            onFilterChange({ status: val as UserStatusFilter, page: 1 })
          }
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
