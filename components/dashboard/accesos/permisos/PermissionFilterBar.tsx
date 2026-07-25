import React, { ChangeEvent } from "react";
import { Flex, HStack, Box, Center, Input, Text } from "@chakra-ui/react";
import { Search, Plus } from "lucide-react";
import { GlobalButton } from "@/components/ui/GlobalButton";
import { AnimatedDropdown } from "@/components/ui/AnimatedDropdown";
import { RoleQueryParams } from "@/app/(dashboard)/accesos/roles/hooks/useRoles";

// Reutilizamos el tipo de status, asumiendo que es el mismo: "active" | "deleted" | "all"
export type PermissionStatusFilter = "active" | "deleted" | "all";

interface PermissionFilterBarProps {
  search: string;
  status: PermissionStatusFilter;
  onFilterChange: (filters: {
    search?: string;
    status?: PermissionStatusFilter;
  }) => void;
  onAddClick: () => void;
}

export const PermissionFilterBar = ({
  search,
  status,
  onFilterChange,
  onAddClick,
}: PermissionFilterBarProps) => {
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ search: e.target.value });
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
        {/* Buscador por Nombre o Slug */}
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
            placeholder="Buscar por slug o descripción..."
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

        {/* Selector de Estado */}
        <AnimatedDropdown
          value={status}
          options={[
            { value: "all", label: "Todos" },
            { value: "active", label: "Activos" },
            { value: "deleted", label: "Eliminados" },
          ]}
          onChange={(val) =>
            onFilterChange({ status: val as PermissionStatusFilter })
          }
        />
      </HStack>

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
            Nuevo Permiso
          </Text>
        </HStack>
      </GlobalButton>
    </Flex>
  );
};
