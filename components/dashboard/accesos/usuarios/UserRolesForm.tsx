"use client";

import React, { useState, useRef, useEffect } from "react";
import { Box, VStack, Text, Checkbox, Center, Spinner, Input, HStack } from "@chakra-ui/react";
import { Search } from "lucide-react";
import { RolUsuario } from "@/app/(dashboard)/accesos/usuarios/types/Usuario";

interface UserRolesFormProps {
  allRoles: RolUsuario[];
  loadingAllRoles: boolean;
  selectedRoleIds: string[];
  onChange: (ids: string[]) => void;
  onSearch: (term: string) => void;
}

export const UserRolesForm = ({
  allRoles,
  loadingAllRoles,
  selectedRoleIds,
  onChange,
  onSearch,
}: UserRolesFormProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      onSearch(value);
    }, 400); // 400ms debounce
  };

  const handleToggle = (roleId: string, checked: boolean) => {
    if (checked) {
      onChange([...selectedRoleIds, roleId]);
    } else {
      onChange(selectedRoleIds.filter((id) => id !== roleId));
    }
  };

  // Limpieza del temporizador al desmontar
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return (
    <VStack align="stretch" gap={4} w="full">
      <HStack justify="space-between" align="center" w="full">
        <Text fontSize="xs" fontWeight="bold" color="gray.500">
          SELECCIONA LOS ROLES A ASIGNAR
        </Text>
      </HStack>

      <HStack
        w="full"
        bg="gray.50"
        p={2.5}
        borderRadius="xl"
        border="1px solid"
        borderColor="gray.200"
        gap={2.5}
      >
        <Search size={16} color="#9CA3AF" />
        <Input
          placeholder="Buscar rol por nombre..."
          border="none"
          px={0}
          focusRing="none"
          bg="transparent"
          _focus={{ boxShadow: "none" }}
          fontSize="sm"
          value={searchTerm}
          onChange={handleSearchChange}
          w="full"
        />
      </HStack>

      {loadingAllRoles ? (
        <Center h="300px">
          <Spinner color="purple.500" size="lg" />
        </Center>
      ) : allRoles.length === 0 ? (
        <Center h="300px">
          <Text fontSize="sm" color="gray.400">
            {searchTerm
              ? "No se encontraron roles que coincidan con la búsqueda."
              : "No se encontraron roles registrados."}
          </Text>
        </Center>
      ) : (
        <VStack
          align="stretch"
          gap={3}
          h="300px"
          overflowY="auto"
          pr={2}
          css={{
            "&::-webkit-scrollbar": {
              width: "4px",
            },
            "&::-webkit-scrollbar-track": {
              background: "transparent",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "#CBD5E1",
              borderRadius: "24px",
            },
          }}
        >
          {allRoles.map((role) => {
            const isChecked = selectedRoleIds.includes(role.id);
            return (
              <Box
                key={role.id}
                p={4}
                border="1px solid"
                borderColor={isChecked ? "purple.200" : "gray.100"}
                borderRadius="xl"
                bg={isChecked ? "purple.50/20" : "white"}
                _hover={{ borderColor: "purple.300", bg: "purple.50/10" }}
                transition="all 0.2s"
              >
                <Checkbox.Root
                  checked={isChecked}
                  onCheckedChange={(details) => handleToggle(role.id, !!details.checked)}
                  colorPalette="purple"
                  size="md"
                >
                  <Checkbox.HiddenInput />
                  <Checkbox.Control />
                  <Checkbox.Label style={{ cursor: "pointer", width: "100%" }}>
                    <VStack align="start" gap={0} pl={2}>
                      <Text fontWeight="semibold" fontSize="sm" color="gray.700">
                        {role.nombre}
                      </Text>
                      <Text fontSize="xs" color="gray.500">
                        {role.descripcion}
                      </Text>
                    </VStack>
                  </Checkbox.Label>
                </Checkbox.Root>
              </Box>
            );
          })}
        </VStack>
      )}
    </VStack>
  );
};
