import type { Metadata } from "next";
import { Fredoka, DM_Sans, Space_Mono } from "next/font/google";
import "./globals.css";

const fredoka = Fredoka({
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
    <html lang="es" className={`${fredoka.variable} ${dmSans.variable} ${spaceMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
