import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import type { Metadata } from "next";
import { Providers } from "../components/lib/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sistema de Control de Acceso",
};

/**
 * Root Layout global de la aplicación (Next.js App Router).
 * Define el cascarón HTML principal, inyecta las fuentes base (Geist) y
 * envuelve toda la aplicación con los Providers globales (Chakra UI, Theme).
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
