import { HStack, Box, Text, Badge, IconButton } from "@chakra-ui/react";
import { Eye, Pencil, Trash2, ShieldCheck } from "lucide-react";
import { Role } from "@/app/(dashboard)/accesos/roles/types/Role";
import { ColumnConfig } from "@/components/dashboard/DataTable";

export const getRoleColumns = (
  onAction: (
    r: Role,
    mode: "view" | "edit" | "delete" | "assign_permissions",
  ) => void,
): ColumnConfig<Role>[] => [
  {
    header: "Rol",
    width: "300px",
    textAlign: "center",
    render: (r: Role) => (
      <Box display="inline-block" w="220px" textAlign="left">
        <HStack gap={4}>
          <Box
            w="8"
            h="8"
            borderRadius="full"
            bg="brand.100"
            color="brand.600"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <ShieldCheck size={16} />
          </Box>
          <Box>
            <Text fontWeight="bold" fontSize="sm">
              {r.nombre}
            </Text>
            <Text fontSize="xs" color="gray.400">
              ID: {r.id.slice(0, 8)}...
            </Text>
          </Box>
        </HStack>
      </Box>
    ),
  },
  {
    header: "Descripción",
    key: "descripcion",
    width: "350px",
    textAlign: "left",
    render: (r: Role) => (
      <Text fontSize="sm" color="gray.500" noOfLines={2}>
        {r.descripcion || "Sin descripción"}
      </Text>
    ),
  },
  {
    header: "Estado",
    width: "120px",
    textAlign: "center",
    render: (r: Role) => {
      const isActivo = !r.eliminado_el;
      return (
        <Badge
          colorPalette={isActivo ? "green" : "red"}
          variant="subtle"
          borderRadius="full"
        >
          {isActivo ? "activo" : "inactivo"}
        </Badge>
      );
    },
  },
  {
    header: "Acciones",
    width: "180px",
    textAlign: "center",
    render: (r: Role) => (
      <HStack gap={1} justify="center">
        <IconButton
          variant="ghost"
          size="sm"
          color="gray.400"
          aria-label="Ver Info"
          onClick={() => onAction(r, "view")}
        >
          <Eye size={16} />
        </IconButton>
        <IconButton
          variant="ghost"
          size="sm"
          color="gray.400"
          aria-label="Editar"
          onClick={() => onAction(r, "edit")}
        >
          <Pencil size={16} />
        </IconButton>
        <IconButton
          variant="ghost"
          size="sm"
          color="gray.400"
          aria-label="Asignar Permisos"
          onClick={() => onAction(r, "assign_permissions")}
        >
          <ShieldCheck size={16} />
        </IconButton>
        <IconButton
          variant="ghost"
          size="sm"
          color="gray.400"
          aria-label="Eliminar"
          onClick={() => onAction(r, "delete")}
        >
          <Trash2 size={16} />
        </IconButton>
      </HStack>
    ),
  },
];
