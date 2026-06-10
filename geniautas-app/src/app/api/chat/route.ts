import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { createClient } from "@/lib/supabase/server";
import { validateInput } from "@/lib/ai/moderation";
import { getSystemPrompt } from "@/lib/prompt-loader";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, messages } = body;
    
    // Suportar tanto studentId como studentSessionId de forma segura
    const studentSessionId = body.studentId || body.studentSessionId;
    const sessionId = body.sessionId;

    if (!studentSessionId || !sessionId) {
      return NextResponse.json({ error: "MISSING_FIELDS" }, { status: 400 });
    }

    // 1. Validar el mensaje del alumno usando el validador de moderación existente (si se envió un mensaje)
    if (message) {
      const moderation = validateInput(message);
      if (!moderation.isValid) {
        const supabase = await createClient();
        await supabase.from("alerts").insert({
          session_id: sessionId,
          student_session_id: studentSessionId,
          type: "security",
          content_snapshot: `Mensaje bloqueado: "${message}" (Palabra: ${moderation.word})`
        });

        return NextResponse.json({ 
          error: "MODERATION_BLOCKED", 
          word: moderation.word 
        }, { status: 400 });
      }
    }

    const supabase = await createClient();

    // 2. Obtener el contexto de la sesión (status, agent_config, pedagogical_objective)
    const { data: session, error: sessionError } = await supabase
      .from("sessions")
      .select("status, agent_config, pedagogical_objective")
      .eq("id", sessionId)
      .single();

    if (sessionError || !session) {
      return NextResponse.json({ error: "SESSION_NOT_FOUND" }, { status: 404 });
    }

    // Si la sesión está pausada, no se permite chatear
    if (session.status === "paused") {
      return NextResponse.json({ error: "SESSION_NOT_ACTIVE" }, { status: 403 });
    }

    const isClosed = session.status === "closed";

    // 3. Cargar el System Prompt correspondiente
    // Mapeo: constructivista -> Pensabot.md, conductual/cognitivista -> Construbot.md
    const agentConfig = session.agent_config;
    let promptFilename: "Pensabot" | "Construbot" = "Pensabot";
    
    if (agentConfig === "constructivista") {
      promptFilename = "Pensabot";
    } else if (agentConfig === "cognitivista" || (agentConfig as string) === "conductual") {
      promptFilename = "Construbot";
    }

    let systemInstruction = getSystemPrompt(promptFilename);

    // Obtener las tareas del Roadmap para inyectar al final del prompt
    const { data: tasks } = await supabase
      .from("roadmap_tasks")
      .select("title")
      .eq("session_id", sessionId)
      .order("order_index", { ascending: true });

    const taskTitles = (tasks ?? []).map(t => t.title);

    // Enriquecer el system prompt con el objetivo y roadmap en tiempo real
    systemInstruction += `\n\n### CONTEXTO DE LA ACTIVIDAD\n`;
    systemInstruction += `- **Objetivo Pedagógico de la Sesión:** ${session.pedagogical_objective}\n`;
    if (taskTitles.length > 0) {
      systemInstruction += `- **Hoja de Ruta (Roadmap):**\n`;
      taskTitles.forEach((title, idx) => {
        systemInstruction += `  ${idx + 1}. ${title}\n`;
      });
    }

    // 4. Formatear y construir el historial de conversación en formato compatible con Gemini
    let formattedContents: any[] = [];

    if (messages && Array.isArray(messages) && messages.length > 0) {
      // Usar historial enviado en la petición
      formattedContents = messages
        .filter((m: any) => m.role === "user" || m.role === "assistant" || m.role === "model" || m.role === "system")
        .map((m: any) => {
          // Gemini solo soporta roles 'user' y 'model' en la conversación principal
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
        
      // Si el último mensaje enviado no coincide con el nuevo "message", lo agregamos
      if (message) {
        const lastMsgText = formattedContents[formattedContents.length - 1]?.parts?.[0]?.text;
        if (lastMsgText !== message) {
          formattedContents.push({
            role: "user",
            parts: [{ text: message }]
          });
        }
      }
    } else {
      // Obtener el historial desde Supabase (últimos 10 mensajes) si no se pasa en el cuerpo
      const { data: dbHistory } = await supabase
        .from("messages")
        .select("role, content")
        .eq("student_session_id", studentSessionId)
        .order("created_at", { ascending: true })
        .limit(10);

      formattedContents = (dbHistory ?? [])
        .filter((m: any) => m.role !== "system")
        .map((m: any) => ({
          role: m.role === "assistant" ? "model" : "user",
          parts: [{ text: m.content }]
        }));

      if (message) {
        formattedContents.push({
          role: "user",
          parts: [{ text: message }]
        });
      }
    }

    // 5. Lógica de Comando de Cierre
    // Si la sesión está cerrada en Supabase, inyectamos "/finalizar" de forma invisible al final del chat
    if (isClosed) {
      const lastMsgText = formattedContents[formattedContents.length - 1]?.parts?.[0]?.text;
      if (lastMsgText !== "/finalizar") {
        formattedContents.push({
          role: "user", // Como mensaje de usuario para simular el comando del sistema textual
          parts: [{ text: "/finalizar" }]
        });
      }
    }

    // 6. Configurar y llamar a Gemini con SDK `@google/genai`
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
            temperature: 0.4,
          }
        });
        responseText = response.text || "";
        break; // Éxito
      } catch (error: any) {
        retries++;
        if (error?.status === 503 && retries <= MAX_RETRIES) {
          const delay = INITIAL_DELAY * Math.pow(2, retries - 1);
          console.warn(`[Gemini API] 503 detectado. Reintento ${retries}/${MAX_RETRIES} en ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        throw error;
      }
    }

    // 7. Guardar los mensajes en la base de datos Supabase
    // Guardar el mensaje del usuario
    if (message && !isClosed) {
      await supabase.from("messages").insert({
        student_session_id: studentSessionId,
        role: "user",
        content: message
      });
    }

    // Guardar la respuesta de la IA (sea la respuesta del bot o el resumen de finalización)
    const { data: assistantMsg, error: saveError } = await supabase.from("messages").insert({
      student_session_id: studentSessionId,
      role: "assistant",
      content: responseText
    }).select().single();

    if (saveError) {
      console.error("[ChatAPI] Error al guardar respuesta del asistente:", saveError);
    }

    return NextResponse.json({
      role: "assistant",
      content: responseText,
      id: assistantMsg?.id
    });

  } catch (error) {
    console.error("[ChatAPI] Error interno del servidor:", error);
    return NextResponse.json({ error: "INTERNAL_SERVER_ERROR" }, { status: 500 });
  }
}
