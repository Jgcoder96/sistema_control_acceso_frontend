"use client";

import React, { ChangeEvent } from "react";
import { Flex, HStack, Box, Center, Input, Text } from "@chakra-ui/react";
import { Search, Plus } from "lucide-react";
import { GlobalButton } from "@/components/ui/GlobalButton";
import { AnimatedDropdown } from "@/components/ui/AnimatedDropdown";
import {
  UserQueryParams,
  UserStatusFilter,
} from "@/app/(dashboard)/accesos/usuarios/types/Usuario";

/** Parámetros para operar la barra superior de filtrado y búsqueda */
interface UserFilterBarProps {
  search: string;
  status: UserStatusFilter;
  onFilterChange: (newFilters: Partial<UserQueryParams>) => void;
  onAddClick: () => void;
}

/**
 * Barra superior de controles para la tabla de Usuarios.
 * Proporciona un buscador de texto (por cédula/nombre), un selector de estados y el botón de creación.
 */
export const UserFilterBar = ({
  search,
  status,
  onFilterChange,
  onAddClick,
}: UserFilterBarProps) => {
  /** Actualiza la búsqueda y devuelve al usuario a la página 1 */
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ search: e.target.value, page: 1 });
  };

  return (
    <Flex
      justify="space-between"
      align="center"
      gap={4}
      w="full"
      flexDirection={{ base: "column", md: "row" }}
      mb={2}
    >
      {/* Controles Izquierdos: Búsqueda y Dropdown de Estado */}
      <HStack gap={4} w={{ base: "full", md: "auto" }} flex="1">
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

      {/* Control Derecho: Botón de Alta de Usuario */}
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
    </Flex>
  );
};
