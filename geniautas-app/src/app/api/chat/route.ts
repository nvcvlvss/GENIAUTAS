import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@/lib/supabase/server";
import { validateInput } from "@/lib/ai/moderation";
import { getSystemPrompt } from "@/lib/ai/prompts";

export async function POST(req: Request) {
  try {
    const { message, studentSessionId, sessionId } = await req.json();

    if (!message || !studentSessionId || !sessionId) {
      return NextResponse.json({ error: "MISSING_FIELDS" }, { status: 400 });
    }

    // 1. Validate Input (Moderation)
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

    const supabase = await createClient();

    // 2. Fetch Session context
    const { data: session, error: sessionError } = await supabase
      .from("sessions")
      .select("status, agent_config, pedagogical_objective")
      .eq("id", sessionId)
      .single();

    if (sessionError || !session) {
      return NextResponse.json({ error: "SESSION_NOT_FOUND" }, { status: 404 });
    }

    if (session.status === "paused" || session.status === "closed") {
      return NextResponse.json({ error: "SESSION_NOT_ACTIVE" }, { status: 403 });
    }

    // 3. Fetch Roadmap tasks
    const { data: tasks } = await supabase
      .from("roadmap_tasks")
      .select("title")
      .eq("session_id", sessionId)
      .order("order_index", { ascending: true });

    const taskTitles = (tasks ?? []).map(t => t.title);

    // 4. Fetch Chat History (Last 10 messages to keep context lean)
    const { data: history } = await supabase
      .from("messages")
      .select("role, content")
      .eq("student_session_id", studentSessionId)
      .order("created_at", { ascending: true })
      .limit(10);

    // 5. Initialize Gemini
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);
    const systemPrompt = getSystemPrompt(
      session.agent_config,
      session.pedagogical_objective,
      taskTitles
    );

    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      systemInstruction: systemPrompt
    });

    const chat = model.startChat({
      history: (history ?? [])
        .filter(m => m.role !== "system")
        .map(m => ({
          role: m.role === "assistant" ? "model" : "user",
          parts: [{ text: m.content }],
        })),
      generationConfig: {
        maxOutputTokens: 2048,
      },
    });

    // 5.1. Execute with automatic retries for 503 errors
    let result;
    let retries = 0;
    const MAX_RETRIES = 3;
    const INITIAL_DELAY = 1000; // 1 second

    while (true) {
      try {
        result = await chat.sendMessage(message);
        break; // Success!
      } catch (error: any) {
        retries++;
        // If it's a 503 and we have retries left, wait and try again
        if (error.status === 503 && retries <= MAX_RETRIES) {
          const delay = INITIAL_DELAY * Math.pow(2, retries - 1);
          console.warn(`Gemini API 503: High demand. Retry ${retries}/${MAX_RETRIES} in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        // If other error or no retries left, throw it
        throw error;
      }
    }

    const responseText = result.response.text();

    // 6. Save messages to DB
    // User message
    await supabase.from("messages").insert({
      student_session_id: studentSessionId,
      role: "user",
      content: message
    });

    // Assistant response
    const { data: assistantMsg, error: saveError } = await supabase.from("messages").insert({
      student_session_id: studentSessionId,
      role: "assistant",
      content: responseText
    }).select().single();

    if (saveError) {
      console.error("SAVE_MESSAGE_ERROR:", saveError);
    }

    return NextResponse.json({ 
      role: "assistant", 
      content: responseText,
      id: assistantMsg?.id
    });

  } catch (error) {
    console.error("CHAT_API_ERROR:", error);
    return NextResponse.json({ error: "INTERNAL_SERVER_ERROR" }, { status: 500 });
  }
}
