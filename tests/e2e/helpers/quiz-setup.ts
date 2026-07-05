import { type Page } from "@playwright/test";

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
  const ok = await teacherPage.evaluate(
    async ([lid, qs]) => {
      const res = await fetch("/api/teacher/quiz/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonId: lid,
          questions: qs.map((q) => ({
            question: q.question,
            options: q.options,
            correctIndex: q.correct_index,
          })),
        }),
      });
      if (!res.ok) {
        const body = await res.text();
        throw new Error(`Failed to create quiz questions (${res.status}): ${body}`);
      }
      return true;
    },
    [lessonId, questions] as const
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
