import { test, expect } from "@playwright/test";
import { setupTeacherLesson, type TestData } from "./helpers/teacher-setup";
import { loginAs, getUserId, enrollStudent, getAccessToken } from "./helpers/auth";

const STUDENT_EMAIL = "student@theguidinglight.com";
const STUDENT_PASSWORD = "Student123!";

test.describe.configure({ timeout: 120000 });

test.describe("student API endpoints", () => {
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
    await teacherCtx.close();
  });

  test.describe("bookmarks", () => {
    test("GET /api/student/bookmarks returns array", async ({ page }) => {
      await loginAs(page, STUDENT_EMAIL, STUDENT_PASSWORD);
      const result = await page.evaluate(async () => {
        const res = await fetch("/api/student/bookmarks");
        return { status: res.status, body: await res.json() };
      });
      expect(result.status).toBe(200);
      expect(Array.isArray(result.body)).toBe(true);
    });

    test("POST /api/student/bookmarks toggles bookmark", async ({ page }) => {
      await loginAs(page, STUDENT_EMAIL, STUDENT_PASSWORD);
      const result = await page.evaluate(async (lessonId) => {
        const res = await fetch("/api/student/bookmarks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lessonId }),
        });
        return { status: res.status, body: await res.json() };
      }, data.lessonId);
      expect([200, 201, 409]).toContain(result.status);
    });
  });

  test.describe("lesson viewed", () => {
    test("POST /api/student/lessons/viewed marks lesson as viewed", async ({ page }) => {
      await loginAs(page, STUDENT_EMAIL, STUDENT_PASSWORD);
      const result = await page.evaluate(async (lessonId) => {
        const res = await fetch("/api/student/lessons/viewed", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lessonId }),
        });
        return { status: res.status, body: await res.json() };
      }, data.lessonId);
      expect([200, 201, 409]).toContain(result.status);
    });
  });

  test.describe("comments", () => {
    test("GET /api/student/lessons/comments returns array", async ({ page }) => {
      await loginAs(page, STUDENT_EMAIL, STUDENT_PASSWORD);
      const result = await page.evaluate(async (lessonId) => {
        const res = await fetch(`/api/student/lessons/comments?lessonId=${lessonId}`);
        return { status: res.status, body: await res.json() };
      }, data.lessonId);
      expect(result.status).toBe(200);
      expect(Array.isArray(result.body)).toBe(true);
    });

    test("POST /api/student/lessons/comments creates comment", async ({ page }) => {
      await loginAs(page, STUDENT_EMAIL, STUDENT_PASSWORD);
      const commentText = `E2E test comment ${Date.now()}`;
      const result = await page.evaluate(async ({ lessonId, body }) => {
        const res = await fetch("/api/student/lessons/comments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lessonId, body }),
        });
        return { status: res.status, data: await res.json() };
      }, { lessonId: data.lessonId, body: commentText });
      expect([200, 201]).toContain(result.status);
    });
  });

  test.describe("announcements", () => {
    test("GET /api/student/announcements returns array", async ({ page }) => {
      await loginAs(page, STUDENT_EMAIL, STUDENT_PASSWORD);
      const result = await page.evaluate(async (classId) => {
        const res = await fetch(`/api/student/announcements?classId=${classId}`);
        return { status: res.status, body: await res.json() };
      }, data.classId);
      expect(result.status).toBe(200);
      expect(Array.isArray(result.body)).toBe(true);
    });
  });

  test.describe("certificates", () => {
    test("GET /api/student/certificates returns array", async ({ page }) => {
      await loginAs(page, STUDENT_EMAIL, STUDENT_PASSWORD);
      const result = await page.evaluate(async () => {
        const res = await fetch("/api/student/certificates");
        return { status: res.status, body: await res.json() };
      });
      expect(result.status).toBe(200);
      expect(Array.isArray(result.body)).toBe(true);
    });
  });
});

test.describe("unauthenticated student API access", () => {
  test("bookmarks without auth returns 401", async ({ page }) => {
    await page.goto("/en/auth/login");
    const result = await page.evaluate(async () => {
      const res = await fetch("/api/student/bookmarks");
      return { status: res.status };
    });
    expect(result.status).toBe(401);
  });

  test("comments without auth returns 401", async ({ page }) => {
    await page.goto("/en/auth/login");
    const result = await page.evaluate(async () => {
      const res = await fetch("/api/student/lessons/comments?lessonId=00000000-0000-0000-0000-000000000000");
      return { status: res.status };
    });
    expect(result.status).toBe(401);
  });
});
