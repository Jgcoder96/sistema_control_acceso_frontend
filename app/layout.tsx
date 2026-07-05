import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import type { Metadata } from "next";

import { Providers } from "./components/lib/providers";

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
    <html
      lang="es"
      suppressHydrationWarning
      data-theme="light"
      style={{ colorScheme: "light" }}
    >
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{
          backgroundColor: "#f6f7f9", // Esto coincide con tu token 'reactBg'
          color: "#23272f", // Esto coincide con tu token 'reactText'
          minHeight: "100vh",
        }}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
