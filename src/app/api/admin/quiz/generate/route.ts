import { NextRequest, NextResponse } from "next/server";
import { createApiSupabaseClient, requireTeacher } from "@/lib/supabase-api";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);

const QUIZ_PROMPT = `You are an Islamic education assistant. Based on the lesson content provided, generate exactly 5 quiz questions to test understanding.

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

Generate exactly 5 questions. Make them educational, not trick questions. Base them strictly on the lesson content provided.`;

export async function POST(request: NextRequest) {
  try {
    const { supabase, applyCookies } = createApiSupabaseClient(request);
    const teacherId = await requireTeacher(supabase);
    if (!teacherId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { content } = await request.json();

    if (!content || typeof content !== "string" || content.trim().length < 10) {
      return NextResponse.json({ error: "Lesson content is too short" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.4,
        maxOutputTokens: 2048,
      },
    });

    const result = await model.generateContent(QUIZ_PROMPT + "\n\n--- LESSON CONTENT ---\n" + content);
    const text = result.response.text();

    const parsed = JSON.parse(text);
    if (!parsed.questions || !Array.isArray(parsed.questions) || parsed.questions.length !== 5) {
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
