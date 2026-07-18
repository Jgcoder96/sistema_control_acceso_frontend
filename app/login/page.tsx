"use client";

import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import { Flex, Stack } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

import { AppFooter, PageTransition } from "../../components";
import {
  LoginForm,
  LoginModal,
  LoginHero,
  LoginHeader,
} from "../../components/login";
import { useLogin } from "./hooks";

function LoginPage() {
  const router = useRouter();
  const { register, errors, isSubmitting, onSubmit, modal, closeModal } =
    useLogin();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access_token");
      if (token) {
        router.replace("/inicio");
      }
    }
  }, [router]);

  return (
    <PageTransition>
      <Flex
        minH="100dvh"
        minW="320px"
        w="100%"
        direction={{ base: "column", md: "row" }}
        bg="white"
        overflow="hidden"
        height="100dvh"
      >
        {/* Sección Visual Izquierda (PC) */}
        <LoginHero />

        {/* Sección Formulario Derecha */}
        <Flex
          flex="1"
          align="center"
          justify="center"
          p={{ base: "6", md: "20" }}
          direction="column"
        >
          <Stack
            gap={{ base: 8, md: 10 }}
            width="full"
            maxW={{ base: "full", sm: "sm", md: "400px" }}
            align="stretch"
          >
            <LoginHeader />

            <LoginForm
              register={register}
              errors={errors}
              isSubmitting={isSubmitting}
              onSubmit={onSubmit}
            />

            <AppFooter />
          </Stack>
        </Flex>

        {/* Modal de Feedback */}
        <LoginModal {...modal} onClose={closeModal} />
      </Flex>
    </PageTransition>
  );
}

// Exportación dinámica para evitar errores de hidratación con localStorage/window
export default dynamic(() => Promise.resolve(LoginPage), { ssr: false });
