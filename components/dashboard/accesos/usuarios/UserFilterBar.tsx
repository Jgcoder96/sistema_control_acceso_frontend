"use client";

import React, { ChangeEvent } from "react";
import {
  Flex,
  HStack,
  Box,
  Center,
  Input,
  NativeSelect,
  Text,
} from "@chakra-ui/react";
import { Search, Plus } from "lucide-react";
import { GlobalButton } from "@/components/ui/GlobalButton";
import { UserQueryParams, UserStatusFilter } from "@/app/(dashboard)/accesos/usuarios/types/Usuario";

interface UserFilterBarProps {
  search: string;
  status: UserStatusFilter;
  onFilterChange: (newFilters: Partial<UserQueryParams>) => void;
  onAddClick: () => void;
}

export const UserFilterBar = ({
  search,
  status,
  onFilterChange,
  onAddClick,
}: UserFilterBarProps) => {
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ search: e.target.value, page: 1 });
  };

  const handleStatusChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ status: e.target.value as UserStatusFilter, page: 1 });
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
      <HStack gap={4} w={{ base: "full", md: "auto" }} flex="1">
        {/* Buscador por Cédula */}
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
            <Search size={18} />
          </Center>
          <Input
            placeholder="Buscar por cédula..."
            value={search}
            onChange={handleSearchChange}
            pl="11"
            h="40px"
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

        {/* Selector de Estado (API Enums) */}
        <Box width={{ base: "120px", md: "180px" }}>
          <NativeSelect.Root size="sm">
            <NativeSelect.Field
              h="40px"
              borderRadius="full"
              bg="white"
              border="1px solid"
              borderColor="gray.200"
              fontSize="sm"
              value={status}
              onChange={handleStatusChange}
              _focus={{
                borderColor: "brand.500",
                ring: "1px",
                ringColor: "brand.500",
              }}
            >
              <option value="all">Todos</option>
              <option value="active">Activos</option>
              <option value="deleted">Eliminados</option>
            </NativeSelect.Field>
            <NativeSelect.Indicator />
          </NativeSelect.Root>
        </Box>
      </HStack>

      <GlobalButton
        color="green.600"
        hoverColor="green.700"
        height="40px"
        px={6}
        w={{ base: "full", md: "auto" }}
        onClick={onAddClick}
      >
        <HStack gap={2}>
          <Plus size={18} strokeWidth={3} />
          <Text fontSize="sm" fontWeight="bold">
            Nuevo Usuario
          </Text>
        </HStack>
      </GlobalButton>
    </Flex>
  );
};
