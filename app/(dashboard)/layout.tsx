"use client";

import { Box } from "@chakra-ui/react";
import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import ProtectedNavbar from "../../components/layout/ProtectedNavbar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("access_token");

    if (!token) {
      router.replace("/login");
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setAuthorized(true);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [router]);

  if (!authorized) {
    return null;
  }

  return (
    <Box minH="100dvh" h="100dvh" bg="gray.50" minW="320px" overflow="hidden" display="flex" flexDirection="column">
      <ProtectedNavbar />
      <Box minW="0" minH={0} flex="1" overflow="auto" w="full">
        <Box w="full" px={{ base: 4, md: 6, lg: 8 }} py={{ base: 4, md: 6 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
