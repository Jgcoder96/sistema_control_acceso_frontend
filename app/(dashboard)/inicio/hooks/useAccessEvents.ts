import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";

export interface AccessEventData {
  id: string;
  autorizado: boolean;
  fecha: string;
  punto_acceso: string;
  ubicacion: string;
  usuario: {
    nombreCompleto: string;
    foto_url: string | null;
  } | null;
}

/**
 * Hook personalizado para la gestión de eventos de acceso en tiempo real.
 * Se encarga de obtener el historial reciente mediante REST API y de establecer
 * una conexión WebSocket para escuchar nuevos accesos de forma instantánea.
 */
export const useAccessEvents = () => {
  // --- Estados Principales ---

  const [events, setEvents] = useState<AccessEventData[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const fetchedRef = useRef(false);

  // --- Efectos Principales ---

  useEffect(() => {
    /** 
     * 1. Cargar historial antes de conectar el socket 
     * Solicita los últimos registros para llenar la vista inicialmente.
     */
    const fetchHistory = async () => {
      if (fetchedRef.current) return;
      fetchedRef.current = true;

      try {
        const token = localStorage.getItem("access_token");
        const baseUrl =
          process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";

        // Pedimos los últimos 20 registros con timestamp para evitar caché
        const res = await fetch(
          `${baseUrl}/api/firmware/logs?limit=20&_t=${Date.now()}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (res.ok) {
          const json = await res.json();
          if (json.data && Array.isArray(json.data)) {
            // Mapeamos del formato de DB al formato de AccessEventData, y los ordenamos cronológicamente (vienen desc, los queremos asc para el chat)
            const historicalEvents: AccessEventData[] = json.data.map(
              (log: {
                id: string;
                autorizado: boolean;
                fecha: string;
                punto_acceso: { nombre: string };
                ubicacion: { nombre: string };
                tarjeta?: {
                  usuario?: {
                    nombre: string;
                    apellido: string;
                    foto?: string;
                  } | null;
                } | null;
              }) => {
                return {
                  id: log.id,
                  autorizado: log.autorizado,
                  fecha: log.fecha,
                  punto_acceso: log.punto_acceso.nombre,
                  ubicacion: log.ubicacion.nombre,
                  usuario: log.tarjeta?.usuario
                    ? {
                        nombreCompleto: `${log.tarjeta.usuario.nombre} ${log.tarjeta.usuario.apellido}`,
                        foto_url: log.tarjeta.usuario.foto || null,
                      }
                    : null,
                };
              },
            );

            // Revertir para que los más viejos salgan arriba y los más recientes abajo
            setEvents(historicalEvents.reverse());
          }
        }
      } catch (error) {
        console.error("Error fetching historical events:", error);
      }
    };

    fetchHistory().then(() => {
      // 2. Conectar el socket una vez cargado el historial
      const socket: Socket = io(
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000",
      );

      socket.on("connect", () => {
        setIsConnected(true);
      });

      socket.on("disconnect", () => {
        setIsConnected(false);
      });

      socket.on("access_event", (data: AccessEventData) => {
        setEvents((prev) => {
          // Prevenir duplicados si el socket empuja algo que ya vino por REST
          if (prev.some((e) => e.id === data.id)) return prev;
          return [...prev, data];
        });
      });

      return () => {
        socket.disconnect();
      };
    });
  }, []);

  return { events, isConnected };
};
