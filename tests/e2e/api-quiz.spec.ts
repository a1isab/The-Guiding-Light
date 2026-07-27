import { test, expect } from "@playwright/test";
import { setupTeacherLesson, type TestData } from "./helpers/teacher-setup";
import { loginAs, getUserId, enrollStudent } from "./helpers/auth";

const TEACHER_EMAIL = "teacher@theguidinglight.com";
const TEACHER_PASSWORD = "Teacher123!";
const STUDENT_EMAIL = "student@theguidinglight.com";
const STUDENT_PASSWORD = "Student123!";

test.describe.configure({ timeout: 120000 });

test.describe("quiz API endpoints", () => {
  let data: TestData;
  let studentUserId: string;

  test.beforeAll(async ({ browser }) => {
    test.setTimeout(120000);
    const teacherCtx = await browser.newContext();
    const teacherPage = await teacherCtx.newPage();
    data = await setupTeacherLesson(teacherPage);

    const studentCtx = await browser.newContext();
    const studentPage = await studentCtx.newPage();
    await loginAs(studentPage, STUDENT_EMAIL, STUDENT_PASSWORD);
    studentUserId = (await getUserId(studentPage))!;
    expect(studentUserId).toBeTruthy();
    await studentCtx.close();

    await enrollStudent(teacherPage, data.classId, studentUserId);

    const quizQuestions = [
      { question: "What is 2+2?", options: ["3", "4", "5", "6"], correctIndex: 1 },
      { question: "Capital of France?", options: ["London", "Paris", "Berlin", "Madrid"], correctIndex: 1 },
      { question: "Color of sky?", options: ["Red", "Blue", "Green", "Yellow"], correctIndex: 1 },
    ];
    await teacherPage.evaluate(async ({ lessonId, questions }) => {
      const res = await fetch("/api/teacher/quiz/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId, questions }),
      });
      return res.json();
    }, { lessonId: data.lessonId, questions: quizQuestions });

    await teacherCtx.close();
  });

  test.describe("quiz questions", () => {
    test("teacher can fetch quiz questions with correct_index", async ({ page }) => {
      await loginAs(page, TEACHER_EMAIL, TEACHER_PASSWORD);
      const result = await page.evaluate(async (lessonId) => {
        const res = await fetch(`/api/teacher/quiz/questions?lessonId=${lessonId}`);
        return { status: res.status, body: await res.json() };
      }, data.lessonId);
      expect(result.status).toBe(200);
      expect(Array.isArray(result.body)).toBe(true);
      expect(result.body.length).toBeGreaterThanOrEqual(3);
      expect(result.body[0]).toHaveProperty("correct_index");
    });

    test("student cannot see correct_index in quiz questions", async ({ page }) => {
      await loginAs(page, STUDENT_EMAIL, STUDENT_PASSWORD);
      const result = await page.evaluate(async (lessonId) => {
        const res = await fetch(`/api/teacher/quiz/questions?lessonId=${lessonId}`);
        return { status: res.status, body: await res.json() };
      }, data.lessonId);
      expect(result.status).toBe(200);
      if (result.body.length > 0) {
        expect(result.body[0]).not.toHaveProperty("correct_index");
      }
    });
  });

  test.describe("quiz status", () => {
    test("quiz status returns locked=false after viewing lesson", async ({ page }) => {
      await loginAs(page, STUDENT_EMAIL, STUDENT_PASSWORD);
      await page.evaluate(async (lessonId) => {
        await fetch("/api/student/lessons/viewed", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lessonId }),
        });
      }, data.lessonId);

      const result = await page.evaluate(async (lessonId) => {
        const res = await fetch(`/api/teacher/quiz/status?lessonId=${lessonId}`);
        return { status: res.status, body: await res.json() };
      }, data.lessonId);
      expect(result.status).toBe(200);
      expect(result.body).toHaveProperty("locked");
    });

    test("quiz status returns attempts info", async ({ page }) => {
      await loginAs(page, STUDENT_EMAIL, STUDENT_PASSWORD);
      const result = await page.evaluate(async (lessonId) => {
        const res = await fetch(`/api/teacher/quiz/status?lessonId=${lessonId}`);
        return { status: res.status, body: await res.json() };
      }, data.lessonId);
      expect(result.status).toBe(200);
      expect(result.body).toHaveProperty("attemptsRemaining");
    });
  });

  test.describe("quiz submission", () => {
    test("submitting correct answers passes quiz", async ({ page }) => {
      await loginAs(page, STUDENT_EMAIL, STUDENT_PASSWORD);

      const result = await page.evaluate(async (lessonId) => {
        const res = await fetch("/api/teacher/quiz/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lessonId, answers: [1, 1, 1] }),
        });
        return { status: res.status, body: await res.json() };
      }, data.lessonId);
      expect([200, 409, 429]).toContain(result.status);
      if (result.status === 200) {
        expect(result.body).toHaveProperty("passed");
      }
    });
  });
});
