"use client";

import React, { useState } from "react";
import { Box, Button, Text, Input, HStack } from "@chakra-ui/react";
import { ChevronDown, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface AnimatedDropdownOption {
  value: string;
  label: string;
}

/** Propiedades para inicializar y controlar el AnimatedDropdown */
interface AnimatedDropdownProps {
  value: string;
  options: AnimatedDropdownOption[];
  onChange: (value: string) => void;
  width?: string | Record<string, string | number>;
  isDisabled?: boolean;
}

/**
 * Selector desplegable (Dropdown) animado y estilizado a medida.
 * Alternativa altamente personalizable al clásico componente `<select>` HTML.
 */
export const AnimatedDropdown = ({
  value,
  options,
  onChange,
  width = { base: "120px", md: "180px" },
  isDisabled = false,
}: AnimatedDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const selectedOption = options.find((opt) => opt.value === value);
  const displayLabel = selectedOption ? selectedOption.label : value;

  const filteredOptions = options.filter(
    (opt) =>
      opt.label.toLowerCase().includes(searchTerm.toLowerCase()) || opt.value === "" // Always keep the "All/Select" option
  );

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
        <Text>{displayLabel}</Text>
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
                      variant="unstyled"
                      size="sm"
                      placeholder="Buscar..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      fontSize="sm"
                      h="full"
                      px={1}
                      _focus={{ outline: "none" }}
                    />
                  </HStack>
                </Box>

                {/* Lista de Opciones con Scroll */}
                <Box p={1.5} maxH="160px" overflowY="auto" className="custom-scrollbar">
                  {filteredOptions.length > 0 ? (
                    filteredOptions.map((option, index) => (
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
                        mt={index === 0 ? 0 : 1}
                        onClick={() => {
                          onChange(option.value);
                          setIsOpen(false);
                          setSearchTerm("");
                        }}
                      >
                        {option.label}
                      </Button>
                    ))
                  ) : (
                    <Text fontSize="sm" color="gray.500" textAlign="center" py={4}>
                      No se encontraron resultados
                    </Text>
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
