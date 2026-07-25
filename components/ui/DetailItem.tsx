"use client";

import React from "react";
import { HStack, VStack, Text, Box } from "@chakra-ui/react";

interface DetailItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

export const DetailItem = ({ icon, label, value }: DetailItemProps) => (
  <HStack gap={3} align="start">
    <Box color="gray.400" mt="1">
      {icon}
    </Box>
    <VStack align="start" gap={0}>
      <Text fontSize="10px" fontWeight="bold" color="gray.400">
        {label}
      </Text>
      <Text fontSize="sm" color="gray.700" fontWeight="medium">
        {value}
      </Text>
    </VStack>
  </HStack>
);
