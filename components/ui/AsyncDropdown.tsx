"use client";

import React, { useState, useEffect } from "react";
import { Box, Button, Text, Input, HStack, Spinner } from "@chakra-ui/react";
import { ChevronDown, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface AsyncDropdownOption {
  value: string;
  label: string;
}

interface AsyncDropdownProps {
  value: string;
  fetchOptions: (search: string) => Promise<AsyncDropdownOption[]>;
  onChange: (value: string) => void;
  placeholder?: string;
  width?: string | Record<string, string | number>;
  isDisabled?: boolean;
}

export const AsyncDropdown = ({
  value,
  fetchOptions,
  onChange,
  placeholder = "Seleccione una opción...",
  width = { base: "120px", md: "180px" },
  isDisabled = false,
}: AsyncDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [options, setOptions] = useState<AsyncDropdownOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Store the selected label so we can display it even if options list changes
  const [selectedLabel, setSelectedLabel] = useState(placeholder);

  // Debounced search
  useEffect(() => {
    if (!isOpen) return; // Only fetch when open

    const handler = setTimeout(async () => {
      setIsLoading(true);
      try {
        const results = await fetchOptions(searchTerm);
        setOptions(results);
      } catch (error) {
        console.error("Error fetching async options:", error);
        setOptions([]);
      } finally {
        setIsLoading(false);
      }
    }, 400);

    return () => clearTimeout(handler);
  }, [searchTerm, isOpen, fetchOptions]);

  // When value changes from outside (e.g., cleared), reset the label
  useEffect(() => {
    if (!value) {
      setSelectedLabel(placeholder);
    }
  }, [value, placeholder]);

  return (
    <Box width={width} position="relative">
      <Button
        w="full"
        h="36px"
        size="sm"
        borderRadius="full"
        bg="white"
        border="1px solid"
        borderColor="gray.200"
        fontSize="sm"
        fontWeight="normal"
        color="gray.700"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        px={4}
        _hover={{ bg: "gray.50" }}
        _active={{ bg: "gray.100" }}
        onClick={() => !isDisabled && setIsOpen(!isOpen)}
        disabled={isDisabled}
        opacity={isDisabled ? 0.6 : 1}
        cursor={isDisabled ? "not-allowed" : "pointer"}
      >
        <Text truncate>{selectedLabel}</Text>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          style={{ display: "flex", alignItems: "center" }}
        >
          <ChevronDown size={16} />
        </motion.span>
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            <Box
              position="fixed"
              top={0}
              left={0}
              right={0}
              bottom={0}
              zIndex={1500}
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.98 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              style={{
                position: "absolute",
                top: "calc(100% + 8px)",
                left: 0,
                width: "100%",
                zIndex: 1510,
              }}
            >
              <Box
                bg="white"
                borderWidth="1px"
                borderColor="blue.100"
                rounded="xl"
                boxShadow="0 16px 40px rgba(59, 130, 246, 0.12)"
                overflow="hidden"
                display="flex"
                flexDirection="column"
              >
                {/* Buscador Integrado */}
                <Box p={2} borderBottom="1px solid" borderColor="gray.100" bg="gray.50">
                  <HStack bg="white" borderRadius="md" border="1px solid" borderColor="gray.200" px={2} h="32px">
                    <Search size={14} color="var(--chakra-colors-gray-400)" />
                    <Input
                      variant="flushed"
                      size="sm"
                      placeholder="Buscar..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      fontSize="sm"
                      h="full"
                      px={1}
                      _focus={{ outline: "none" }}
                    />
                    {isLoading && <Spinner size="xs" color="blue.500" />}
                  </HStack>
                </Box>

                {/* Lista de Opciones con Scroll */}
                <Box p={1.5} maxH="160px" overflowY="auto" className="custom-scrollbar">
                  {!isLoading && options.length === 0 ? (
                    <Text fontSize="sm" color="gray.500" textAlign="center" py={4}>
                      No se encontraron resultados
                    </Text>
                  ) : (
                    options.map((option) => (
                      <Button
                        key={option.value}
                        width="full"
                        justifyContent="flex-start"
                        variant="ghost"
                        size="sm"
                        rounded="md"
                        px={3}
                        py={2.5}
                        fontSize="sm"
                        fontWeight="medium"
                        color={value === option.value ? "blue.700" : "gray.700"}
                        bg={value === option.value ? "blue.50" : "transparent"}
                        _hover={{ bg: "blue.50", color: "blue.700" }}
                        mt={1}
                        onClick={() => {
                          onChange(option.value);
                          setSelectedLabel(option.label);
                          setIsOpen(false);
                          setSearchTerm("");
                        }}
                      >
                        {option.label}
                      </Button>
                    ))
                  )}
                </Box>
              </Box>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </Box>
  );
};
