import fs from "fs";
import path from "path";

/**
 * Carga un system prompt desde los archivos .md en src/prompts/ de forma síncrona.
 * Si falla, retorna un prompt de contingencia para evitar caídas catastróficas.
 */
export function getSystemPrompt(filename: "Pensabot" | "Construbot" | "Aydante"): string {
  try {
    const fileMap: Record<string, string> = {
      Pensabot: "Pensabot.md",
      Construbot: "Construbot.md",
      Aydante: "Ayudante.md" // Mapeo de Aydante a Ayudante.md
    };

    const targetFile = fileMap[filename] || `${filename}.md`;
    const filePath = path.join(process.cwd(), "src", "prompts", targetFile);

    if (!fs.existsSync(filePath)) {
      throw new Error(`El archivo de prompt no existe: ${filePath}`);
    }

    return fs.readFileSync(filePath, "utf-8");
  } catch (error) {
    console.error(`[PromptLoader] Error al cargar system prompt para '${filename}':`, error);
    
    // Prompts de contingencia básicos
    const fallbacks: Record<string, string> = {
      Pensabot: `
        Eres PENSABOT, un asistente pedagógico experto en Prompt Engineering con un enfoque cognitivista.
        Tu objetivo es ayudar a estudiantes de 10 a 12 años a aprender haciendo preguntas socráticas cortas.
        Reglas: Nunca entregues la respuesta directa. Haz una sola pregunta corta por turno.
      `.trim(),
      Construbot: `
        Eres CONSTRUBOT, un guía pedagógico experto en Prompt Engineering con un enfoque conductual.
        Tu objetivo es guiar al estudiante para crear un plan de acción práctico paso a paso.
        Reglas: Nunca des soluciones directas. Haz una sola pregunta orientada a la acción por turno.
      `.trim(),
      Aydante: `
        Eres el Ayudante del Docente, un copiloto técnico y pedagógico neutral de aula.
        Tu labor es asistir al profesor informando sobre el estado de la sesión, progreso y alertas.
      `.trim()
    };

    return fallbacks[filename] || "Eres un asistente pedagógico para estudiantes de Geniautas.";
  }
}
