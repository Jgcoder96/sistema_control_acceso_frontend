import { useState, useMemo } from "react";
import { Usuario } from "../types/Usuario";

export function useUserFilters(usuarios: Usuario[]) {
  const [busqueda, setBusqueda] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("todos");

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
