                                    import { test, expect } from "@playwright/test";
import { setupTeacherLesson } from "./helpers/teacher-setup";

const STUDENT_EMAIL = "student@theguidinglight.com";
const STUDENT_PASSWORD = "Student123!";

// Read Supabase URL and anon key from env (with hosted fallback)
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://nbwclxbdiuzfxdnbjmti.supabase.co";
const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5id2NseGJkaXV6ZnhkbmJqbXRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU2NzAyMTQsImV4cCI6MjEwMTI0NjIxNH0.PC_THbSqeGKWJihozd4Vwdg3Rvlwr5LUlDOHblx2yig";

function decodeSupabaseCookie(cookieValue: string): { access_token: string; user?: { id: string } } | null {
  try {
    const b64 = cookieValue.replace(/^base64-/, "");
    return JSON.parse(Buffer.from(b64, "base64url").toString("utf-8"));
  } catch {
    try {
      const b64 = cookieValue.replace(/^base64-/, "");
      return JSON.parse(Buffer.from(b64, "base64").toString("utf-8"));
    } catch {
      return null;
    }
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
  await page.evaluate(() => localStorage.setItem("tour_completed", "true"));
  await page.getByTestId("login-email").fill(STUDENT_EMAIL);
  await page.getByTestId("login-password").fill(STUDENT_PASSWORD);
  await page.getByTestId("login-submit").click();
  try {
    await page.waitForURL(/\/en\/dashboard/, { timeout: 15000 });
  } catch {
    const { loginWithCachedToken } = await import("./helpers/auth");
    await loginWithCachedToken(page, STUDENT_EMAIL, STUDENT_PASSWORD, /\/en\/dashboard/);
  }
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
    test.setTimeout(60000);
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
    test.setTimeout(60000);
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
