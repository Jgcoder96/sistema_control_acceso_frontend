import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ENDPOINTS } from "../constants/ENDPOINTS";

import { loginSchema, LoginFormValues } from "../schemas";

export function useLogin() {
  const router = useRouter();
  const [modal, setModal] = useState({
    open: false,
    title: "",
    message: "",
    isSuccess: false,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      const res = await fetch(ENDPOINTS.LOGIN, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        setModal({
          open: true,
          title: "¡Bienvenido!",
          message: result.message,
          isSuccess: true,
        });

        localStorage.setItem("access_token", result.data.tokens.access);
        localStorage.setItem("refresh_token", result.data.tokens.refresh);
        localStorage.setItem("user_data", JSON.stringify(result.data.user));

        setTimeout(() => router.push("/inicio"), 2000);
      } else {
        setModal({
          open: true,
          title: "Error de Acceso",
          message: result.message || "Credenciales inválidas",
          isSuccess: false,
        });
      }
    } catch (error) {
      setModal({
        open: true,
        title: "Error de Conexión",
        message: "No se pudo conectar con el servidor",
        isSuccess: false,
      });
    }
  };

  const closeModal = () => setModal((prev) => ({ ...prev, open: false }));

  return {
    register,
    errors,
    isSubmitting,
    onSubmit: handleSubmit(onSubmit),
    modal,
    closeModal,
  };
}
