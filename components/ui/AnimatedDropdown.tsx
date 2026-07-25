"use client";

import React, { useState } from "react";
import { Box, Button, Text } from "@chakra-ui/react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface AnimatedDropdownOption {
  value: string;
  label: string;
}

interface AnimatedDropdownProps {
  value: string;
  options: AnimatedDropdownOption[];
  onChange: (value: string) => void;
  width?: any;
}

export const AnimatedDropdown = ({
  value,
  options,
  onChange,
  width = { base: "120px", md: "180px" },
}: AnimatedDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find((opt) => opt.value === value);
  const displayLabel = selectedOption ? selectedOption.label : value;

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
        onClick={() => setIsOpen(!isOpen)}
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
              zIndex={40}
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
                zIndex: 50,
              }}
            >
              <Box
                bg="white"
                borderWidth="1px"
                borderColor="blue.100"
                rounded="xl"
                boxShadow="0 16px 40px rgba(59, 130, 246, 0.12)"
                overflow="hidden"
                p={1.5}
              >
                {options.map((option, index) => (
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
                    borderTopWidth={index === 0 ? "0px" : "1px"}
                    borderTopColor="gray.100"
                    mt={index === 0 ? 0 : 1}
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                    }}
                  >
                    {option.label}
                  </Button>
                ))}
              </Box>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </Box>
  );
};
