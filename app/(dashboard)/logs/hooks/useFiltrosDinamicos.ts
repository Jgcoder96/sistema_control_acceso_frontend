import { useState, useEffect } from "react";
import { apiFetch } from "@/utils/apiClient";
import { API_CONFIG } from "@/config/api";

export interface FiltroOpcion {
  value: string;
  label: string;
}

/**
 * Hook para obtener dinámicamente las listas de ubicaciones y puntos de acceso.
 */
export const useFiltrosDinamicos = (locationId?: string) => {
  const [ubicaciones, setUbicaciones] = useState<FiltroOpcion[]>([
    { value: "", label: "Todas las ubicaciones" },
  ]);
  const [puntosAcceso, setPuntosAcceso] = useState<FiltroOpcion[]>([
    { value: "", label: "Selecciona ubicación..." },
  ]);
  const [loading, setLoading] = useState(true);

  // Obtener ubicaciones solo al montar
  useEffect(() => {
    const fetchUbicaciones = async () => {
      try {
        setLoading(true);
        const res = await apiFetch(API_CONFIG.ENDPOINTS.UBICACIONES);
        if (res.ok) {
          const dataUbi = await res.json();
          const listaUbi = Array.isArray(dataUbi.data)
            ? dataUbi.data
            : Array.isArray(dataUbi)
              ? dataUbi
              : [];
          const mapeoUbi = listaUbi.map((u: { id: string | number; nombre?: string; name?: string }) => ({
            value: String(u.id),
            label: u.nombre || u.name || `Ubicación ${u.id}`,
          }));
          setUbicaciones([
            { value: "", label: "Todas las ubicaciones" },
            ...mapeoUbi,
          ]);
        }
      } catch (error) {
        console.error("Error obteniendo ubicaciones:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUbicaciones();
  }, []);

  // Obtener puntos de acceso al seleccionar una ubicación
  useEffect(() => {
    const fetchPuntos = async () => {
      if (!locationId) {
        setPuntosAcceso([{ value: "", label: "Selecciona ubicación..." }]);
        return;
      }

      try {
        setLoading(true);
        // Construimos el endpoint con el location parameter
        const endpoint = `${API_CONFIG.ENDPOINTS.PUNTOS_ACCESO}&location=${locationId}`;
        const res = await apiFetch(endpoint);
        if (res.ok) {
          const dataPuntos = await res.json();
          const listaPuntos = Array.isArray(dataPuntos.data)
            ? dataPuntos.data
            : Array.isArray(dataPuntos)
              ? dataPuntos
              : [];
          const mapeoPuntos = listaPuntos.map((p: { id: string | number; nombre?: string; name?: string }) => ({
            value: String(p.id),
            label: p.nombre || p.name || `Punto ${p.id}`,
          }));
          setPuntosAcceso([
            { value: "", label: "Todos los puntos" },
            ...mapeoPuntos,
          ]);
        }
      } catch (error) {
        console.error("Error obteniendo puntos de acceso:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPuntos();
  }, [locationId]);

  return { ubicaciones, puntosAcceso, loading };
};
