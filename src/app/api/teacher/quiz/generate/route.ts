import { NextRequest, NextResponse } from "next/server";
import { createApiSupabaseClient, requireTeacher } from "@/lib/supabase-api";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);

function buildPrompt(content: string, count: number): string {
  return `You are an Islamic education assistant. Based on the lesson content provided, generate exactly ${count} quiz questions to test understanding.

Each question must have:
- A clear question
- 4 multiple choice options (A, B, C, D)
- The index of the correct answer (0-based)

Return your response as JSON in this exact format (no markdown, no code fences):
{
  "questions": [
    {
      "question": "What is the first pillar of Islam?",
      "options": ["Fasting", "Prayer", "Shahada", "Zakat"],
      "correct": 2
    }
  ]
}

Generate exactly ${count} questions. Make them educational, not trick questions. Base them strictly on the lesson content provided.`;
}

export async function POST(request: NextRequest) {
  try {
    const { supabase, applyCookies } = createApiSupabaseClient(request);
    const teacherId = await requireTeacher(supabase);
    if (!teacherId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { content, questionCount } = await request.json();

    if (!content || typeof content !== "string" || content.trim().length < 10) {
      return NextResponse.json({ error: "Lesson content is too short" }, { status: 400 });
    }

    const count = Math.min(Math.max(Number(questionCount) || 5, 3), 10);

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.4,
        maxOutputTokens: 2048,
      },
    });

    const result = await model.generateContent(buildPrompt(content, count));
    const text = result.response.text();

    const parsed = JSON.parse(text);
    if (!parsed.questions || !Array.isArray(parsed.questions) || parsed.questions.length !== count) {
      throw new Error("Invalid quiz response format");
    }

    return applyCookies(NextResponse.json({ questions: parsed.questions }));
  } catch (err) {
    console.error("Quiz generation error:", err);
    return NextResponse.json(
      { error: "Failed to generate quiz questions. Please try again." },
      { status: 500 }
    );
  }
}
