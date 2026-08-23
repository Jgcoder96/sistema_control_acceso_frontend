"use client";

import { Box, Flex } from "@chakra-ui/react";
import { AnimatePresence } from "framer-motion";
import { useEffect, useRef } from "react";
import { useAccessEvents } from "./hooks/useAccessEvents";
import { AccessEventCard } from "@/components/dashboard/inicio/AccessEventCard";
import { ConnectionBadge } from "@/components/dashboard/inicio/ConnectionBadge";
import { EmptyEventsState } from "@/components/dashboard/inicio/EmptyEventsState";

/**
 * Página Principal (Dashboard de Inicio).
 * Muestra el registro en tiempo real de los accesos autorizados y denegados.
 * Depende del hook `useAccessEvents` para la carga inicial y las actualizaciones por WebSocket.
 */
export default function InicioPage() {
  const { events, isConnected } = useAccessEvents();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [events]);

  return (
    <Flex
      direction="column"
      h={{ base: "calc(100dvh - 110px)", md: "calc(100dvh - 130px)" }}
      mx={{ base: -4, md: -6, lg: -8 }}
      position="relative"
      overflow="hidden"
    >
      {/* Botón flotante de conexión */}
      <ConnectionBadge isConnected={isConnected} />

      <Box
        flex="1"
        overflowY="auto"
        bg="transparent"
        px={{ base: 4, md: 6, lg: 8 }}
        py={6}
        zIndex={1}
        css={{
          "&::-webkit-scrollbar": { width: "8px" },
          "&::-webkit-scrollbar-track": { background: "transparent" },
          "&::-webkit-scrollbar-thumb": {
            background: "rgba(0,0,0,0.1)",
            borderRadius: "10px",
          },
        }}
      >
        <Flex direction="column" gap={5}>
          <AnimatePresence>
            {events.length === 0 ? (
              <EmptyEventsState />
            ) : (
              events.map((evt) => <AccessEventCard key={evt.id} event={evt} />)
            )}
          </AnimatePresence>
          <div ref={bottomRef} />
        </Flex>
      </Box>
    </Flex>
  );
}
