import type { Metadata } from "next";
import { Fredoka, DM_Sans, Space_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

const fredokaHeading = Fredoka({
  variable: "--font-heading-loaded",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const dmSans = DM_Sans({
  variable: "--font-body-loaded",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const spaceMono = Space_Mono({
  variable: "--font-mono-loaded",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "GENIAUTAS",
  description: "Laboratorio guiado de IA en el aula",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={cn(dmSans.variable, spaceMono.variable, fredokaHeading.variable, "font-sans", inter.variable)}>
      <body className="relative min-h-screen bg-[var(--color-bg)]">
        {children}
      </body>
    </html>
  );
}
