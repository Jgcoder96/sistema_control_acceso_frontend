import { HStack, Box, Text, Avatar, Badge, IconButton } from "@chakra-ui/react";
import { Eye, Pencil, Trash2, UserCog } from "lucide-react";
import { Usuario } from "@/app/(dashboard)/accesos/usuarios/types/Usuario";
import { ColumnConfig } from "@/components/dashboard/DataTable";

/**
 * Genera la configuración de columnas para la tabla de Usuarios.
 * @param onAction - Callback inyectado desde la página principal para disparar modales (ver, editar, eliminar, asignar roles).
 */
export const getUserColumns = (
  onAction: (
    u: Usuario,
    mode: "view" | "edit" | "delete" | "assign_roles",
  ) => void,
): ColumnConfig<Usuario>[] => [
  {
    header: "Usuario",
    width: "300px",
    textAlign: "center",
    render: (u: Usuario) => (
      <Box display="inline-block" w="220px" textAlign="left">
        <HStack gap={4}>
          <Avatar.Root size="sm">
            <Avatar.Image src={u.foto_url || undefined} />
            <Avatar.Fallback name={u.nombre} />
          </Avatar.Root>
          <Box>
            <Text fontWeight="bold" fontSize="sm" whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">
              {u.nombre} {u.apellido}
            </Text>
            <Text fontSize="xs" color="gray.400">
              ID: {u.id.slice(0, 8)}...
            </Text>
          </Box>
        </HStack>
      </Box>
    ),
  },
  { header: "Cédula", key: "cedula", width: "150px", textAlign: "center" },
  {
    header: "Correo Electrónico",
    key: "correo_electronico",
    width: "250px",
    textAlign: "center",
  },
  {
    header: "Estado",
    width: "120px",
    render: (u: Usuario) => (
      <Badge
        colorPalette={u.estado === "activo" ? "green" : "red"}
        variant="subtle"
        borderRadius="full"
      >
        {u.estado}
      </Badge>
    ),
  },
  {
    header: "Acciones",
    width: "180px",
    textAlign: "center",
    render: (u: Usuario) => (
      <HStack gap={1} justify="center">
        <IconButton
          variant="ghost"
          size="sm"
          color="gray.400"
          aria-label="Ver Info"
          onClick={() => onAction(u, "view")}
        >
          <Eye size={16} />
        </IconButton>
        <IconButton
          variant="ghost"
          size="sm"
          color="gray.400"
          aria-label="Editar"
          onClick={() => onAction(u, "edit")}
        >
          <Pencil size={16} />
        </IconButton>
        <IconButton
          variant="ghost"
          size="sm"
          color="gray.400"
          aria-label="Asignar Rol"
          onClick={() => onAction(u, "assign_roles")}
        >
          <UserCog size={16} />
        </IconButton>
        <IconButton
          variant="ghost"
          size="sm"
          color="gray.400"
          aria-label="Eliminar"
          onClick={() => onAction(u, "delete")}
        >
          <Trash2 size={16} />
        </IconButton>
      </HStack>
    ),
  },
];
