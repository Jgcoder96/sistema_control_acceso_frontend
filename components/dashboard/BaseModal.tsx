"use client";

import React from "react";
import { Dialog, Box, HStack, VStack, Text, Button } from "@chakra-ui/react";

/** Propiedades de configuración para el BaseModal */
export interface BaseModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "full" | "cover";
  colorPalette?: string;

  // Custom Header elements
  headerIcon?: React.ReactNode;
  headerBadge?: React.ReactNode;
  headerExtra?: React.ReactNode;

  // Footer options
  showFooter?: boolean;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void | Promise<void>;
  confirmLoading?: boolean;
  confirmDisabled?: boolean;
  customFooter?: React.ReactNode;

  children: React.ReactNode;
}

/**
 * Componente abstracto y estructurado de tipo Modal (Dialog Wrapper).
 * Centraliza la apariencia, espaciados y comportamientos del pie y cabecera 
 * para garantizar la uniformidad de todos los diálogos transaccionales de la aplicación.
 */
export const BaseModal = ({
  open,
  onClose,
  title,
  subtitle,
  size = "lg",
  colorPalette = "blue",
  headerIcon,
  headerBadge,
  headerExtra,
  showFooter = true,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  onConfirm,
  confirmLoading = false,
  confirmDisabled = false,
  customFooter,
  children,
}: BaseModalProps) => {
  return (
    <Dialog.Root
      open={open}
      onOpenChange={onClose}
      size={size}
      placement="center"
      motionPreset="scale"
    >
      <Dialog.Backdrop bg="blackAlpha.600" backdropFilter="blur(4px)" />
      <Dialog.Positioner p="4">
        <Dialog.Content
          borderRadius="2xl"
          bg="white"
          overflow="hidden"
          boxShadow="2xl"
          maxH="90vh"
          display="flex"
          flexDirection="column"
        >
          {/* Cabecera dinámica y adaptable */}
          <Box
            bg={`${colorPalette}.50/50`}
            p="8"
            borderBottom="1px solid"
            borderColor="gray.100"
            flexShrink={0}
          >
            {headerExtra ? (
              headerExtra
            ) : (
              <HStack
                gap={4}
                width="full"
                justify="space-between"
                align="center"
              >
                <HStack gap={4} align="center">
                  {headerIcon && (
                    <Box color={`${colorPalette}.500`} display="inline-flex">
                      {headerIcon}
                    </Box>
                  )}
                  <VStack align="start" gap={0}>
                    <Dialog.Title
                      fontSize="2xl"
                      fontWeight="bold"
                      color="gray.800"
                    >
                      {title}
                    </Dialog.Title>
                    {subtitle && (
                      <Text fontSize="xs" color="gray.500">
                        {subtitle}
                      </Text>
                    )}
                  </VStack>
                </HStack>
                {headerBadge && <Box>{headerBadge}</Box>}
              </HStack>
            )}
          </Box>

          {/* Área principal o cuerpo (Scroll independiente) */}
          <Dialog.Body p="8" display="flex" flexDirection="column" overflow="hidden">
            {children}
          </Dialog.Body>

          {/* Pie de página con acciones (Estático) */}
          {showFooter && (
            <Box
              p="6"
              borderTop="1px solid"
              borderColor="gray.100"
              bg="gray.50/50"
              flexShrink={0}
            >
              {customFooter ? (
                customFooter
              ) : (
                <HStack justify="end" gap={3}>
                  <Button
                    variant="ghost"
                    onClick={onClose}
                    borderRadius="full"
                    _hover={{ bg: "gray.100" }}
                  >
                    {cancelText}
                  </Button>
                  <Button
                    colorPalette={colorPalette}
                    borderRadius="full"
                    px={8}
                    loading={confirmLoading}
                    disabled={confirmDisabled}
                    onClick={onConfirm}
                    _hover={{ opacity: 0.9 }}
                  >
                    {confirmText}
                  </Button>
                </HStack>
              )}
            </Box>
          )}
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
};
