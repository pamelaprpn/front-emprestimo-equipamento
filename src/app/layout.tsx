import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import type { ReactNode } from "react";
import AppShell from "@/components/layout/AppShell";
import { AppDataProvider } from "@/components/providers/AppDataProvider";
import { QueryProvider } from "@/components/providers/QueryProvider";
import "@/styles/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sistema de Empréstimo de Equipamentos",
  description: "Sistema para gerenciamento de empréstimos de equipamentos.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="min-h-screen antialiased">
        <QueryProvider>
          <AppDataProvider>
            <AppShell>{children}</AppShell>
          </AppDataProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
