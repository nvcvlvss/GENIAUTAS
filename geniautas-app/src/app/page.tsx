"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import Galaxy from "@/components/Galaxy";
import GradientText from "@/components/GradientText";
import RotatingText from "@/components/RotatingText";

export default function Home() {
  return (
    <>
      <div className="fixed inset-0 z-0 bg-[#030712] pointer-events-none">
        <Galaxy density={1.8} speed={0.2} />
      </div>
      <main className="relative z-10 flex min-h-screen w-full flex-col items-center justify-center bg-transparent px-4 text-center font-sans text-white">
        <header className="mb-10">
          <GradientText
            colors={["#33C7D8", "#F5C451", "#33C7D8", "#60A5FA"]}
            animationSpeed={8}
            showBorder={false}
            className="text-7xl md:text-9xl font-bold tracking-tight"
          >
            GENIAUTAS
          </GradientText>
        </header>

        <div className="flex flex-col items-center gap-6 mb-16">
          <p className="text-xl md:text-2xl text-[#C7D2E3] font-medium uppercase tracking-widest opacity-80">
            Un laboratorio donde con IA
          </p>
          
          <div className="flex items-center justify-center min-h-[100px]">
            <RotatingText
              texts={["aprendes", "creas", "exploras"]}
              mainClassName="text-5xl md:text-7xl font-bold text-[#33C7D8]"
              staggerDuration={0.03}
              splitBy="characters"
              rotationInterval={4000}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              animatePresenceMode="wait"
            />
          </div>
          
          <p className="max-w-xl text-lg md:text-xl text-[#93A4BF] mt-4 leading-relaxed">
            Descubre el potencial de la Inteligencia Artificial en un entorno escolar seguro, guiado y supervisado.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 w-full max-w-lg justify-center">
          <Button 
            asChild
            variant="primary" 
            size="xl" 
            className="h-16 w-full rounded-full text-lg shadow-[0_0_20px_rgba(51,199,216,0.3)]"
          >
            <Link href="/join">
              Soy estudiante →
            </Link>
          </Button>
          <Button 
            asChild
            variant="outline" 
            size="xl" 
            className="h-16 w-full rounded-full border-2 border-white/10 text-lg text-white hover:bg-white/5"
          >
            <Link href="/login">
              Soy docente
            </Link>
          </Button>
        </div>

        <footer className="mt-20 opacity-80">
          <p className="text-xs tracking-widest uppercase text-[#93A4BF]">
            Misión de Aprendizaje Guiada
          </p>
        </footer>
      </main>
    </>
  );
}
