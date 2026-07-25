"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  VStack,
  Text,
  Checkbox,
  Center,
  Spinner,
  Input,
  HStack,
} from "@chakra-ui/react";
import { Search } from "lucide-react";
import { AppPermission } from "@/app/(dashboard)/accesos/roles/types/Role";

interface RolePermissionsFormProps {
  allPermissions: AppPermission[];
  loadingAllPermissions: boolean;
  selectedPermissionIds: string[];
  onChange: (ids: string[]) => void;
  onSearch: (term: string) => void;
}

/**
 * Componente interactivo para asignar y desasignar permisos a un Rol.
 * Implementa scroll propio y un buscador con técnica "debounce" para rendimiento de API.
 */
export const RolePermissionsForm = ({
  allPermissions,
  loadingAllPermissions,
  selectedPermissionIds,
  onChange,
  onSearch,
}: RolePermissionsFormProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  /** Retrasa intencionalmente la búsqueda 400ms para no saturar al servidor al escribir rápido */
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      onSearch(value);
    }, 400);
  };

  /** Apila o quita un permiso de la lista inmutable del padre */
  const handleToggle = (permissionId: string, checked: boolean) => {
    if (checked) {
      onChange([...selectedPermissionIds, permissionId]);
    } else {
      onChange(selectedPermissionIds.filter((id) => id !== permissionId));
    }
  };

  // Limpieza del temporizador para evitar fugas de memoria
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
          SELECCIONA LOS PERMISOS A ASIGNAR
        </Text>
      </HStack>

      {/* Input de Búsqueda local o remoto (dependiendo del onSearch) */}
      <HStack
        w="full"
        bg="gray.50"
        px={3}
        h="36px"
        borderRadius="full"
        border="1px solid"
        borderColor="gray.200"
        gap={2}
      >
        <Search size={16} color="#9CA3AF" />
        <Input
          placeholder="Buscar permiso..."
          border="none"
          px={0}
          h="full"
          focusRing="none"
          bg="transparent"
          _focus={{ boxShadow: "none" }}
          fontSize="sm"
          value={searchTerm}
          onChange={handleSearchChange}
          w="full"
        />
      </HStack>

      {/* Grid de checkboxes interactivo con scroll interno para evitar alargar el modal */}
      {loadingAllPermissions ? (
        <Center h="300px">
          <Spinner color="green.500" size="lg" />
        </Center>
      ) : allPermissions.length === 0 ? (
        <Center h="300px">
          <Text fontSize="sm" color="gray.400">
            {searchTerm
              ? "No se encontraron permisos que coincidan con la búsqueda."
              : "No se encontraron permisos registrados."}
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
          {allPermissions.map((permission) => {
            const isChecked = selectedPermissionIds.includes(permission.id);
            return (
              <Box
                key={permission.id}
                p={4}
                border="1px solid"
                borderColor={isChecked ? "green.200" : "gray.100"}
                borderRadius="xl"
                bg={isChecked ? "green.50/20" : "white"}
                _hover={{ borderColor: "green.300", bg: "green.50/10" }}
                transition="all 0.2s"
              >
                <Checkbox.Root
                  checked={isChecked}
                  onCheckedChange={(details) =>
                    handleToggle(permission.id, !!details.checked)
                  }
                  colorPalette="green"
                  size="md"
                >
                  <Checkbox.HiddenInput />
                  <Checkbox.Control />
                  <Checkbox.Label style={{ cursor: "pointer", width: "100%" }}>
                    <VStack align="start" gap={0} pl={2}>
                      <Text
                        fontWeight="semibold"
                        fontSize="sm"
                        color="gray.700"
                      >
                        {permission.slug}
                      </Text>
                      {permission.descripcion && (
                        <Text fontSize="xs" color="gray.500">
                          {permission.descripcion}
                        </Text>
                      )}
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
