"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import RotatingText from "@/components/RotatingText";

export default function Home() {
  return (
    <main className="relative z-10 flex min-h-screen w-full flex-col items-center justify-center bg-transparent px-4 text-center font-sans text-[var(--color-text)]">
      <header className="mb-10">
        <h1 className="text-7xl md:text-9xl font-bold tracking-tighter text-[var(--color-text)]" style={{ fontFamily: 'var(--font-heading)' }}>
          GENIAUTAS
        </h1>
      </header>

      <div className="flex flex-col items-center gap-6 mb-16">
        <p className="text-xl md:text-2xl text-[var(--color-text-secondary)] font-medium uppercase tracking-widest">
          Un laboratorio donde con IA
        </p>
        
        <div className="flex items-center justify-center min-h-[100px]">
          <RotatingText
            texts={["aprendes", "creas", "exploras"]}
            mainClassName="text-5xl md:text-7xl font-bold text-[var(--color-text)]"
            staggerDuration={0.03}
            splitBy="characters"
            rotationInterval={4000}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            animatePresenceMode="wait"
          />
        </div>
        
        <p className="max-w-xl text-lg md:text-xl text-[var(--color-text-secondary)] mt-4 leading-relaxed">
          Descubre el potencial de la Inteligencia Artificial en un entorno escolar seguro, guiado y supervisado.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-6 w-full max-w-lg justify-center">
        <Button 
          asChild
          variant="primary" 
          size="xl" 
          className="h-16 w-full text-lg"
        >
          <Link href="/join">
            Soy estudiante →
          </Link>
        </Button>
        <Button 
          asChild
          variant="outline" 
          size="xl" 
          className="h-16 w-full text-lg"
        >
          <Link href="/login">
            Soy docente
          </Link>
        </Button>
      </div>

      <footer className="mt-20">
        <p className="text-xs tracking-widest uppercase text-[var(--color-text-secondary)]">
          Misión de Aprendizaje Guiada
        </p>
      </footer>
    </main>
  );
}
