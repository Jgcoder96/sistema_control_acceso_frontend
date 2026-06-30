// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mi Aplicación",
  description: "Desarrollada con Next.js y Chakra UI (React Style)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    /**
     * data-theme="light": Indica a Chakra v3 que use el tema claro.
     * style={{ colorScheme: 'light' }}: Informa al navegador que esta web es solo clara.
     * suppressHydrationWarning: Evita errores de consola por el manejo de temas de Chakra.
     */
    <html
      lang="es"
      suppressHydrationWarning
      data-theme="light"
      style={{ colorScheme: "light" }}
    >
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        /**
         * Aplicamos el fondo gris muy claro de React.dev (#f6f7f9)
         * y el color de texto principal (#23272f) globalmente.
         */
        style={{
          backgroundColor: "#f6f7f9",
          color: "#23272f",
          minHeight: "100vh",
        }}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
