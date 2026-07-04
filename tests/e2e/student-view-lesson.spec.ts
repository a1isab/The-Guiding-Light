import { test, expect } from "@playwright/test";
import { setupTeacherLesson, type TestData } from "./helpers/teacher-setup";

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

test.describe("student lesson flow", () => {
  test("lesson content view shows mark viewed button", async ({ browser }) => {
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
    await teacherContext.close();

    const mainPage = await browser.newPage();
    await loginAsStudent(mainPage);
    await mainPage.goto(
      `/en/dashboard/classes/${data.classId}/courses/${data.courseId}/lessons/${data.lessonId}`
    );
    await expect(mainPage.getByTestId("mark-viewed")).toBeVisible();
    await mainPage.close();
  });

  test("no quiz message shown when lesson has no quiz", async ({ browser }) => {
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
    await teacherContext.close();

    const mainPage = await browser.newPage();
    await loginAsStudent(mainPage);
    await mainPage.goto(
      `/en/dashboard/classes/${data.classId}/courses/${data.courseId}/lessons/${data.lessonId}`
    );
    await expect(mainPage.getByText("No quiz for this lesson.")).toBeVisible();
    await mainPage.close();
  });
});
