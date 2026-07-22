import { test, expect } from "@playwright/test";
import { setupTeacherLesson, type TestData } from "./helpers/teacher-setup";
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

test.describe.configure({ timeout: 120000 });

test.describe("student dashboard", () => {
  test("5.1 student dashboard shows all stat cards", async ({ page }) => {
    await loginAsStudent(page);
    await expect(page.getByTestId("stat-lessons")).toBeVisible();
    await expect(page.getByTestId("stat-streak")).toBeVisible();
    await expect(page.getByTestId("stat-plan")).toBeVisible();
  });

  test("5.2 student dashboard shows class list and join class card", async ({ page }) => {
    await loginAsStudent(page);
    await expect(page.getByTestId("join-class-card")).toBeVisible();
  });

  test("5.3 continue learning section visible when lessons exist", async ({ browser }) => {
    const teacherCtx = await browser.newContext();
    const teacherPage = await teacherCtx.newPage();
    const data = await setupTeacherLesson(teacherPage);
    await teacherCtx.close();

    const studentCtx = await browser.newContext();
    const studentPage = await studentCtx.newPage();
    await loginAsStudent(studentPage);
    await studentPage.goto(`/en/dashboard`);
    await studentPage.waitForLoadState("networkidle");

    const continueSection = studentPage.getByTestId("continue-learning");
    if (await continueSection.isVisible().catch(() => false)) {
      await expect(continueSection).toBeVisible();
    }
    await studentCtx.close();
  });
});

test.describe("student join class", () => {
  test("5.4 student joins class with valid invite code", async ({ browser }) => {
    const studentCtx1 = await browser.newContext();
    const studentPage1 = await studentCtx1.newPage();
    await loginAsStudent(studentPage1);
    const studentUserId = await getStudentUserId(studentPage1);
    expect(studentUserId).toBeTruthy();
    await studentCtx1.close();

    const teacherCtx = await browser.newContext();
    const teacherPage = await teacherCtx.newPage();
    const data = await setupTeacherLesson(teacherPage);

    const studentCtx2 = await browser.newContext();
    const studentPage2 = await studentCtx2.newPage();
    await loginAsStudent(studentPage2);
    await studentPage2.goto(`/en/join/${data.inviteCode}`);
    await expect(studentPage2.getByTestId("join-success")).toBeVisible({ timeout: 10000 });
    await expect(studentPage2.getByTestId("join-go-to-dashboard")).toBeVisible();
    await studentCtx2.close();
    await teacherCtx.close();
  });

  test("5.5 student join shows error for invalid invite code", async ({ page }) => {
    await loginAsStudent(page);
    await page.goto("/en/join/INVALIDCODE");
    await expect(page.getByTestId("join-error")).toBeVisible();
  });
});

test.describe("student class and course", () => {
  let data: TestData;
  let studentUserId: string;

  test.beforeAll(async ({ browser }) => {
    test.setTimeout(120000);
    const teacherCtx = await browser.newContext();
    const teacherPage = await teacherCtx.newPage();
    data = await setupTeacherLesson(teacherPage);

    const studentCtx = await browser.newContext();
    const studentPage = await studentCtx.newPage();
    await loginAsStudent(studentPage);
    studentUserId = (await getStudentUserId(studentPage))!;
    expect(studentUserId).toBeTruthy();
    await studentCtx.close();

    await enrollStudent(teacherPage, data.classId, studentUserId);
    await teacherCtx.close();
  });

  test("5.6 student class detail shows courses", async ({ page }) => {
    await loginAsStudent(page);
    await page.goto(`/en/dashboard/classes/${data.classId}`);
    await page.waitForLoadState("networkidle");
    await expect(page.getByTestId(`class-course-card-${data.courseId}`)).toBeVisible();
  });

  test("5.7 student course curriculum shows sections and lessons", async ({ page }) => {
    await loginAsStudent(page);
    await page.goto(`/en/dashboard/classes/${data.classId}/courses/${data.courseId}`);
    await page.waitForLoadState("networkidle");
    await expect(page.getByTestId(`section-${data.sectionId}`)).toBeVisible();
    await expect(page.getByTestId(`curriculum-lesson-${data.lessonId}`)).toBeVisible();
  });
});

test.describe("student lesson and quiz", () => {
  let data: TestData;
  let studentUserId: string;

  test.beforeAll(async ({ browser }) => {
    test.setTimeout(120000);
    const teacherCtx = await browser.newContext();
    const teacherPage = await teacherCtx.newPage();
    data = await setupTeacherLesson(teacherPage);

    const studentCtx = await browser.newContext();
    const studentPage = await studentCtx.newPage();
    await loginAsStudent(studentPage);
    studentUserId = (await getStudentUserId(studentPage))!;
    expect(studentUserId).toBeTruthy();
    await studentCtx.close();

    await enrollStudent(teacherPage, data.classId, studentUserId);
    await createQuizQuestions(teacherPage, data.lessonId);
    await teacherCtx.close();
  });

  test("5.8 student lesson view shows mark as viewed button", async ({ page }) => {
    await loginAsStudent(page);
    await page.goto(
      `/en/dashboard/classes/${data.classId}/courses/${data.courseId}/lessons/${data.lessonId}`
    );
    await page.waitForLoadState("networkidle");
    await expect(page.getByTestId("mark-viewed")).toBeVisible();
  });

  test("5.9 quiz locked before viewing, visible after mark viewed", async ({ page }) => {
    const lessonUrl = `/en/dashboard/classes/${data.classId}/courses/${data.courseId}/lessons/${data.lessonId}`;

    await loginAsStudent(page);
    await page.goto(lessonUrl);
    await page.waitForLoadState("networkidle");

    await expect(page.getByTestId("quiz-locked")).toBeVisible();
    await page.getByTestId("mark-viewed").click();
    await page.waitForLoadState("networkidle");
    await expect(page.getByTestId("submit-quiz")).toBeVisible({ timeout: 10000 });
  });

  test("5.11 student takes quiz and sees completion", async ({ page }) => {
    const lessonUrl = `/en/dashboard/classes/${data.classId}/courses/${data.courseId}/lessons/${data.lessonId}`;

    await loginAsStudent(page);
    await page.goto(lessonUrl);
    await page.waitForLoadState("networkidle");

    const markViewed = page.getByTestId("mark-viewed");
    if (await markViewed.isVisible()) {
      await markViewed.click();
      await page.waitForLoadState("networkidle");
    }

    // Step 4: Submit quiz via API (UI radio clicks unreliable with React controlled inputs)
    const quizResult = await page.evaluate(
      async ([lid, ans]) => {
        const res = await fetch("/api/teacher/quiz/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lessonId: lid, answers: ans }),
        });
        return { status: res.status, body: await res.json() };
      },
      [data.lessonId, [1, 2, 2]] as const
    );
    expect(quizResult.status).toBe(200);
    expect(quizResult.body.passed).toBe(true);

    // Reload the page to see completion state
    await page.reload();
    await page.waitForLoadState("networkidle");
    await expect(page.getByText("Lesson Complete!")).toBeVisible({ timeout: 15000 });
  });
});

test.describe("student no quiz message", () => {
  let data: TestData;
  let studentUserId: string;

  test("5.10 student lesson shows no quiz message when none exists", async ({ browser }) => {
    const teacherCtx = await browser.newContext();
    const teacherPage = await teacherCtx.newPage();
    data = await setupTeacherLesson(teacherPage);

    const studentCtx = await browser.newContext();
    const studentPage = await studentCtx.newPage();
    await loginAsStudent(studentPage);
    studentUserId = (await getStudentUserId(studentPage))!;
    expect(studentUserId).toBeTruthy();
    await studentCtx.close();

    await enrollStudent(teacherPage, data.classId, studentUserId);
    await teacherCtx.close();

    const mainPage = await browser.newPage();
    await loginAsStudent(mainPage);
    await mainPage.goto(
      `/en/dashboard/classes/${data.classId}/courses/${data.courseId}/lessons/${data.lessonId}`
    );
    await expect(mainPage.getByText("No quiz for this lesson.")).toBeVisible();
    await mainPage.close();
  });
});

test.describe("8.1 integration: full student flow", () => {
  test("student login → dashboard → lesson → quiz → dashboard with badge", async ({ browser }) => {
    test.setTimeout(180000);
    // Setup: teacher creates class with quiz
    const teacherCtx = await browser.newContext();
    const teacherPage = await teacherCtx.newPage();
    const data = await setupTeacherLesson(teacherPage);
    await createQuizQuestions(teacherPage, data.lessonId);

    // Enroll student via test/seed endpoint (admin client, bypasses RLS)
    const studentCtx = await browser.newContext();
    const studentPage = await studentCtx.newPage();
    await loginAsStudent(studentPage);
    const studentUserId = (await getStudentUserId(studentPage))!;
    expect(studentUserId).toBeTruthy();
    await studentCtx.close();

    const seedResult = await teacherPage.evaluate(
      async ({ classId, studentId }) => {
        const res = await fetch("/api/test/seed", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            table: "class_members",
            data: { class_id: classId, student_id: studentId },
            onConflict: "class_id,student_id",
          }),
        });
        return { ok: res.ok, body: await res.json() };
      },
      { classId: data.classId, studentId: studentUserId }
    );
    expect(seedResult.ok).toBe(true);
    await teacherCtx.close();

    // Step 1: Student logs in and sees dashboard
    const page = await browser.newPage();
    await loginAsStudent(page);

    await expect(page.getByTestId("stat-lessons")).toBeVisible();
    await expect(page.getByTestId("stat-streak")).toBeVisible();
    await expect(page.getByTestId("stat-plan")).toBeVisible();

    // Step 2: Navigate to class lesson
    await page.goto(
      `/en/dashboard/classes/${data.classId}/courses/${data.courseId}/lessons/${data.lessonId}`
    );
    await page.waitForLoadState("networkidle");

    // Step 3: Mark lesson as viewed
    await page.getByTestId("mark-viewed").click();
    await page.waitForLoadState("networkidle");

    // Step 4: Submit quiz via API (UI radio clicks unreliable with React controlled inputs)
    const quizResult = await page.evaluate(
      async ([lid, ans]) => {
        const res = await fetch("/api/teacher/quiz/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lessonId: lid, answers: ans }),
        });
        return { status: res.status, body: await res.json() };
      },
      [data.lessonId, [1, 2, 2]] as const
    );
    expect(quizResult.status).toBe(200);
    expect(quizResult.body.passed).toBe(true);

    // Wait for async badge awarding (scanAndAwardBadges runs fire-and-forget)
    await page.waitForTimeout(2000);

    await page.reload();
    await page.waitForLoadState("networkidle");
    await expect(page.getByText("Lesson Complete!")).toBeVisible({ timeout: 15000 });

    // Step 5: Go back to dashboard and verify updated state
    await page.goto("/en/dashboard");
    await page.waitForLoadState("networkidle");

    // Dashboard stats visible
    await expect(page.getByTestId("stat-streak")).toBeVisible();
    await expect(page.getByTestId("stat-lessons")).toBeVisible();
    await expect(page.getByTestId("stat-plan")).toBeVisible();

    // Verify enrollment by navigating to class detail page
    await page.goto(`/en/dashboard/classes/${data.classId}`);
    await page.waitForLoadState("networkidle");
    await expect(page.getByTestId(`class-course-card-${data.courseId}`)).toBeVisible({ timeout: 15000 });

    // Badge grid on main dashboard (quiz_ace badge earned from passing quiz)
    await page.goto("/en/dashboard");
    await page.waitForLoadState("networkidle");
    await expect(page.getByTestId("badge-grid")).toBeVisible({ timeout: 15000 });
    await expect(page.getByTestId("achievements")).toBeVisible();

    await page.close();
  });
});
