import type { Metadata } from "next";
import { Fredoka, DM_Sans, Space_Mono, Inter, Roboto } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import GradualBlur from "@/components/GradualBlur";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

const robotoHeading = Roboto({subsets:['latin'],variable:'--font-heading'});

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
    <html lang="es" className={cn(dmSans.variable, spaceMono.variable, "font-sans", inter.variable, robotoHeading.variable)}>
      <body className="relative min-h-screen bg-internal-radial">
        {children}
      </body>
    </html>
  );
}
