"use client";

import {
  Box,
  Button,
  Drawer,
  Flex,
  IconButton,
  Stack,
  Text,
} from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  House,
  Users,
  MonitorCog,
  FileText,
  LogOut,
  Menu as MenuIcon,
  ChevronDown,
  X,
} from "lucide-react";

const navItems = [
  { label: "Inicio", href: "/inicio", icon: House },
  {
    label: "Accesos",
    href: "/accesos/usuarios",
    icon: Users,
    children: [
      { label: "Usuarios", href: "/accesos/usuarios" },
      { label: "Roles", href: "/accesos/roles" },
      { label: "Permisos", href: "/accesos/permisos" },
    ],
  },
  {
    label: "Sistema",
    href: "/sistema",
    icon: MonitorCog,
    children: [
      { label: "Ubicaciones", href: "/sistema/ubicaciones" },
      { label: "Puntos de acceso", href: "/sistema/puntos-de-acceso" },
      { label: "Horarios", href: "/sistema/horarios" },
      { label: "Festivos", href: "/sistema/festivos" },
      { label: "Tarjetas", href: "/sistema/tarjetas" },
      { label: "Permisos", href: "/sistema/permisos" },
    ],
  },
  { label: "Logs", href: "/logs", icon: FileText },
];

type UserSession = {
  nombre?: string;
  apellido?: string;
  correo_electronico?: string;
  foto_url?: string;
  roles?: string[];
};

export default function ProtectedNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [openDesktopSubmenu, setOpenDesktopSubmenu] = useState<string | null>(
    null,
  );
  const [user, setUser] = useState<UserSession>({});

  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedUser = localStorage.getItem("user_data");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        setUser({});
      }
    }
  }, []);

  useEffect(() => {
    setOpenDesktopSubmenu(null);
    setOpenSubmenu(null);
    setIsDrawerOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_data");
    router.push("/login");
    setIsDrawerOpen(false);
    setOpenSubmenu(null);
    setOpenDesktopSubmenu(null);
  };

  const handleNavigate = (href: string) => {
    setOpenDesktopSubmenu(null);
    setOpenSubmenu(null);
    setIsDrawerOpen(false);
    router.push(href);
  };

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  const renderDesktopItem = (item: (typeof navItems)[number]) => {
    const Icon = item.icon;
    const active = isActive(item.href);

    if (item.children?.length) {
      const isExpanded = openDesktopSubmenu === item.href;

      return (
        <Box key={item.href} position="relative">
          <Button
            size="sm"
            h="36px"
            borderRadius="full"
            variant={active ? "solid" : "ghost"}
            bg={active ? "brand.500" : "transparent"}
            color={active ? "white" : "gray.700"}
            flexShrink={0}
            _hover={{ bg: active ? "brand.600" : "gray.100" }}
            onClick={() => setOpenDesktopSubmenu(isExpanded ? null : item.href)}
          >
            <Flex align="center" gap={2}>
              <Icon size={16} />
              <Text>{item.label}</Text>
              <motion.span
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <ChevronDown size={14} />
              </motion.span>
            </Flex>
          </Button>

          <AnimatePresence>
            {isExpanded ? (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.98 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                style={{
                  position: "absolute",
                  top: "calc(100% + 8px)",
                  left: 0,
                  zIndex: 50,
                }}
              >
                <Box
                  minW={{ base: "calc(100vw - 2rem)", md: "210px" }}
                  maxW={{ base: "calc(100vw - 2rem)", md: "210px" }}
                  p={1.5}
                  bg="white"
                  borderWidth="1px"
                  borderColor="blue.100"
                  rounded="xl"
                  boxShadow="0 16px 40px rgba(59, 130, 246, 0.12)"
                  overflow="hidden"
                >
                  {item.children.map((child, index) => (
                    <Button
                      key={child.href}
                      width="full"
                      justifyContent="flex-start"
                      variant="ghost"
                      size="sm"
                      rounded="md"
                      px={3}
                      py={2.5}
                      fontSize="sm"
                      fontWeight="medium"
                      color="gray.700"
                      _hover={{ bg: "blue.50", color: "blue.700" }}
                      borderTopWidth={index === 0 ? "1px" : undefined}
                      borderTopColor="gray.100"
                      mt={index === 0 ? 1 : 0}
                      onClick={() => handleNavigate(child.href)}
                    >
                      {child.label}
                    </Button>
                  ))}
                </Box>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </Box>
      );
    }

    return (
      <Button
        key={item.href}
        asChild
        size="sm"
        h="36px"
        borderRadius="full"
        variant={active ? "solid" : "ghost"}
        bg={active ? "brand.500" : "transparent"}
        color={active ? "white" : "gray.700"}
        _hover={{ bg: active ? "brand.600" : "gray.100" }}
        onClick={() => handleNavigate(item.href)}
      >
        <Link href={item.href}>
          <Flex align="center" gap={2}>
            <Icon size={16} />
            <Text>{item.label}</Text>
          </Flex>
        </Link>
      </Button>
    );
  };

  const renderMobileItem = (item: (typeof navItems)[number]) => {
    const Icon = item.icon;
    const active = isActive(item.href);

    if (item.children?.length) {
      const isExpanded = openSubmenu === item.href;

      return (
        <Box key={item.href}>
          <Button
            width="full"
            justifyContent="flex-start"
            variant={active ? "solid" : "ghost"}
            bg={active ? "brand.500" : "transparent"}
            color={active ? "white" : "gray.700"}
            onClick={() => {
              setOpenSubmenu(isExpanded ? null : item.href);
            }}
          >
            <Flex align="center" justify="space-between" width="100%">
              <Flex align="center" gap={2}>
                <Icon size={16} />
                <Text>{item.label}</Text>
              </Flex>
              <Text fontSize="sm" color={active ? "white" : "gray.500"}>
                {isExpanded ? "−" : "+"}
              </Text>
            </Flex>
          </Button>

          <AnimatePresence initial={false}>
            {isExpanded ? (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.22, ease: "easeInOut" }}
              >
                <Stack gap={1} mt={2} pl={4}>
                  {item.children.map((child) => {
                    const childActive = pathname === child.href;
                    return (
                      <Button
                        key={child.href}
                        asChild
                        size="sm"
                        justifyContent="flex-start"
                        variant={childActive ? "solid" : "ghost"}
                        bg={childActive ? "brand.100" : "transparent"}
                        color={childActive ? "brand.700" : "gray.600"}
                        onClick={() => handleNavigate(child.href)}
                      >
                        <Link href={child.href}>{child.label}</Link>
                      </Button>
                    );
                  })}
                </Stack>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </Box>
      );
    }

    return (
      <Button
        key={item.href}
        asChild
        width="full"
        justifyContent="flex-start"
        variant={active ? "solid" : "ghost"}
        bg={active ? "brand.500" : "transparent"}
        color={active ? "white" : "gray.700"}
        onClick={() => setIsDrawerOpen(false)}
      >
        <Link href={item.href}>
          <Flex align="center" gap={2}>
            <Icon size={16} />
            <Text>{item.label}</Text>
          </Flex>
        </Link>
      </Button>
    );
  };

  return (
    <Box
      as="nav"
      bg="white"
      borderBottomWidth="1px"
      borderColor="gray.200"
      position="sticky"
      top="0"
      zIndex="20"
      minW="320px"
    >
      <Flex
        w="full"
        align="center"
        justify="space-between"
        px={{ base: 4, md: 6, lg: 8 }}
        py={{ base: 4, md: 5 }}
        gap={{ base: 3, md: 4 }}
        minW="0"
      >
        <Flex align="center" gap={3} flex="1">
          <Box display={{ base: "flex", md: "none" }}>
            <IconButton
              aria-label="Abrir menú"
              variant="outline"
              onClick={() => setIsDrawerOpen(true)}
            >
              <MenuIcon size={18} />
            </IconButton>
          </Box>

          <Stack
            display={{ base: "none", md: "flex" }}
            direction="row"
            align="center"
            gap={2}
          >
            {navItems.map((item) => renderDesktopItem(item))}
          </Stack>
        </Flex>

        <Box display={{ base: "none", md: "flex" }}>
          <Button
            size="sm"
            h="36px"
            borderRadius="full"
            colorScheme="red"
            variant="solid"
            bg="red.500"
            color="white"
            _hover={{ bg: "red.600" }}
            _active={{ bg: "red.700" }}
            onClick={handleLogout}
            px={5}
          >
            <Flex align="center" justify="center" gap={2}>
              <LogOut size={16} />
              <Text fontSize="sm" fontWeight="semibold">
                Cerrar sesión
              </Text>
            </Flex>
          </Button>
        </Box>
      </Flex>

      <Drawer.Root
        open={isDrawerOpen}
        onOpenChange={(details) => setIsDrawerOpen(details.open)}
        placement="start"
      >
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content>
            <Drawer.Header>
              <Flex justify="space-between" align="center">
                <Text fontWeight="bold">Menú</Text>
                <IconButton
                  aria-label="Cerrar menú"
                  variant="ghost"
                  onClick={() => setIsDrawerOpen(false)}
                >
                  <X size={18} />
                </IconButton>
              </Flex>
            </Drawer.Header>

            <Drawer.Body>
              <Stack gap={3}>
                {navItems.map((item) => renderMobileItem(item))}
              </Stack>
            </Drawer.Body>

            <Drawer.Footer>
              <Button
                width="full"
                size="sm"
                h="36px"
                colorScheme="red"
                variant="solid"
                bg="red.500"
                color="white"
                _hover={{ bg: "red.600" }}
                onClick={handleLogout}
              >
                <Flex align="center" justify="center" gap={2}>
                  <LogOut size={16} />
                  <Text>Cerrar sesión</Text>
                </Flex>
              </Button>
            </Drawer.Footer>
          </Drawer.Content>
        </Drawer.Positioner>
      </Drawer.Root>
    </Box>
  );
}
