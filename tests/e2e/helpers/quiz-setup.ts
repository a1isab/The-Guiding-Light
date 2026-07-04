import { type Page } from "@playwright/test";

const SUPABASE_URL = "https://vpqfvranmdhsxfsynvbw.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZwcWZ2cmFubWRoc3hmc3ludmJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4ODQxMDAsImV4cCI6MjA5NzQ2MDEwMH0.6QF9SFBcl_c5xFVKxYBduVZuXGRjDqrA_AtFyX4O_gM";

interface QuizQuestion {
  question: string;
  options: string[];
  correct_index: number;
}

export async function createQuizQuestions(
  teacherPage: Page,
  lessonId: string,
  questions: QuizQuestion[] = defaultQuestions()
): Promise<void> {
  const [accessToken] = await teacherPage.evaluate(() => {
    const cookies = document.cookie.split("; ").reduce((acc: Record<string, string>, c) => {
      const [k, ...v] = c.split("=");
      acc[k] = v.join("=");
      return acc;
    }, {});
    const key = Object.keys(cookies).find((k) => k.includes("-auth-token"));
    if (!key) return [null];
    try {
      const b64 = cookies[key].replace(/^base64-/, "");
      const data = JSON.parse(atob(b64));
      return [data?.access_token || null];
    } catch {
      return [null];
    }
  });

  if (!accessToken) throw new Error("Could not extract teacher access token");

  const headers = {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  };

  const ok = await teacherPage.evaluate(
    async ({ url, hdrs, lid, qs }) => {
      await fetch(`${url}/rest/v1/teacher_quiz_questions?lesson_id=eq.${lid}`, {
        method: "DELETE",
        headers: hdrs,
      });

      const results = await Promise.all(
        qs.map((q: { question: string; options: string[]; correct_index: number }, i: number) =>
          fetch(`${url}/rest/v1/teacher_quiz_questions`, {
            method: "POST",
            headers: { ...hdrs, Prefer: "return=minimal" },
            body: JSON.stringify({
              lesson_id: lid,
              question: q.question,
              options: q.options,
              correct_index: q.correct_index,
              order_index: i,
            }),
          })
        )
      );
      return results.every((r) => r.ok);
    },
    { url: SUPABASE_URL, hdrs: headers, lid: lessonId, qs: questions }
  );

  if (!ok) throw new Error("Failed to create quiz questions");
}

function defaultQuestions(): QuizQuestion[] {
  return [
    {
      question: "What is 2+2?",
      options: ["3", "4", "5", "6"],
      correct_index: 1,
    },
    {
      question: "What is the capital of France?",
      options: ["London", "Berlin", "Paris", "Madrid"],
      correct_index: 2,
    },
    {
      question: "Which planet is known as the Red Planet?",
      options: ["Venus", "Jupiter", "Mars", "Saturn"],
      correct_index: 2,
    },
    {
      question: "What is the largest ocean?",
      options: ["Atlantic", "Indian", "Arctic", "Pacific"],
      correct_index: 3,
    },
    {
      question: "What year did WWII end?",
      options: ["1943", "1944", "1945", "1946"],
      correct_index: 2,
    },
  ];
}
