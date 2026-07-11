"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Flex, Stack } from "@chakra-ui/react";

import { AppFooter, PageTransition } from "../../components";
import { LoginForm, LoginModal, LoginHero, LoginHeader } from "../../components/login";
import { useLogin } from "./hooks";

function LoginPage() {
  const { register, errors, isSubmitting, onSubmit, modal, closeModal } =
    useLogin();

  return (
    <PageTransition>
      <Flex
        h={{ base: "100dvh", md: "100vh" }}
        direction={{ base: "column", md: "row" }}
        bg="white"
        overflow="hidden"
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
