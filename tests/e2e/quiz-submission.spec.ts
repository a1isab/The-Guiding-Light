import { test, expect } from "@playwright/test";
import { setupTeacherLesson } from "./helpers/teacher-setup";
import { createQuizQuestions } from "./helpers/quiz-setup";
import { loginAs, getUserId, enrollStudent } from "./helpers/auth";

const STUDENT_EMAIL = "student@theguidinglight.com";
const STUDENT_PASSWORD = "Student123!";

async function submitQuiz(
  studentPage: import("@playwright/test").Page,
  lessonId: string,
  answers: number[]
): Promise<{ status: number; body: Record<string, unknown> }> {
  return studentPage.evaluate(
    async ([lid, ans]) => {
      const res = await fetch("/api/teacher/quiz/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId: lid, answers: ans }),
      });
      return { status: res.status, body: await res.json() };
    },
    [lessonId, answers] as const
  );
}

test.describe.configure({ timeout: 120000 });
test.describe("quiz submission", () => {
  test("passing quiz returns passed: true", async ({ browser }) => {
    const studentContext = await browser.newContext();
    const studentPage = await studentContext.newPage();
    await loginAs(studentPage, STUDENT_EMAIL, STUDENT_PASSWORD);
    const studentUserId = await getUserId(studentPage);
    expect(studentUserId).toBeTruthy();
    await studentContext.close();

    const teacherContext = await browser.newContext();
    const teacherPage = await teacherContext.newPage();
    const data = await setupTeacherLesson(teacherPage);
    await enrollStudent(teacherPage, data.classId, studentUserId!);
    await createQuizQuestions(teacherPage, data.lessonId);
    await teacherContext.close();

    const mainContext = await browser.newContext();
    const mainPage = await mainContext.newPage();
    await loginAs(mainPage, STUDENT_EMAIL, STUDENT_PASSWORD);

    const result = await submitQuiz(mainPage, data.lessonId, [1, 2, 2]);
    expect(result.status).toBe(200);
    expect(result.body.passed).toBe(true);
    expect(result.body.score).toBe(3);
    expect(result.body.total).toBe(3);
    await mainContext.close();
  });

  test("failing quiz returns passed: false", async ({ browser }) => {
    const studentContext = await browser.newContext();
    const studentPage = await studentContext.newPage();
    await loginAs(studentPage, STUDENT_EMAIL, STUDENT_PASSWORD);
    const studentUserId = await getUserId(studentPage);
    expect(studentUserId).toBeTruthy();
    await studentContext.close();

    const teacherContext = await browser.newContext();
    const teacherPage = await teacherContext.newPage();
    const data = await setupTeacherLesson(teacherPage);
    await enrollStudent(teacherPage, data.classId, studentUserId!);
    await createQuizQuestions(teacherPage, data.lessonId);
    await teacherContext.close();

    const mainContext = await browser.newContext();
    const mainPage = await mainContext.newPage();
    await loginAs(mainPage, STUDENT_EMAIL, STUDENT_PASSWORD);

    const result = await submitQuiz(mainPage, data.lessonId, [0, 0, 0]);
    expect(result.status).toBe(200);
    expect(result.body.passed).toBe(false);
    expect(result.body.score).toBe(0);
    await mainContext.close();
  });

  test("3 fails within window returns lockout 429", async ({ browser }) => {
    const studentContext = await browser.newContext();
    const studentPage = await studentContext.newPage();
    await loginAs(studentPage, STUDENT_EMAIL, STUDENT_PASSWORD);
    const studentUserId = await getUserId(studentPage);
    expect(studentUserId).toBeTruthy();
    await studentContext.close();

    const teacherContext = await browser.newContext();
    const teacherPage = await teacherContext.newPage();
    const data = await setupTeacherLesson(teacherPage);
    await enrollStudent(teacherPage, data.classId, studentUserId!);
    await createQuizQuestions(teacherPage, data.lessonId);
    await teacherContext.close();

    const mainContext = await browser.newContext();
    const mainPage = await mainContext.newPage();
    await loginAs(mainPage, STUDENT_EMAIL, STUDENT_PASSWORD);

    for (let i = 0; i < 3; i++) {
      const r = await submitQuiz(mainPage, data.lessonId, [0, 0, 0]);
      expect(r.status).toBe(200);
      expect(r.body.passed).toBe(false);
    }

    const locked = await submitQuiz(mainPage, data.lessonId, [0, 0, 0]);
    expect(locked.status).toBe(429);
    expect(locked.body.locked).toBe(true);
    expect(typeof locked.body.retryAfter).toBe("number");
    await mainContext.close();
  });

  test("passing quiz shows attemptsRemaining", async ({ browser }) => {
    const studentContext = await browser.newContext();
    const studentPage = await studentContext.newPage();
    await loginAs(studentPage, STUDENT_EMAIL, STUDENT_PASSWORD);
    const studentUserId = await getUserId(studentPage);
    expect(studentUserId).toBeTruthy();
    await studentContext.close();

    const teacherContext = await browser.newContext();
    const teacherPage = await teacherContext.newPage();
    const data = await setupTeacherLesson(teacherPage);
    await enrollStudent(teacherPage, data.classId, studentUserId!);
    await createQuizQuestions(teacherPage, data.lessonId);
    await teacherContext.close();

    const mainContext = await browser.newContext();
    const mainPage = await mainContext.newPage();
    await loginAs(mainPage, STUDENT_EMAIL, STUDENT_PASSWORD);

    const result = await submitQuiz(mainPage, data.lessonId, [1, 2, 2]);
    expect(result.status).toBe(200);
    expect(result.body.passed).toBe(true);
    expect(typeof result.body.attemptsRemaining).toBe("number");
    await mainContext.close();
  });
});
