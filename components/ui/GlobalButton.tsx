"use client";

import { Button, type ButtonProps } from "@chakra-ui/react";
import { forwardRef } from "react";

interface GlobalButtonProps extends Omit<ButtonProps, "color"> {
  label?: string;
  color?: string;
  hoverColor?: string;
}

export const GlobalButton = forwardRef<HTMLButtonElement, GlobalButtonProps>(
  ({ label, color = "brand.500", hoverColor, children, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        bg={color}
        color="white"
        size="lg"
        height="56px"
        borderRadius="full"
        fontSize="md"
        fontWeight="bold"
        boxShadow="0 8px 20px rgba(8, 126, 164, 0.15)"
        _hover={{
          bg: hoverColor ?? color,
          transform: "translateY(-2px)",
          boxShadow: "0 12px 25px rgba(8, 126, 164, 0.25)",
        }}
        transition="all 0.3s ease"
        {...props}
      >
        {label ?? children}
      </Button>
    );
  },
);

GlobalButton.displayName = "GlobalButton";
