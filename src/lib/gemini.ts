import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);

const QUIZ_PROMPT = `You are an Islamic education assistant. Based on the lesson content provided, generate 5 quiz questions to test understanding.

Each question must have:
- A clear question
- 4 multiple choice options (A, B, C, D)
- The correct answer letter
- A brief explanation of why it's correct

Return your response as JSON in this exact format:
{
  "questions": [
    {
      "question": "What is the first pillar of Islam?",
      "options": ["Fasting", "Prayer", "Shahada", "Zakat"],
      "correctAnswer": "C",
      "explanation": "The Shahada (declaration of faith) is the first and most fundamental pillar of Islam."
    }
  ]
}

Generate exactly 5 questions. Make them educational, not trick questions. Base them strictly on the lesson content provided.`;

export async function generateQuiz(
  lessonContent: string
): Promise<{ question: string; options: string[]; correctAnswer: string; explanation: string }[]> {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.4,
      maxOutputTokens: 2048,
    },
  });

  const result = await model.generateContent(QUIZ_PROMPT + "\n\n--- LESSON CONTENT ---\n" + lessonContent);
  const text = result.response.text();

  try {
    const parsed = JSON.parse(text);
    if (!parsed.questions || !Array.isArray(parsed.questions) || parsed.questions.length !== 5) {
      throw new Error("Invalid quiz response format");
    }
    return parsed.questions;
  } catch (e) {
    console.error("Failed to parse Gemini quiz response:", e);
    throw new Error("Failed to generate quiz questions. Please try again.");
  }
}

export async function answerQuestion(
  question: string,
  context: string
): Promise<string> {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    generationConfig: {
      temperature: 0.4,
      maxOutputTokens: 1024,
    },
    systemInstruction: `You are a helpful Islamic learning assistant. Answer the student's question based on the lesson context provided. Be concise, accurate, and reference the lesson content when possible. If the question is outside the scope of the lesson, politely say so.`,
  });

  const result = await model.generateContent(
    `Student question: ${question}\n\nLesson context: ${context}`
  );
  return result.response.text();
}
