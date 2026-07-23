import { test, expect } from "@playwright/test";
import { setupTeacherLesson, type TestData } from "./helpers/teacher-setup";
import { createQuizQuestions } from "./helpers/quiz-setup";

const STUDENT_EMAIL = "student@theguidinglight.com";
const STUDENT_PASSWORD = "Student123!";
const TEACHER_EMAIL = "teacher@theguidinglight.com";
const TEACHER_PASSWORD = "Teacher123!";
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
  const raw = await getCookieValue(teacherPage, "-auth-token");
  const parsed = raw ? decodeSupabaseCookie(raw) : null;
  const token = parsed?.access_token;
  expect(token).toBeTruthy();

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
    { url: SUPABASE_URL, anonKey: SUPABASE_ANON_KEY, token: token!, cid: classId, sid: studentUserId }
  );
  expect(ok).toBe(true);
}

test.describe.configure({ timeout: 120000 });

test.describe("breadcrumbs on student pages", () => {
  let data: TestData;
  let studentUserId: string;

  test.beforeAll(async ({ browser }) => {
    const teacherCtx = await browser.newContext();
    const teacherPage = await teacherCtx.newPage();
    data = await setupTeacherLesson(teacherPage);

    const studentCtx = await browser.newContext();
    const studentPage = await studentCtx.newPage();
    await loginAs(studentPage, STUDENT_EMAIL, STUDENT_PASSWORD);
    studentUserId = (await getStudentUserId(studentPage))!;
    expect(studentUserId).toBeTruthy();
    await studentCtx.close();

    await enrollStudent(teacherPage, data.classId, studentUserId);
    await teacherCtx.close();
  });

  test("9.1 breadcrumbs visible on student class detail page", async ({ page }) => {
    await loginAs(page, STUDENT_EMAIL, STUDENT_PASSWORD);
    await page.goto(`/en/dashboard/classes/${data.classId}`);
    await page.waitForLoadState("networkidle");

    await expect(page.getByTestId("breadcrumbs")).toBeVisible();
    const crumbs = page.getByTestId("breadcrumbs");
    await expect(crumbs).toContainText("My Classes");
  });

  test("9.2 breadcrumbs visible on student course page with 3 levels", async ({ page }) => {
    await loginAs(page, STUDENT_EMAIL, STUDENT_PASSWORD);
    await page.goto(`/en/dashboard/classes/${data.classId}/courses/${data.courseId}`);
    await page.waitForLoadState("networkidle");

    await expect(page.getByTestId("breadcrumbs")).toBeVisible();
    const crumbs = page.getByTestId("breadcrumbs");
    await expect(crumbs).toContainText("My Classes");
    await expect(crumbs).toContainText("Course");
  });

  test("9.3 breadcrumbs visible on student lesson page with 4 levels", async ({ page }) => {
    await loginAs(page, STUDENT_EMAIL, STUDENT_PASSWORD);
    await page.goto(`/en/dashboard/classes/${data.classId}/courses/${data.courseId}/lessons/${data.lessonId}`);
    await page.waitForLoadState("networkidle");

    await expect(page.getByTestId("breadcrumbs")).toBeVisible();
    const crumbs = page.getByTestId("breadcrumbs");
    await expect(crumbs).toContainText("My Classes");
  });

  test("9.4 breadcrumbs on class page link back to dashboard", async ({ page }) => {
    await loginAs(page, STUDENT_EMAIL, STUDENT_PASSWORD);
    await page.goto(`/en/dashboard/classes/${data.classId}`);
    await page.waitForLoadState("networkidle");

    const dashboardLink = page.getByTestId("breadcrumbs").getByRole("link", { name: /My Classes/i });
    await dashboardLink.click();
    await page.waitForURL(/\/en\/dashboard$/);
  });
});

test.describe("sidebar nav on teacher pages", () => {
  test("9.5 sidebar nav visible on teacher dashboard", async ({ page }) => {
    await loginAs(page, TEACHER_EMAIL, TEACHER_PASSWORD);
    await page.goto("/en/teacher");
    await page.waitForLoadState("networkidle");

    await expect(page.getByTestId("sidebar-nav")).toBeVisible();
  });

  test("9.6 teacher dashboard nav item is active on /teacher", async ({ page }) => {
    await loginAs(page, TEACHER_EMAIL, TEACHER_PASSWORD);
    await page.goto("/en/teacher");
    await page.waitForLoadState("networkidle");

    const dashLink = page.getByTestId("nav-teacher-dashboard");
    await expect(dashLink).toBeVisible();
    const classes = await dashLink.getAttribute("class");
    expect(classes).toContain("bg-zinc-800");
  });

  test("9.7 classes nav item is active when on classes page", async ({ page }) => {
    await loginAs(page, TEACHER_EMAIL, TEACHER_PASSWORD);
    await page.goto("/en/teacher/classes");
    await page.waitForLoadState("networkidle");

    const classesLink = page.getByTestId("nav-classes");
    await expect(classesLink).toBeVisible();
    const classes = await classesLink.getAttribute("class");
    expect(classes).toContain("bg-zinc-800");
  });

  test("9.8 clicking classes nav navigates to classes list", async ({ page }) => {
    await loginAs(page, TEACHER_EMAIL, TEACHER_PASSWORD);
    await page.goto("/en/teacher");
    await page.waitForLoadState("networkidle");

    await page.getByTestId("nav-classes").click();
    await page.waitForURL(/\/en\/teacher\/classes/);
  });
});

test.describe("student curriculum collapsible sections", () => {
  let data: TestData;
  let studentUserId: string;

  test.beforeAll(async ({ browser }) => {
    const teacherCtx = await browser.newContext();
    const teacherPage = await teacherCtx.newPage();
    data = await setupTeacherLesson(teacherPage);

    const studentCtx = await browser.newContext();
    const studentPage = await studentCtx.newPage();
    await loginAs(studentPage, STUDENT_EMAIL, STUDENT_PASSWORD);
    studentUserId = (await getStudentUserId(studentPage))!;
    expect(studentUserId).toBeTruthy();
    await studentCtx.close();

    await enrollStudent(teacherPage, data.classId, studentUserId);
    await teacherCtx.close();
  });

  test("9.9 student course page shows collapsible sections", async ({ page }) => {
    await loginAs(page, STUDENT_EMAIL, STUDENT_PASSWORD);
    await page.goto(`/en/dashboard/classes/${data.classId}/courses/${data.courseId}`);
    await page.waitForLoadState("networkidle");

    await expect(page.getByTestId(`student-section-${data.sectionId}`)).toBeVisible();
  });

  test("9.10 lessons visible when section expanded", async ({ page }) => {
    await loginAs(page, STUDENT_EMAIL, STUDENT_PASSWORD);
    await page.goto(`/en/dashboard/classes/${data.classId}/courses/${data.courseId}`);
    await page.waitForLoadState("networkidle");

    await expect(page.getByTestId(`student-lesson-${data.lessonId}`)).toBeVisible();
  });

  test("9.11 section can be collapsed and expanded", async ({ page }) => {
    await loginAs(page, STUDENT_EMAIL, STUDENT_PASSWORD);
    await page.goto(`/en/dashboard/classes/${data.classId}/courses/${data.courseId}`);
    await page.waitForLoadState("networkidle");

    const section = page.getByTestId(`student-section-${data.sectionId}`);
    await expect(section).toBeVisible();

    const toggleButton = section.locator("button").first();
    await toggleButton.click();
    await expect(page.getByTestId(`student-lesson-${data.lessonId}`)).not.toBeVisible();

    await toggleButton.click();
    await expect(page.getByTestId(`student-lesson-${data.lessonId}`)).toBeVisible();
  });
});

test.describe("lesson prev/next navigation", () => {
  let data: TestData;
  let studentUserId: string;

  test.beforeAll(async ({ browser }) => {
    const teacherCtx = await browser.newContext();
    const teacherPage = await teacherCtx.newPage();
    data = await setupTeacherLesson(teacherPage);

    const studentCtx = await browser.newContext();
    const studentPage = await studentCtx.newPage();
    await loginAs(studentPage, STUDENT_EMAIL, STUDENT_PASSWORD);
    studentUserId = (await getStudentUserId(studentPage))!;
    expect(studentUserId).toBeTruthy();
    await studentCtx.close();

    await enrollStudent(teacherPage, data.classId, studentUserId);
    await teacherCtx.close();
  });

  test("9.12 first lesson shows Back to Course as prev nav", async ({ page }) => {
    await loginAs(page, STUDENT_EMAIL, STUDENT_PASSWORD);
    await page.goto(`/en/dashboard/classes/${data.classId}/courses/${data.courseId}/lessons/${data.lessonId}`);
    await page.waitForLoadState("networkidle");

    const prevLink = page.getByTestId("nav-prev-lesson");
    await expect(prevLink).toBeVisible();
    await expect(prevLink).toContainText("Course");
  });

  test("9.13 single lesson course has no next nav", async ({ page }) => {
    await loginAs(page, STUDENT_EMAIL, STUDENT_PASSWORD);
    await page.goto(`/en/dashboard/classes/${data.classId}/courses/${data.courseId}/lessons/${data.lessonId}`);
    await page.waitForLoadState("networkidle");

    const nextLink = page.getByTestId("nav-next-lesson");
    await expect(nextLink).not.toBeVisible();
  });

  test("9.14 clicking prev (Back to Course) navigates to course page", async ({ page }) => {
    await loginAs(page, STUDENT_EMAIL, STUDENT_PASSWORD);
    await page.goto(`/en/dashboard/classes/${data.classId}/courses/${data.courseId}/lessons/${data.lessonId}`);
    await page.waitForLoadState("networkidle");

    const prevLink = page.getByTestId("nav-prev-lesson");
    await prevLink.click();
    await page.waitForURL(new RegExp(`/en/dashboard/classes/${data.classId}/courses/${data.courseId}$`));
  });
});
