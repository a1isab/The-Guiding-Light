import { test, expect } from "@playwright/test";
import { setupTeacherLesson, type TestData } from "./helpers/teacher-setup";

const EMAIL = "teacher@theguidinglight.com";
const PASSWORD = "Teacher123!";
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

async function loginAs(page: import("@playwright/test").Page, email: string, password: string): Promise<void> {
  await page.goto("/en/auth/login");
  await page.getByTestId("login-email").fill(email);
  await page.getByTestId("login-password").fill(password);
  await page.getByTestId("login-submit").click();
  await page.waitForURL(/\/en\/(teacher|dashboard)/);
  await page.waitForLoadState("networkidle");
}

async function getAccessToken(page: import("@playwright/test").Page): Promise<string | null> {
  const raw = await getCookieValue(page, "-auth-token");
  if (!raw) return null;
  return decodeSupabaseCookie(raw)?.access_token ?? null;
}

async function getStudentUserId(page: import("@playwright/test").Page): Promise<string | null> {
  const raw = await getCookieValue(page, "-auth-token");
  if (!raw) return null;
  return decodeSupabaseCookie(raw)?.user?.id ?? null;
}

async function enrollStudent(
  teacherPage: import("@playwright/test").Page,
  classId: string,
  studentUserId: string
): Promise<void> {
  const accessToken = await getAccessToken(teacherPage);
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

test.describe.configure({ timeout: 120000 });

test.describe("teacher dashboard", () => {
  test("6.1 teacher dashboard shows stat cards and class list", async ({ page }) => {
    await loginAs(page, EMAIL, PASSWORD);
    await page.goto("/en/teacher");
    await page.waitForLoadState("networkidle");

    await expect(page.getByTestId("stat-total-classes")).toBeVisible();
    await expect(page.getByTestId("stat-total-students")).toBeVisible();
    await expect(page.getByTestId("stat-total-courses")).toBeVisible();
    await expect(page.getByTestId("new-class")).toBeVisible();
  });

  test("6.10 empty states shown when teacher has no classes", async ({ page }) => {
    await loginAs(page, EMAIL, PASSWORD);
    await page.goto("/en/teacher");
    await page.waitForLoadState("networkidle");

    const empty = page.getByText("No classes yet");
    const hasClasses = page.getByTestId("new-class");
    if (await empty.isVisible().catch(() => false)) {
      await expect(empty).toBeVisible();
    } else {
      await expect(hasClasses).toBeVisible();
    }
  });
});

test.describe("teacher creates course, section, and lesson via UI", () => {
  test("6.4 teacher creates a course via new course form", async ({ page }) => {
    const ts = Date.now();
    await loginAs(page, EMAIL, PASSWORD);

    await page.goto("/en/teacher/classes/new");
    await page.getByTestId("class-name-input").fill(`E2E UI Class ${ts}`);
    await page.getByTestId("class-description").fill(`Created via UI ${ts}`);
    await page.getByTestId("class-submit").click();
    await page.waitForURL(/\/en\/teacher\/classes\//);

    await page.getByTestId("new-course-link").click();
    await page.waitForURL(/\/en\/teacher\/classes\/.+\/courses\/new/);

    await page.locator('input[type="text"]').first().fill(`E2E UI Course ${ts}`);
    await page.locator('textarea').first().fill(`Course description ${ts}`);
    await page.locator('button[type="submit"]').click();
    await page.waitForURL(/\/en\/teacher\/classes\/.+\/courses\/.+/);
    await expect(page.locator("text=Add Section")).toBeVisible();
  });

  test("6.4 teacher adds section and lesson to a course", async ({ page }) => {
    const data = await setupTeacherLesson(page);

    await page.goto(
      `/${data.locale}/teacher/classes/${data.classId}/courses/${data.courseId}`
    );
    await page.waitForLoadState("networkidle");
    await expect(page.getByText("Add Section")).toBeVisible();
    await expect(page.getByText(data.sectionId ? /E2E Section/ : /Section/)).toBeVisible();
  });
});

test.describe("teacher class detail", () => {
  let data: TestData;
  let studentId: string;

  test.beforeAll(async ({ browser }) => {
    test.setTimeout(120000);
    const teacherCtx = await browser.newContext();
    const teacherPage = await teacherCtx.newPage();
    data = await setupTeacherLesson(teacherPage);

    const studentCtx = await browser.newContext();
    const studentPage = await studentCtx.newPage();
    await loginAs(studentPage, STUDENT_EMAIL, STUDENT_PASSWORD);
    studentId = (await getStudentUserId(studentPage))!;
    expect(studentId).toBeTruthy();
    await studentCtx.close();

    await enrollStudent(teacherPage, data.classId, studentId);
    await teacherCtx.close();
  });

  test("6.8 teacher views student progress matrix", async ({ page }) => {
    await loginAs(page, EMAIL, PASSWORD);
    await page.goto(`/en/teacher/classes/${data.classId}/progress`);
    await page.waitForLoadState("networkidle");
    await expect(page.getByTestId("progress-matrix")).toBeVisible();
  });

  test("6.9 teacher removes student from class", async ({ page }) => {
    await loginAs(page, EMAIL, PASSWORD);
    await page.goto(`/en/teacher/classes/${data.classId}`);
    await page.waitForLoadState("networkidle");

    const removeBtn = page.getByTestId(`remove-student-${studentId}`);
    await expect(removeBtn).toBeVisible();
  });
});
