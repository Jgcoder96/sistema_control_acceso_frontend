import { useState, useMemo } from "react";
import { Usuario } from "../types/Usuario";

/**
 * Hook auxiliar para filtrar arreglos de usuarios en el cliente (frontend).
 * Es útil si se tiene una lista pre-cargada y se desea buscar sin golpear la API.
 * (Nota: El sistema principal de la pantalla de usuarios usa paginación en backend vía useUsers).
 */
export function useUserFilters(usuarios: Usuario[]) {
  const [busqueda, setBusqueda] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("todos");

  /** Lista computada y memorizada de usuarios que coinciden con los filtros actuales */
  const filteredData = useMemo(() => {
    if (!usuarios) return [];

    return usuarios.filter((u) => {
      const term = busqueda.toLowerCase().trim();

      const matchesBusqueda =
        u.cedula.includes(term) ||
        u.nombre.toLowerCase().includes(term) ||
        u.apellido.toLowerCase().includes(term) ||
        u.correo_electronico.toLowerCase().includes(term);

      const matchesEstado =
        estadoFiltro === "todos" || u.estado === estadoFiltro;

      return matchesBusqueda && matchesEstado;
    });
  }, [usuarios, busqueda, estadoFiltro]);

  return {
    busqueda,
    setBusqueda,
    estadoFiltro,
    setEstadoFiltro,
    filteredData,
  };
}
