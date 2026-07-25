"use client";

import React, { ChangeEvent } from "react";
import { Flex, HStack, Box, Center, Input, Text } from "@chakra-ui/react";
import { Search, Plus } from "lucide-react";
import { GlobalButton } from "@/components/ui/GlobalButton";
import { AnimatedDropdown } from "@/components/ui/AnimatedDropdown";
import { RoleQueryParams } from "@/app/(dashboard)/accesos/roles/hooks/useRoles";

export type RoleStatusFilter = RoleQueryParams["status"];

interface RoleFilterBarProps {
  search: string;
  status: RoleStatusFilter;
  onFilterChange: (newFilters: Partial<RoleQueryParams>) => void;
  onAddClick: () => void;
}

/**
 * Barra superior de controles para la tabla de Roles.
 * Proporciona un buscador de texto interactivo, un selector de estados y el botón de creación.
 */
export const RoleFilterBar = ({
  search,
  status,
  onFilterChange,
  onAddClick,
}: RoleFilterBarProps) => {
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
            placeholder="Buscar por nombre..."
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

        <AnimatedDropdown
          value={status}
          options={[
            { value: "all", label: "Todos" },
            { value: "active", label: "Activos" },
            { value: "deleted", label: "Eliminados" },
          ]}
          onChange={(val) =>
            onFilterChange({ status: val as RoleStatusFilter, page: 1 })
          }
        />
      </HStack>

      {/* Control Derecho: Botón de Alta de Rol */}
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
            Nuevo Rol
          </Text>
        </HStack>
      </GlobalButton>
    </Flex>
  );
};
