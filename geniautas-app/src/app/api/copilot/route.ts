import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { createClient } from "@/lib/supabase/server";
import { getSystemPrompt } from "@/lib/prompt-loader";

// Definición de tipos estrictos para los resultados de Supabase con relaciones
interface StudentSessionRow {
  id: string;
  full_name: string;
  is_active: boolean | null;
  student_task_progress: { is_completed: boolean | null }[] | null;
}

interface AlertRow {
  id: string;
  type: "security" | "pedagogical" | "technical";
  content_snapshot: string | null;
  is_resolved: boolean | null;
  student_sessions: { full_name: string } | null;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { sessionId, messages, message } = body;

    if (!sessionId) {
      return NextResponse.json({ error: "MISSING_SESSION_ID" }, { status: 400 });
    }

    // 1. Cargar el prompt base del Ayudante (Aydante)
    const basePrompt = getSystemPrompt("Aydante");

    // 2. Inicializar cliente Supabase
    const supabase = await createClient();

    // 3. Consultas en paralelo para optimizar la velocidad y latencia
    const [sessionResult, studentsResult, alertsResult] = await Promise.all([
      // A. Consulta de la sesión (Título y Objetivo de Aprendizaje)
      supabase
        .from("sessions")
        .select("title, pedagogical_objective")
        .eq("id", sessionId)
        .single(),

      // B. Consulta de estudiantes conectados (Límite MVP: Max 10 concurrentes)
      supabase
        .from("student_sessions")
        .select(`
          id,
          full_name,
          is_active,
          student_task_progress(is_completed)
        `)
        .eq("session_id", sessionId)
        .limit(10),

      // C. Consulta de alertas activas sin resolver
      supabase
        .from("alerts")
        .select(`
          id,
          type,
          content_snapshot,
          is_resolved,
          student_sessions(full_name)
        `)
        .eq("session_id", sessionId)
        .eq("is_resolved", false)
        .order("created_at", { ascending: false })
    ]);

    // Manejo de errores de consultas críticas
    if (sessionResult.error || !sessionResult.data) {
      console.error("[CopilotAPI] Error al consultar sesión:", sessionResult.error);
      return NextResponse.json({ error: "SESSION_NOT_FOUND" }, { status: 404 });
    }

    const sessionData = sessionResult.data;
    const studentsData = (studentsResult.data as unknown as StudentSessionRow[]) ?? [];
    const alertsData = (alertsResult.data as unknown as AlertRow[]) ?? [];

    // 4. Formatear y construir el bloque Markdown del contexto en tiempo real
    let studentsMarkdown = "";
    if (studentsData.length === 0) {
      studentsMarkdown = "- No hay estudiantes registrados en esta sesión.\n";
    } else {
      studentsData.forEach((student) => {
        const statusText = student.is_active ? "Conectado" : "Desconectado";
        const completedCount = (student.student_task_progress ?? [])
          .filter(p => p.is_completed)
          .length;
        
        studentsMarkdown += `- **${student.full_name}**: Estado: *${statusText}*, Tareas completadas: ${completedCount}\n`;
      });
    }

    let alertsMarkdown = "";
    if (alertsData.length === 0) {
      alertsMarkdown = "- No hay alertas activas sin resolver.\n";
    } else {
      alertsData.forEach((alert) => {
        const studentName = alert.student_sessions?.full_name || "Desconocido";
        const reason = alert.content_snapshot || "Sin detalle";
        const typeLabel = alert.type === "security" ? "Seguridad" : alert.type === "pedagogical" ? "Pedagógica" : "Técnica";
        
        alertsMarkdown += `- [Alerta ${typeLabel}] **${studentName}**: ${reason}\n`;
      });
    }

    const realtimeContext = `
### CONTEXTO DE LA SESIÓN EN TIEMPO REAL

**Información general:**
- **Título de la actividad:** ${sessionData.title}
- **Objetivo pedagógico:** ${sessionData.pedagogical_objective}

**Estudiantes conectados (Límite MVP: Max 10):**
${studentsMarkdown}
**Alertas activas sin resolver:**
${alertsMarkdown}
    `.trim();

    // Combinar el system prompt base con el contexto inyectado
    const systemInstruction = `${basePrompt}\n\n${realtimeContext}`;

    // 5. Formatear el historial de chat compatible con Gemini
    let formattedContents: any[] = [];
    if (messages && Array.isArray(messages) && messages.length > 0) {
      formattedContents = messages
        .filter((m: any) => m.role === "user" || m.role === "assistant" || m.role === "model")
        .map((m: any) => {
          const role = m.role === "assistant" || m.role === "model" ? "model" : "user";
          let text = "";
          if (typeof m.content === "string") {
            text = m.content;
          } else if (Array.isArray(m.parts) && m.parts[0]?.text) {
            text = m.parts[0].text;
          } else if (typeof m.text === "string") {
            text = m.text;
          }
          return {
            role,
            parts: [{ text }]
          };
        });

      if (message) {
        const lastMsgText = formattedContents[formattedContents.length - 1]?.parts?.[0]?.text;
        if (lastMsgText !== message) {
          formattedContents.push({
            role: "user",
            parts: [{ text: message }]
          });
        }
      }
    } else if (message) {
      formattedContents.push({
        role: "user",
        parts: [{ text: message }]
      });
    } else {
      return NextResponse.json({ error: "MISSING_MESSAGES" }, { status: 400 });
    }

    // 6. Configurar y llamar a Gemini con SDK `@google/genai`
    // Usamos temperature: 0.2 para evitar alucinaciones y asegurar precisión técnica sobre el estado
    const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY });
    
    let responseText = "";
    let retries = 0;
    const MAX_RETRIES = 3;
    const INITIAL_DELAY = 1000;

    while (true) {
      try {
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: formattedContents,
          config: {
            systemInstruction: systemInstruction,
            temperature: 0.2, // Temperatura muy baja para máxima precisión
          }
        });
        responseText = response.text || "";
        break; // Éxito
      } catch (error: any) {
        retries++;
        if (error?.status === 503 && retries <= MAX_RETRIES) {
          const delay = INITIAL_DELAY * Math.pow(2, retries - 1);
          console.warn(`[CopilotAPI] Gemini API 503: Reintento ${retries}/${MAX_RETRIES} en ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        throw error;
      }
    }

    return NextResponse.json({
      role: "assistant",
      content: responseText
    });

  } catch (error) {
    console.error("[CopilotAPI] Error interno en el route handler:", error);
    return NextResponse.json({ error: "INTERNAL_SERVER_ERROR" }, { status: 500 });
  }
}
