import React, { useState, useEffect, useCallback } from "react";
import { VStack, Text, Button, Box, Spinner, HStack, Badge, Input, Center, IconButton } from "@chakra-ui/react";
import { UserPlus, Search, ChevronLeft, ChevronRight, User } from "lucide-react";
import { BaseModal } from "@/components/dashboard/BaseModal";
import { Tarjeta } from "@/app/(dashboard)/sistema/tarjetas/types/Tarjeta";
import { API_CONFIG } from "@/config/api";
import { apiFetch } from "@/utils/apiClient";

interface TarjetaAssignModalProps {
  isOpen: boolean;
  onClose: () => void;
  tarjeta: Tarjeta | null;
  onSubmit: (id: string, usuario_id: string) => Promise<void>;
}

interface Usuario {
  id: string;
  nombre: string;
  apellido: string;
  cedula: string;
}

export const TarjetaAssignModal = ({
  isOpen,
  onClose,
  tarjeta,
  onSubmit,
}: TarjetaAssignModalProps) => {
  const [users, setUsers] = useState<Usuario[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  
  // Pagination & Search
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchCedula, setSearchCedula] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchCedula);
      setPage(1); // Reset page on new search
    }, 400);
    return () => clearTimeout(handler);
  }, [searchCedula]);

  const fetchUsers = useCallback(async () => {
    setIsLoadingUsers(true);
    try {
      const params = new URLSearchParams({
        status: "active",
        page: page.toString(),
        limit: "10",
      });
      if (debouncedSearch) {
        params.append("search", debouncedSearch);
      }
      
      const res = await apiFetch(`${API_CONFIG.ENDPOINTS.USERS}?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        const items = Array.isArray(json.data?.data) ? json.data.data : Array.isArray(json.data) ? json.data : [];
        setUsers(items);
        
        // Extract metadata safely depending on how the backend wraps it
        const extractedTotalPages = json.metadata?.totalPages || json.data?.metadata?.totalPages || 1;
        setTotalPages(extractedTotalPages);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoadingUsers(false);
    }
  }, [page, debouncedSearch]);

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
    } else {
      setUsers([]);
      setSelectedUserId("");
      setSearchCedula("");
      setDebouncedSearch("");
      setPage(1);
    }
  }, [isOpen, fetchUsers]);

  const handleClose = () => {
    onClose();
  };

  const submitHandler = async () => {
    if (!tarjeta || !selectedUserId) return;
    setIsSubmitting(true);
    try {
      await onSubmit(tarjeta.id, selectedUserId);
      handleClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!tarjeta) return null;

  return (
    <BaseModal
      open={isOpen}
      onClose={handleClose}
      title="Asignar Tarjeta"
      size="md"
      colorPalette="green"
      bodyScroll={false}
      headerExtra={
        <HStack gap={4} align="center" overflow="hidden" w="full">
          <Box p={3} borderRadius="xl" bg="green.100" color="green.600" flexShrink={0}>
            <UserPlus size={24} />
          </Box>
          <VStack align="start" gap={1} flex="1" overflow="hidden">
            <Text fontSize="xs" fontWeight="bold" textTransform="uppercase" letterSpacing="wider" color="green.600" truncate>
              Asignar Tarjeta
            </Text>
            <Text fontSize="xl" fontWeight="bold" color="gray.800" lineHeight="1.2" truncate w="full">
              {tarjeta.codigo}
            </Text>
            <HStack gap={2} mt={1} wrap="wrap">
              <Badge colorPalette="gray" variant="subtle" borderRadius="full" textTransform="none">
                ID: {tarjeta.id}
              </Badge>
            </HStack>
          </VStack>
        </HStack>
      }
      confirmText="Confirmar Asignación"
      cancelText="Cancelar"
      onConfirm={submitHandler}
      confirmLoading={isSubmitting}
      confirmDisabled={!selectedUserId}
    >
      <VStack align="stretch" gap={4} w="full" pt={4} pb={2} maxW="100%" flex="1" minH="0">
        <Box position="relative" flexShrink={0}>
          <Center position="absolute" left="3" top="0" bottom="0" color="gray.400" zIndex="10">
            <Search size={18} />
          </Center>
          <Input
            placeholder="Buscar por cédula..."
            value={searchCedula}
            onChange={(e) => setSearchCedula(e.target.value)}
            pl="10"
            h="40px"
            bg="gray.50"
            borderRadius="lg"
            border="none"
            fontSize="sm"
            _focus={{
              ring: 2,
              ringColor: "green.400",
            }}
          />
        </Box>

        <Box w="full" flex="1" minH="0" display="flex" flexDirection="column" borderWidth="1px" borderColor="gray.100" borderRadius="lg" bg="gray.50" overflow="hidden">
          {isLoadingUsers ? (
            <Center flex="1" minH="200px">
              <VStack gap={3}>
                <Spinner color="green.500" />
                <Text color="gray.500" fontSize="sm">Buscando usuarios...</Text>
              </VStack>
            </Center>
          ) : users.length === 0 ? (
            <Center flex="1" minH="200px" p={4} textAlign="center">
              <Text color="gray.500" fontSize="sm">
                No se encontraron usuarios activos.
              </Text>
            </Center>
          ) : (
            <VStack align="stretch" gap={0} overflowY="auto" flex="1" minH="0" className="custom-scrollbar">
              {users.map((u) => {
                const isSelected = selectedUserId === u.id;
                return (
                  <HStack
                    key={u.id}
                    p={3}
                    cursor="pointer"
                    borderBottomWidth="1px"
                    borderColor="gray.100"
                    bg={isSelected ? "green.50" : "white"}
                    _hover={{ bg: isSelected ? "green.100" : "gray.50" }}
                    onClick={() => setSelectedUserId(u.id)}
                    transition="all 0.2s"
                    wrap="nowrap"
                  >
                    <Box p={2} bg={isSelected ? "green.500" : "gray.100"} color={isSelected ? "white" : "gray.500"} borderRadius="full" flexShrink={0}>
                      <User size={16} />
                    </Box>
                    <VStack align="start" gap={0} flex="1" overflow="hidden">
                      <Text fontWeight={isSelected ? "bold" : "medium"} color={isSelected ? "green.800" : "gray.700"} fontSize="sm" truncate w="full">
                        {u.nombre} {u.apellido}
                      </Text>
                      <Text fontSize="xs" color="gray.500" truncate w="full">C.I: {u.cedula}</Text>
                    </VStack>
                  </HStack>
                );
              })}
            </VStack>
          )}

          {/* Modal Pagination - DataTable Style */}
          {totalPages > 0 && (
            <Box borderTop="1px solid" borderColor="gray.100" py={3} bg="white" mt="auto" flexShrink={0}>
              <Center>
                <HStack
                  gap={2}
                  bg="gray.100/50"
                  p={1}
                  borderRadius="full"
                  border="1px solid"
                  borderColor="gray.200"
                >
                  <IconButton
                    variant="ghost"
                    size="sm"
                    borderRadius="full"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    <ChevronLeft size={18} />
                  </IconButton>
                  <HStack gap={1} px={2}>
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <Button
                        key={i}
                        size="sm"
                        variant={page === i + 1 ? "solid" : "ghost"}
                        bg={page === i + 1 ? "green.500" : "transparent"}
                        color={page === i + 1 ? "white" : "gray.600"}
                        borderRadius="full"
                        minW="32px"
                        h="32px"
                        fontSize="xs"
                        onClick={() => setPage(i + 1)}
                      >
                        {i + 1}
                      </Button>
                    ))}
                  </HStack>
                  <IconButton
                    variant="ghost"
                    size="sm"
                    borderRadius="full"
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    <ChevronRight size={18} />
                  </IconButton>
                </HStack>
              </Center>
            </Box>
          )}
        </Box>
      </VStack>
    </BaseModal>
  );
};

