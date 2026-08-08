"use client";

import { Box } from "@chakra-ui/react";
import { useEffect, useState, type ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import ProtectedNavbar from "../../components/layout/ProtectedNavbar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("access_token");

    if (!token) {
      router.replace("/login");
      return;
    }

    const userDataStr = localStorage.getItem("user_data");
    let hasAccess = true;

    // Validación Client-Side Role-Based Access Control (RBAC)
    // Se extraen los roles del usuario y se verifican contra la ruta actual.
    if (userDataStr) {
      try {
        const userData = JSON.parse(userDataStr);
        const roles = userData.roles || [];

        // Si es superAdmin, tiene pase libre a cualquier ruta del dashboard
        const isSuperAdmin = roles.includes("superAdmin");

        if (!isSuperAdmin) {
          // Mapeo estricto de rutas principales y el rol que requieren
          // Nota: /inicio no está aquí porque es accesible por cualquier usuario logueado
          const routeRequires = [
            { path: "/accesos", role: "adminUsuarios" },
            { path: "/sistema", role: "adminSistema" },
            { path: "/logs", role: "lectorLogs" },
          ];

          // Verificamos si la ruta en la que estamos navegando choca con alguna restricción
          for (const route of routeRequires) {
            // Usamos startsWith para proteger también las sub-rutas (ej. /sistema/tarjetas)
            if (
              pathname.startsWith(route.path) &&
              !roles.includes(route.role)
            ) {
              hasAccess = false;
              router.replace("/unauthorized"); // Redirección a pantalla de acceso denegado
              break;
            }
          }
        }
      } catch (e) {
        console.error("Error parsing user_data for route protection", e);
      }
    }

    if (hasAccess) {
      const timeoutId = window.setTimeout(() => {
        setAuthorized(true);
      }, 0);

      return () => window.clearTimeout(timeoutId);
    }
  }, [router, pathname]);

  if (!authorized) {
    return null;
  }

  return (
    <Box
      minH="100dvh"
      h="100dvh"
      bg="gray.50"
      minW="320px"
      overflow="hidden"
      display="flex"
      flexDirection="column"
    >
      <ProtectedNavbar />
      <Box minW="0" minH={0} flex="1" overflow="auto" w="full">
        <Box w="full" px={{ base: 4, md: 6, lg: 8 }} py={{ base: 4, md: 6 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
