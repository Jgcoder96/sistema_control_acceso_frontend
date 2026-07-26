import { HStack, Box, Text, Badge, IconButton, Avatar } from "@chakra-ui/react";
import { Eye, User } from "lucide-react";
import { Log } from "@/app/(dashboard)/logs/types/Log";
import { ColumnConfig } from "@/components/dashboard/DataTable";

/**
 * Genera la configuración de columnas para la tabla de Logs.
 * Esta tabla es de solo lectura, por lo que la única acción disponible es "Ver Info".
 * 
 * @param onView - Callback para abrir el modal de detalles del Log.
 */
export const getLogColumns = (
  onView: (l: Log) => void,
): ColumnConfig<Log>[] => [
  {
    header: "Fecha",
    key: "fecha",
    width: "180px",
    render: (l: Log) => (
      <Text fontSize="sm" color="gray.600">
        {l.fecha}
      </Text>
    ),
  },
  {
    header: "Usuario",
    width: "250px",
    textAlign: "left",
    render: (l: Log) => {
      const tarjeta = typeof l.tarjeta === "object" && l.tarjeta !== null ? l.tarjeta : null;
      const usuario = tarjeta ? tarjeta.usuario : null;
      
      let nombre = "";
      if (usuario) {
        nombre = `${usuario.nombre} ${usuario.apellido || ""}`;
      } else {
        nombre = "Usuario Desconocido";
      }
      
      const tarjetaRaw = l.codigo_tarjeta_raw ? `ID Tarjeta: ${l.codigo_tarjeta_raw}` : "";
      const subtexto = tarjetaRaw || "-";
      const foto = usuario?.foto;

      return (
        <Box display="inline-block" w="full" textAlign="left">
          <HStack gap={4}>
            <Avatar.Root size="sm" shape={usuario ? "full" : "rounded"} colorPalette={usuario ? "blue" : "gray"}>
              <Avatar.Image src={foto || undefined} />
              <Avatar.Fallback name={usuario?.nombre ? nombre : undefined}>
                {!usuario && <User size={18} opacity={0.6} />}
              </Avatar.Fallback>
            </Avatar.Root>
            <Box>
              <Text fontWeight="bold" fontSize="sm" whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">
                {nombre}
              </Text>
              <Text fontSize="xs" color="gray.400">
                {subtexto}
              </Text>
            </Box>
          </HStack>
        </Box>
      );
    },
  },
  {
    header: "Evento",
    width: "150px",
    render: (l: Log) => {
      // Color según si se concedió o denegó (usando l.autorizado)
      const esAutorizado = l.autorizado === true;
      const estadoColor = esAutorizado ? "green" : "red";
      const texto = esAutorizado ? "Concedido" : "Denegado";

      return (
        <Badge
          colorPalette={estadoColor}
          variant="subtle"
          borderRadius="full"
        >
          {texto}
        </Badge>
      );
    },
  },
  {
    header: "Ubicación",
    key: "ubicacion",
    width: "200px",
    render: (l: Log) => {
      const ubiName =
        typeof l.ubicacion === "object" && l.ubicacion !== null
          ? l.ubicacion.nombre
          : l.ubicacion;
      return (
        <Text fontSize="sm" color="gray.600">
          {ubiName || "-"}
        </Text>
      );
    },
  },
  {
    header: "Punto de Acceso",
    key: "punto_acceso",
    width: "200px",
    render: (l: Log) => {
      const ptoName =
        typeof l.punto_acceso === "object" && l.punto_acceso !== null
          ? l.punto_acceso.nombre
          : l.punto_acceso;
      return (
        <Text fontSize="sm" color="gray.600">
          {ptoName || "-"}
        </Text>
      );
    },
  },
  {
    header: "Acciones",
    width: "100px",
    textAlign: "center",
    render: (l: Log) => (
      <HStack gap={1} justify="center">
        <IconButton
          variant="ghost"
          size="sm"
          colorPalette="blue"
          aria-label="Ver Info"
          onClick={() => onView(l)}
        >
          <Eye size={16} />
        </IconButton>
      </HStack>
    ),
  },
];
