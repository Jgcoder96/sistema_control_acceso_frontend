"use client";

import React, { useState } from "react";
import {
  Box,
  Table,
  HStack,
  Button,
  IconButton,
  Center,
  VStack,
  Text,
  Spinner,
} from "@chakra-ui/react";
import { ChevronLeft, ChevronRight, SearchX } from "lucide-react";

export interface ColumnConfig<T> {
  header: string;
  key?: keyof T;
  render?: (item: T) => React.ReactNode;
  textAlign?: "left" | "center" | "right";
  width?: string;
}

interface DataTableProps<T> {
  columns: ColumnConfig<T>[];
  data: T[];
  pageSize?: number;
  filterBar?: React.ReactNode;
  tableHeight?: string | number;
  loading?: boolean;
  serverPagination?: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  };
}

export function DataTable<T>({
  columns,
  data,
  pageSize = 5,
  filterBar,
  tableHeight = "500px",
  loading = false,
  serverPagination,
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [prevData, setPrevData] = useState(data);

  if (data !== prevData) {
    setPrevData(data);
    setCurrentPage(1);
  }

  const isServer = !!serverPagination;
  const actualCurrentPage = isServer ? serverPagination.currentPage : currentPage;
  const totalPages = isServer ? serverPagination.totalPages : Math.ceil(data.length / pageSize);
  const currentData = isServer
    ? data
    : data.slice((actualCurrentPage - 1) * pageSize, actualCurrentPage * pageSize);

  const handlePageChange = (p: number) => {
    if (isServer) {
      serverPagination.onPageChange(p);
    } else {
      setCurrentPage(p);
    }
  };

  return (
    <Box w="full" display="flex" flexDirection="column" gap={4}>
      {filterBar && <Box>{filterBar}</Box>}

      <Box
        border="1px solid"
        borderColor="gray.200"
        borderRadius="2xl"
        bg="white"
        shadow="sm"
        h={tableHeight}
        display="flex"
        flexDirection="column"
        overflow="hidden"
      >
        {/* Contenedor principal con scroll horizontal sincronizado y comportamiento flexible */}
        <Box
          overflowX="auto"
          w="full"
          flex="1"
          display="flex"
          flexDirection="column"
        >
          <Box
            minW="1000px"
            display="flex"
            flexDirection="column"
            flex="1"
            overflow="hidden"
          >
            {/* Tabla para Encabezado (Estático Verticalmente) */}
            <Table.Root
              size="lg"
              variant="line"
              style={{ tableLayout: "fixed" }}
            >
              <Table.Header>
                <Table.Row border="none">
                  {columns.map((col, index) => (
                    <Table.ColumnHeader
                      key={index}
                      py={5}
                      px={8}
                      bg="brand.500"
                      color="white"
                      fontSize="xs"
                      fontWeight="bold"
                      textTransform="uppercase"
                      textAlign={col.textAlign || "center"}
                      w={col.width}
                      border="none"
                    >
                      {col.header}
                    </Table.ColumnHeader>
                  ))}
                </Table.Row>
              </Table.Header>
            </Table.Root>

            {/* Contenedor del Cuerpo de la Tabla (Desplazable Verticalmente con Scrollbar Fino y flexible) */}
            <Box
              position="relative"
              overflowY="auto"
              flex="1"
              css={{
                "&::-webkit-scrollbar": {
                  width: "6px",
                  height: "6px",
                },
                "&::-webkit-scrollbar-track": {
                  background: "transparent",
                },
                "&::-webkit-scrollbar-thumb": {
                  background: "#CBD5E1",
                  borderRadius: "24px",
                },
                "&::-webkit-scrollbar-thumb:hover": {
                  background: "#94A3B8",
                },
              }}
            >
              <Table.Root
                size="lg"
                variant="line"
                style={{ tableLayout: "fixed" }}
              >
                <Table.Body>
                  {currentData.length > 0 ? (
                    currentData.map((item, rowIndex) => (
                      <Table.Row key={rowIndex} _hover={{ bg: "blue.50/40" }}>
                        {columns.map((col, colIndex) => (
                          <Table.Cell
                            key={colIndex}
                            px={8}
                            py={4}
                            fontSize="sm"
                            textAlign={col.textAlign || "center"}
                            w={col.width}
                            border="none"
                            whiteSpace="nowrap"
                            overflow="hidden"
                            textOverflow="ellipsis"
                          >
                            {col.render
                              ? col.render(item)
                              : col.key
                                ? String(item[col.key])
                                : null}
                          </Table.Cell>
                        ))}
                      </Table.Row>
                    ))
                  ) : (
                    <Table.Row>
                      <Table.Cell colSpan={columns.length} border="none">
                        <Center py={20}>
                          <VStack gap={2}>
                            <SearchX size={48} color="#9CA3AF" />
                            <Text color="gray.500" fontWeight="medium">
                              No se encontraron resultados
                            </Text>
                          </VStack>
                        </Center>
                      </Table.Cell>
                    </Table.Row>
                  )}
                </Table.Body>
              </Table.Root>

              {/* Capa de carga sobrepuesta únicamente en el cuerpo */}
              {loading && (
                <Center
                  position="absolute"
                  top="0"
                  left="0"
                  right="0"
                  bottom="0"
                  bg="white/60"
                  zIndex="2"
                  backdropFilter="blur(2px)"
                >
                  <Spinner color="brand.500" size="xl" />
                </Center>
              )}
            </Box>
          </Box>
        </Box>

        {totalPages > 0 && (
          <Box borderTop="1px solid" borderColor="gray.100" py={3} bg="white" mt="auto">
            <Center>
              <HStack
                gap={2}
                bg="gray.100/50"
                p={1}
                borderRadius="full"
                border="1px solid"
                borderColor="gray.200"
              >
                <IconButton
                  variant="ghost"
                  size="sm"
                  borderRadius="full"
                  disabled={actualCurrentPage === 1}
                  onClick={() => handlePageChange(actualCurrentPage - 1)}
                >
                  <ChevronLeft size={18} />
                </IconButton>
                <HStack gap={1} px={2}>
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <Button
                      key={i}
                      size="sm"
                      variant={actualCurrentPage === i + 1 ? "solid" : "ghost"}
                      bg={actualCurrentPage === i + 1 ? "brand.500" : "transparent"}
                      color={actualCurrentPage === i + 1 ? "white" : "gray.600"}
                      borderRadius="full"
                      minW="32px"
                      h="32px"
                      fontSize="xs"
                      onClick={() => handlePageChange(i + 1)}
                    >
                      {i + 1}
                    </Button>
                  ))}
                </HStack>
                <IconButton
                  variant="ghost"
                  size="sm"
                  borderRadius="full"
                  disabled={actualCurrentPage === totalPages}
                  onClick={() => handlePageChange(actualCurrentPage + 1)}
                >
                  <ChevronRight size={18} />
                </IconButton>
              </HStack>
            </Center>
          </Box>
        )}
      </Box>
    </Box>
  );
}
