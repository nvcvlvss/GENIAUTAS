"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import Galaxy from "@/components/Galaxy";
import GradientText from "@/components/GradientText";
import RotatingText from "@/components/RotatingText";

export default function Home() {
  return (
    <>
      <div className="fixed inset-0 z-0 bg-background pointer-events-none">
        <Galaxy density={1.8} speed={0.2} />
      </div>
      <main className="relative z-10 flex min-h-screen w-full flex-col items-center justify-center bg-transparent px-4 text-center font-sans text-white">
        <header className="mb-10">
          <GradientText
            colors={["var(--color-primary)", "var(--color-progress)", "var(--color-primary)", "var(--color-info)"]}
            animationSpeed={8}
            showBorder={false}
            className="text-7xl md:text-9xl font-bold tracking-tight"
          >
            GENIAUTAS
          </GradientText>
        </header>

        <div className="flex flex-col items-center gap-6 mb-16">
          <p className="text-xl md:text-2xl text-[var(--color-text-secondary)] font-medium uppercase tracking-widest opacity-80">
            Un laboratorio donde con IA
          </p>
          
          <div className="flex items-center justify-center min-h-[100px]">
            <RotatingText
              texts={["aprendes", "creas", "exploras"]}
              mainClassName="text-5xl md:text-7xl font-bold text-[var(--color-primary)]"
              staggerDuration={0.03}
              splitBy="characters"
              rotationInterval={4000}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              animatePresenceMode="wait"
            />
          </div>
          
          <p className="max-w-xl text-lg md:text-xl text-[var(--color-text-tertiary)] mt-4 leading-relaxed">
            Descubre el potencial de la Inteligencia Artificial en un entorno escolar seguro, guiado y supervisado.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 w-full max-w-lg justify-center">
          <Button 
            asChild
            variant="primary" 
            size="xl" 
            className="h-16 w-full rounded-full text-lg shadow-[var(--glow-primary-sm)] hover:shadow-[var(--glow-primary-md)] transition-shadow duration-300"
          >
            <Link href="/join">
              Soy estudiante →
            </Link>
          </Button>
          <Button 
            asChild
            variant="outline" 
            size="xl" 
            className="h-16 w-full rounded-full border-2 border-[var(--color-border-strong)] text-lg text-white hover:bg-[var(--color-surface-2)] transition-colors duration-300"
          >
            <Link href="/login">
              Soy docente
            </Link>
          </Button>
        </div>

        <footer className="mt-20 opacity-80">
          <p className="text-xs tracking-widest uppercase text-[var(--color-text-tertiary)]">
            Misión de Aprendizaje Guiada
          </p>
        </footer>
      </main>
    </>
  );
}
