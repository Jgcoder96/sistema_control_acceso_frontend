import React from "react";
import { VStack, Text, Box } from "@chakra-ui/react";
import { AlertTriangle } from "lucide-react";

interface PermissionDeleteConfirmProps {
  slug: string;
}

export const PermissionDeleteConfirm = ({
  slug,
}: PermissionDeleteConfirmProps) => {
  return (
    <VStack gap={4} w="full" align="center" textAlign="center" py={4}>
      <Box color="red.500" p={4} bg="red.50" borderRadius="full">
        <AlertTriangle size={48} />
      </Box>
      <VStack gap={1}>
        <Text fontSize="lg" fontWeight="bold" color="gray.800">
          ¿Estás seguro?
        </Text>
        <Text fontSize="sm" color="gray.600">
          Esta acción eliminará el permiso{" "}
          <Text as="span" fontWeight="bold" color="red.600">
            {slug}
          </Text>{" "}
          y no se podrá deshacer.
        </Text>
      </VStack>
    </VStack>
  );
};
