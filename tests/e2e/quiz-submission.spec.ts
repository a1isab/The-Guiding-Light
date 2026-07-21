import { test, expect } from "@playwright/test";
import { setupTeacherLesson } from "./helpers/teacher-setup";
import { createQuizQuestions } from "./helpers/quiz-setup";

const STUDENT_EMAIL = "student@theguidinglight.com";
const STUDENT_PASSWORD = "Student123!";
const SUPABASE_URL = "https://vpqfvranmdhsxfsynvbw.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZwcWZ2cmFubWRoc3hmc3ludmJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4ODQxMDAsImV4cCI6MjA5NzQ2MDEwMH0.6QF9SFBcl_c5xFVKxYBduVZuXGRjDqrA_AtFyX4O_gM";

function decodeSupabaseCookie(cookieValue: string): { access_token: string; user?: { id: string } } | null {
  try {
    const b64 = cookieValue.replace(/^base64-/, "");
    return JSON.parse(atob(b64));
  } catch {
    return null;
  }
}

async function getCookieValue(page: import("@playwright/test").Page, keyPattern: string): Promise<string | null> {
  return page.evaluate((pattern) => {
    const cookies = document.cookie.split("; ").reduce((acc: Record<string, string>, c) => {
      const [k, ...v] = c.split("=");
      acc[k] = v.join("=");
      return acc;
    }, {});
    const key = Object.keys(cookies).find((k) => k.includes(pattern));
    return key ? cookies[key] : null;
  }, keyPattern) as Promise<string | null>;
}

async function loginAsStudent(page: import("@playwright/test").Page): Promise<void> {
  await page.goto("/en/auth/login");
  await page.getByTestId("login-email").fill(STUDENT_EMAIL);
  await page.getByTestId("login-password").fill(STUDENT_PASSWORD);
  await page.getByTestId("login-submit").click();
  await page.waitForURL(/\/en\/dashboard/);
}

async function getStudentUserId(page: import("@playwright/test").Page): Promise<string | null> {
  const raw = await getCookieValue(page, "-auth-token");
  if (!raw) return null;
  return decodeSupabaseCookie(raw)?.user?.id ?? null;
}

async function getTeacherAccessToken(page: import("@playwright/test").Page): Promise<string | null> {
  const raw = await getCookieValue(page, "-auth-token");
  if (!raw) return null;
  return decodeSupabaseCookie(raw)?.access_token ?? null;
}

async function enrollStudent(
  teacherPage: import("@playwright/test").Page,
  classId: string,
  studentUserId: string
): Promise<void> {
  const accessToken = await getTeacherAccessToken(teacherPage);
  expect(accessToken).toBeTruthy();

  const ok = await teacherPage.evaluate(
    async ({ url, anonKey, token, cid, sid }) => {
      const res = await fetch(`${url}/rest/v1/class_members`, {
        method: "POST",
        headers: {
          apikey: anonKey,
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify({ class_id: cid, student_id: sid }),
      });
      return res.ok;
    },
    { url: SUPABASE_URL, anonKey: SUPABASE_ANON_KEY, token: accessToken, cid: classId, sid: studentUserId }
  );
  expect(ok).toBe(true);
}

async function submitQuiz(
  studentPage: import("@playwright/test").Page,
  lessonId: string,
  answers: number[]
): Promise<{ status: number; body: any }> {
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
    await loginAsStudent(studentPage);
    const studentUserId = await getStudentUserId(studentPage);
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
    await loginAsStudent(mainPage);

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
    await loginAsStudent(studentPage);
    const studentUserId = await getStudentUserId(studentPage);
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
    await loginAsStudent(mainPage);

    const result = await submitQuiz(mainPage, data.lessonId, [0, 0, 0]);
    expect(result.status).toBe(200);
    expect(result.body.passed).toBe(false);
    expect(result.body.score).toBe(0);
    await mainContext.close();
  });

  test("3 fails within window returns lockout 429", async ({ browser }) => {
    const studentContext = await browser.newContext();
    const studentPage = await studentContext.newPage();
    await loginAsStudent(studentPage);
    const studentUserId = await getStudentUserId(studentPage);
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
    await loginAsStudent(mainPage);

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
    await loginAsStudent(studentPage);
    const studentUserId = await getStudentUserId(studentPage);
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
    await loginAsStudent(mainPage);

    const result = await submitQuiz(mainPage, data.lessonId, [1, 2, 2]);
    expect(result.status).toBe(200);
    expect(result.body.passed).toBe(true);
    expect(typeof result.body.attemptsRemaining).toBe("number");
    await mainContext.close();
  });
});
