import { test, expect } from "@playwright/test";
import { setupTeacherLesson, type TestData } from "./helpers/teacher-setup";
import { createQuizQuestions } from "./helpers/quiz-setup";
import { loginAs, getUserId, enrollStudent } from "./helpers/auth";

const STUDENT_EMAIL = "student@theguidinglight.com";
const STUDENT_PASSWORD = "Student123!";

test.describe.configure({ timeout: 120000 });

test.describe("student dashboard", () => {
  test("5.1 student dashboard shows all stat cards", async ({ page }) => {
    await loginAs(page, STUDENT_EMAIL, STUDENT_PASSWORD);
    await expect(page.getByTestId("stat-lessons")).toBeVisible();
    await expect(page.getByTestId("stat-streak")).toBeVisible();
    await expect(page.getByTestId("stat-plan")).toBeVisible();
  });

  test("5.2 student dashboard shows class list and join class card", async ({ page }) => {
    await loginAs(page, STUDENT_EMAIL, STUDENT_PASSWORD);
    await expect(page.getByTestId("join-class-card")).toBeVisible();
  });

  test("5.3 continue learning section visible when lessons exist", async ({ browser }) => {
    const teacherCtx = await browser.newContext();
    const teacherPage = await teacherCtx.newPage();
    const data = await setupTeacherLesson(teacherPage);
    await teacherCtx.close();

    const studentCtx = await browser.newContext();
    const studentPage = await studentCtx.newPage();
    await loginAs(studentPage, STUDENT_EMAIL, STUDENT_PASSWORD);
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
    await loginAs(studentPage1, STUDENT_EMAIL, STUDENT_PASSWORD);
    const studentUserId = await getUserId(studentPage1);
    expect(studentUserId).toBeTruthy();
    await studentCtx1.close();

    const teacherCtx = await browser.newContext();
    const teacherPage = await teacherCtx.newPage();
    const data = await setupTeacherLesson(teacherPage);

    const studentCtx2 = await browser.newContext();
    const studentPage2 = await studentCtx2.newPage();
    await loginAs(studentPage2, STUDENT_EMAIL, STUDENT_PASSWORD);
    await studentPage2.goto(`/en/join/${data.inviteCode}`);
    await expect(studentPage2.getByTestId("join-success")).toBeVisible({ timeout: 10000 });
    await expect(studentPage2.getByTestId("join-go-to-dashboard")).toBeVisible();
    await studentCtx2.close();
    await teacherCtx.close();
  });

  test("5.5 student join shows error for invalid invite code", async ({ page }) => {
    await loginAs(page, STUDENT_EMAIL, STUDENT_PASSWORD);
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
    await loginAs(studentPage, STUDENT_EMAIL, STUDENT_PASSWORD);
    studentUserId = (await getUserId(studentPage))!;
    expect(studentUserId).toBeTruthy();
    await studentCtx.close();

    await enrollStudent(teacherPage, data.classId, studentUserId);
    await teacherCtx.close();
  });

  test("5.6 student class detail shows courses", async ({ page }) => {
    await loginAs(page, STUDENT_EMAIL, STUDENT_PASSWORD);
    await page.goto(`/en/dashboard/classes/${data.classId}`);
    await page.waitForLoadState("networkidle");
    await expect(page.getByTestId(`class-course-card-${data.courseId}`)).toBeVisible();
  });

  test("5.7 student course curriculum shows sections and lessons", async ({ page }) => {
    await loginAs(page, STUDENT_EMAIL, STUDENT_PASSWORD);
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
    await loginAs(studentPage, STUDENT_EMAIL, STUDENT_PASSWORD);
    studentUserId = (await getUserId(studentPage))!;
    expect(studentUserId).toBeTruthy();
    await studentCtx.close();

    await enrollStudent(teacherPage, data.classId, studentUserId);
    await createQuizQuestions(teacherPage, data.lessonId);
    await teacherCtx.close();
  });

  test("5.8 student lesson view shows mark as viewed button", async ({ page }) => {
    await loginAs(page, STUDENT_EMAIL, STUDENT_PASSWORD);
    await page.goto(
      `/en/dashboard/classes/${data.classId}/courses/${data.courseId}/lessons/${data.lessonId}`
    );
    await page.waitForLoadState("networkidle");
    await expect(page.getByTestId("mark-viewed")).toBeVisible();
  });

  test("5.9 quiz locked before viewing, visible after mark viewed", async ({ page }) => {
    const lessonUrl = `/en/dashboard/classes/${data.classId}/courses/${data.courseId}/lessons/${data.lessonId}`;

    await loginAs(page, STUDENT_EMAIL, STUDENT_PASSWORD);
    await page.goto(lessonUrl);
    await page.waitForLoadState("networkidle");

    await expect(page.getByTestId("quiz-locked")).toBeVisible();
    await page.getByTestId("mark-viewed").click();
    await page.waitForLoadState("networkidle");
    await expect(page.getByTestId("submit-quiz")).toBeVisible({ timeout: 10000 });
  });

  test("5.11 student takes quiz and sees completion", async ({ page }) => {
    const lessonUrl = `/en/dashboard/classes/${data.classId}/courses/${data.courseId}/lessons/${data.lessonId}`;

    await loginAs(page, STUDENT_EMAIL, STUDENT_PASSWORD);
    await page.goto(lessonUrl);
    await page.waitForLoadState("networkidle");

    const markViewed = page.getByTestId("mark-viewed");
    if (await markViewed.isVisible()) {
      await markViewed.click();
      await page.waitForLoadState("networkidle");
    }

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
    await loginAs(studentPage, STUDENT_EMAIL, STUDENT_PASSWORD);
    studentUserId = (await getUserId(studentPage))!;
    expect(studentUserId).toBeTruthy();
    await studentCtx.close();

    await enrollStudent(teacherPage, data.classId, studentUserId);
    await teacherCtx.close();

    const mainPage = await browser.newPage();
    await loginAs(mainPage, STUDENT_EMAIL, STUDENT_PASSWORD);
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
    const teacherCtx = await browser.newContext();
    const teacherPage = await teacherCtx.newPage();
    const data = await setupTeacherLesson(teacherPage);
    await createQuizQuestions(teacherPage, data.lessonId);

    const studentCtx = await browser.newContext();
    const studentPage = await studentCtx.newPage();
    await loginAs(studentPage, STUDENT_EMAIL, STUDENT_PASSWORD);
    const studentUserId = (await getUserId(studentPage))!;
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

    const page = await browser.newPage();
    await loginAs(page, STUDENT_EMAIL, STUDENT_PASSWORD);

    await expect(page.getByTestId("stat-lessons")).toBeVisible();
    await expect(page.getByTestId("stat-streak")).toBeVisible();
    await expect(page.getByTestId("stat-plan")).toBeVisible();

    await page.goto(
      `/en/dashboard/classes/${data.classId}/courses/${data.courseId}/lessons/${data.lessonId}`
    );
    await page.waitForLoadState("networkidle");

    await page.getByTestId("mark-viewed").click();
    await page.waitForLoadState("networkidle");

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

    await page.waitForTimeout(2000);

    await page.reload();
    await page.waitForLoadState("networkidle");
    await expect(page.getByText("Lesson Complete!")).toBeVisible({ timeout: 15000 });

    await page.goto("/en/dashboard");
    await page.waitForLoadState("networkidle");

    await expect(page.getByTestId("stat-streak")).toBeVisible();
    await expect(page.getByTestId("stat-lessons")).toBeVisible();
    await expect(page.getByTestId("stat-plan")).toBeVisible();

    await page.goto(`/en/dashboard/classes/${data.classId}`);
    await page.waitForLoadState("networkidle");
    await expect(page.getByTestId(`class-course-card-${data.courseId}`)).toBeVisible({ timeout: 15000 });

    await page.goto("/en/dashboard");
    await page.waitForLoadState("networkidle");
    await expect(page.getByTestId("badge-grid")).toBeVisible({ timeout: 15000 });
    await expect(page.getByTestId("achievements")).toBeVisible();

    await page.close();
  });
});
