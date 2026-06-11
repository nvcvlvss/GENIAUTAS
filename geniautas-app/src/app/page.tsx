"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import RotatingText from "@/components/RotatingText";
import { motion } from "motion/react";

export default function Home() {
  return (
    <main className="relative z-10 flex min-h-screen w-full flex-col items-center justify-center bg-transparent px-4 text-center font-sans text-[var(--color-text)]">
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="mb-10 flex flex-col items-center"
      >
        {/* Isotipo SVG Geométrico HUD */}
        <div className="flex items-center gap-3 mb-6 select-none drop-shadow-[0_0_15px_rgba(56,189,248,0.3)]">
          <svg className="size-10 text-[var(--color-primary)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polygon points="12 8 8 12 12 16 16 12 12 8" />
          </svg>
          <span className="text-3xl font-extrabold tracking-widest text-[var(--color-text)] font-mono">GENIAUTAS</span>
        </div>
        
        <h1 className="text-6xl md:text-8xl tracking-tighter font-extrabold uppercase text-[var(--color-text)] leading-none" style={{ fontFamily: 'var(--font-heading)' }}>
          El Universo de la IA
        </h1>
      </motion.header>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="flex flex-col items-center gap-6 mb-16"
      >
        <p className="text-sm md:text-base font-mono uppercase tracking-[0.25em] text-slate-400">
          Laboratorio Escolar Supervisado
        </p>
        
        <div className="flex items-center justify-center min-h-[100px]">
          <RotatingText
            texts={["aprender", "crear", "explorar"]}
            mainClassName="text-5xl md:text-7xl font-extrabold text-[var(--color-text)] uppercase tracking-tight"
            staggerDuration={0.03}
            splitBy="characters"
            rotationInterval={4000}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            animatePresenceMode="wait"
          />
        </div>
        
        <p className="max-w-xl text-base md:text-lg text-[var(--color-text-secondary)] mt-4 leading-relaxed">
          Descubre el potencial de la Inteligencia Artificial en un entorno escolar seguro, guiado y supervisado.
        </p>
      </motion.div>

      {/* Role Selection Buttons with Spring Motion */}
      <div className="flex flex-col sm:flex-row gap-6 w-full max-w-lg justify-center">
        <motion.div 
          className="w-full"
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", damping: 15, stiffness: 80, delay: 0.4 }}
        >
          <Button 
            asChild
            variant="primary" 
            size="xl" 
            className="h-16 w-full text-lg font-bold tracking-wider uppercase border border-[var(--color-primary-strong)]/30 shadow-[0_0_15px_rgba(56,189,248,0.1)] hover:shadow-[0_0_25px_rgba(56,189,248,0.25)] transition-all"
          >
            <Link href="/join">
              Soy estudiante
            </Link>
          </Button>
        </motion.div>
        
        <motion.div 
          className="w-full"
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", damping: 15, stiffness: 80, delay: 0.5 }}
        >
          <Button 
            asChild
            variant="outline" 
            size="xl" 
            className="h-16 w-full text-lg font-bold tracking-wider uppercase bg-[rgba(10,12,22,0.3)] backdrop-blur-sm border border-[rgba(255,255,255,0.06)] hover:border-[var(--color-primary)]/50 hover:bg-[rgba(56,189,248,0.05)] transition-all"
          >
            <Link href="/login">
              Soy docente
            </Link>
          </Button>
        </motion.div>
      </div>

      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="mt-20"
      >
        <p className="text-[10px] font-mono tracking-[0.3em] uppercase text-slate-500">
          Misión de Aprendizaje Guiada · v4.7
        </p>
      </motion.footer>
    </main>
  );
}
