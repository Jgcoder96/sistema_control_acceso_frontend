import { Dialog, Box, Flex, Text, Button, Stack } from "@chakra-ui/react";
import { CheckCircle, AlertCircle } from "lucide-react";

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  message: string;
  isSuccess: boolean;
}

export const LoginModal = ({
  open,
  onClose,
  title,
  message,
  isSuccess,
}: LoginModalProps) => (
  <Dialog.Root
    open={open}
    onOpenChange={(e) => onClose()}
    placement="center"
    motionPreset="scale"
  >
    <Dialog.Backdrop bg="blackAlpha.700" backdropFilter="blur(6px)" />
    <Dialog.Positioner p="6">
      <Dialog.Content
        borderRadius="2xl"
        p={{ base: "8", md: "10" }} // Más padding para que respire
        boxShadow="2xl"
        bg="white"
        maxW={{ base: "90vw", sm: "380px" }}
        width="full"
        // Forzamos que el contenido de la caja esté centrado
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        {/* Usamos un Stack para centrar vertical y horizontalmente todos los hijos */}
        <Stack gap="6" width="full" align="center" textAlign="center">
          {/* Icono Centrado */}
          <Box
            color={isSuccess ? "green.500" : "red.500"}
            bg={isSuccess ? "green.50" : "red.50"}
            p="5"
            borderRadius="full"
            display="inline-flex"
            alignItems="center"
            justifyContent="center"
          >
            {isSuccess ? <CheckCircle size={48} /> : <AlertCircle size={48} />}
          </Box>

          {/* Título Centrado */}
          <Dialog.Header p="0" width="full">
            <Dialog.Title
              fontSize="2xl"
              fontWeight="bold"
              textAlign="center"
              width="full"
              color="gray.800"
            >
              {title}
            </Dialog.Title>
          </Dialog.Header>

          {/* Mensaje Centrado */}
          <Dialog.Body p="0" width="full">
            <Text
              color="gray.600"
              fontSize="md"
              fontWeight="medium"
              lineHeight="tall"
              textAlign="center"
            >
              {message}
            </Text>
          </Dialog.Body>

          {/* Botón Centrado */}
          <Dialog.Footer p="0" width="full">
            <Button
              width="full"
              h="12"
              borderRadius="xl"
              bg={isSuccess ? "green.500" : "brand.500"}
              color="white"
              fontWeight="bold"
              fontSize="md"
              _hover={{ opacity: 0.9 }}
              onClick={onClose}
            >
              {isSuccess ? "Cargando..." : "Intentar de nuevo"}
            </Button>
          </Dialog.Footer>
        </Stack>
      </Dialog.Content>
    </Dialog.Positioner>
  </Dialog.Root>
);
