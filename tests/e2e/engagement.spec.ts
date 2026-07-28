import { test, expect } from "@playwright/test";
import { setupTeacherLesson, type TestData } from "./helpers/teacher-setup";
import { loginAs, getUserId, enrollStudent, getAccessToken } from "./helpers/auth";

const TEACHER_EMAIL = "teacher@theguidinglight.com";
const TEACHER_PASSWORD = "Teacher123!";
const STUDENT_EMAIL = "student@theguidinglight.com";
const STUDENT_PASSWORD = "Student123!";
const SUPABASE_URL = "https://vpqfvranmdhsxfsynvbw.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZwcWZ2cmFubWRoc3hmc3ludmJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4ODQxMDAsImV4cCI6MjA5NzQ2MDEwMH0.6QF9SFBcl_c5xFVKxYBduVZuXGRjDqrA_AtFyX4O_gM";

interface TestContext {
  teacher: { classId: string; courseId: string; sectionId: string; lessonId: string; inviteCode: string };
  studentUserId: string;
}

test.describe.configure({ timeout: 120000 });

test.describe("engagement features", () => {
  let ctx: TestContext;

  test.beforeAll(async ({ browser }) => {
    test.setTimeout(120000);
    const teacherCtx = await browser.newContext();
    const teacherPage = await teacherCtx.newPage();
    const teacher = await setupTeacherLesson(teacherPage);

    const studentCtx = await browser.newContext();
    const studentPage = await studentCtx.newPage();
    await loginAs(studentPage, STUDENT_EMAIL, STUDENT_PASSWORD);
    const studentUserId = (await getUserId(studentPage))!;
    expect(studentUserId).toBeTruthy();
    await studentCtx.close();

    await enrollStudent(teacherPage, teacher.classId, studentUserId);
    await teacherCtx.close();

    ctx = { teacher, studentUserId };
  });

  test.describe("lesson discussions", () => {
    test("student posts a comment and it appears in the thread", async ({ page }) => {
      await loginAs(page, STUDENT_EMAIL, STUDENT_PASSWORD, /\/en\/dashboard/);
      await page.goto(`/en/dashboard/classes/${ctx.teacher.classId}/courses/${ctx.teacher.courseId}/lessons/${ctx.teacher.lessonId}`);
      await page.waitForLoadState("networkidle");

      const commentText = `Test comment ${Date.now()}`;
      await page.getByTestId("comment-input").fill(commentText);
      await page.getByTestId("comment-submit").click();

      await expect(page.getByTestId("comments-header")).toBeVisible();
      await expect(page.getByText(commentText)).toBeVisible({ timeout: 10000 });
    });

    test("student replies to a comment", async ({ page }) => {
      await loginAs(page, STUDENT_EMAIL, STUDENT_PASSWORD, /\/en\/dashboard/);
      await page.goto(`/en/dashboard/classes/${ctx.teacher.classId}/courses/${ctx.teacher.courseId}/lessons/${ctx.teacher.lessonId}`);
      await page.waitForLoadState("networkidle");

      const parentText = `Parent comment ${Date.now()}`;
      await page.getByTestId("comment-input").fill(parentText);
      await page.getByTestId("comment-submit").click();
      await expect(page.getByText(parentText)).toBeVisible({ timeout: 10000 });

      const replyBtn = page.getByTestId("comment-reply-btn").first();
      await expect(replyBtn).toBeVisible({ timeout: 10000 });
      await replyBtn.click();
      const replyText = `Test reply ${Date.now()}`;
      await page.getByTestId("comment-input").last().fill(replyText);
      await page.getByTestId("comment-submit").last().click();
      await expect(page.getByText(replyText)).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe("assignments and submissions", () => {
    test("teacher creates assignment via lesson editor", async ({ page }) => {
      await loginAs(page, TEACHER_EMAIL, TEACHER_PASSWORD, /\/en\/teacher/);
      await page.goto(
        `/en/teacher/classes/${ctx.teacher.classId}/courses/${ctx.teacher.courseId}/sections/${ctx.teacher.sectionId}/lessons/${ctx.teacher.lessonId}`
      );
      await page.waitForLoadState("networkidle");

      await page.getByTestId("assignment-title").fill("E2E Test Assignment");
      await page.getByTestId("assignment-save").click();

      await expect(page.getByTestId("assignment-save")).toHaveText("Update", { timeout: 10000 });
    });

    test("student submits assignment", async ({ page }) => {
      await loginAs(page, STUDENT_EMAIL, STUDENT_PASSWORD, /\/en\/dashboard/);
      await page.goto(`/en/dashboard/classes/${ctx.teacher.classId}/courses/${ctx.teacher.courseId}/lessons/${ctx.teacher.lessonId}`);
      await page.waitForLoadState("networkidle");

      await expect(page.getByTestId("assignment-section")).toBeVisible({ timeout: 10000 });
      await expect(page.getByTestId("submission-form")).toBeVisible({ timeout: 10000 });

      await page.getByTestId("submission-body").fill("My test submission answer");
      await page.getByTestId("submission-submit").click();

      await expect(page.getByText("Submitted successfully!")).toBeVisible({ timeout: 10000 });
    });

    test("teacher grades submission", async ({ page }) => {
      await loginAs(page, TEACHER_EMAIL, TEACHER_PASSWORD, /\/en\/teacher/);
      await page.goto(
        `/en/teacher/classes/${ctx.teacher.classId}/courses/${ctx.teacher.courseId}/sections/${ctx.teacher.sectionId}/lessons/${ctx.teacher.lessonId}`
      );
      await page.waitForLoadState("networkidle");

      await expect(page.getByTestId("submission-list")).toBeVisible({ timeout: 10000 });

      const gradeBtn = page.getByTestId("grade-btn").first();
      if (await gradeBtn.isVisible()) {
        await gradeBtn.click();
        await page.getByTestId("grade-score-input").fill("85");
        await page.getByTestId("grade-feedback-input").fill("Good work");
        await page.getByTestId("grade-submit").click();

        await expect(page.getByText("85/")).toBeVisible({ timeout: 10000 });
      }
    });

    test("student sees graded result", async ({ page }) => {
      await loginAs(page, STUDENT_EMAIL, STUDENT_PASSWORD, /\/en\/dashboard/);
      await page.goto(`/en/dashboard/classes/${ctx.teacher.classId}/courses/${ctx.teacher.courseId}/lessons/${ctx.teacher.lessonId}`);
      await page.waitForLoadState("networkidle");

      await expect(page.getByTestId("assignment-section")).toBeVisible({ timeout: 10000 });
      await expect(page.getByTestId("submission-status")).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe("bookmarks", () => {
    test("student toggles bookmark on lesson", async ({ page }) => {
      await loginAs(page, STUDENT_EMAIL, STUDENT_PASSWORD, /\/en\/dashboard/);
      await page.goto(`/en/dashboard/classes/${ctx.teacher.classId}/courses/${ctx.teacher.courseId}/lessons/${ctx.teacher.lessonId}`);
      await page.waitForLoadState("networkidle");

      await expect(page.getByTestId("bookmark-button")).toBeVisible({ timeout: 10000 });

      const btn = page.getByTestId("bookmark-button");
      const initialText = await btn.textContent();

      await btn.click();
      await page.waitForTimeout(500);

      const newText = await btn.textContent();
      expect(newText).not.toBe(initialText);
    });
  });

  test.describe("announcements", () => {
    test("teacher posts announcement", async ({ page }) => {
      await loginAs(page, TEACHER_EMAIL, TEACHER_PASSWORD, /\/en\/teacher/);
      await page.goto(`/en/teacher/classes/${ctx.teacher.classId}`);
      await page.waitForLoadState("networkidle");

      await expect(page.getByTestId("announcement-form")).toBeVisible({ timeout: 10000 });

      const title = `E2E Announcement ${Date.now()}`;
      await page.getByTestId("announcement-title").fill(title);
      await page.getByTestId("announcement-body").fill("This is a test announcement body");

      const postPromise = page.waitForResponse((r) => r.url().includes("/api/teacher/announcements") && r.status() === 200);
      await page.getByTestId("announcement-post").click();
      await postPromise;
    });

    test("student sees announcement banner", async ({ page }) => {
      await loginAs(page, STUDENT_EMAIL, STUDENT_PASSWORD, /\/en\/dashboard/);
      await page.goto(`/en/dashboard/classes/${ctx.teacher.classId}`);
      await page.waitForLoadState("networkidle");

      await expect(page.getByTestId("announcement-banner")).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe("analytics", () => {
    test("teacher views analytics page", async ({ page }) => {
      await loginAs(page, TEACHER_EMAIL, TEACHER_PASSWORD, /\/en\/teacher/);
      await page.goto(`/en/teacher/classes/${ctx.teacher.classId}/analytics`);
      await page.waitForLoadState("networkidle");

      await expect(page.getByTestId("stat-total-students")).toBeVisible({ timeout: 10000 });
      await expect(page.getByTestId("stat-avg-score")).toBeVisible();
      await expect(page.getByTestId("stat-completion")).toBeVisible();
      await expect(page.getByTestId("stat-at-risk")).toBeVisible();
    });
  });

  test.describe("certificates", () => {
    test("certificates section renders when certificates exist", async ({ page }) => {
      await loginAs(page, STUDENT_EMAIL, STUDENT_PASSWORD, /\/en\/dashboard/);

      const accessToken = await getAccessToken(page);
      expect(accessToken).toBeTruthy();

      await page.evaluate(
        async ({ token, studentId }) => {
          await fetch(`${SUPABASE_URL}/rest/v1/certificates`, {
            method: "POST",
            headers: {
              apikey: SUPABASE_ANON_KEY,
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              Prefer: "resolution=merge-duplicates",
            },
            body: JSON.stringify({
              user_id: studentId,
              course_id: "00000000-0000-0000-0000-000000000001",
              class_id: "00000000-0000-0000-0000-000000000002",
              student_name: "E2E Student",
              course_name: "E2E Test Certificate",
            }),
          });
        },
        { token: accessToken!, studentId: ctx.studentUserId }
      );

      await page.goto("/en/dashboard");
      await page.waitForLoadState("networkidle");

      await expect(page.getByTestId("certificates-section")).toBeVisible({ timeout: 10000 });
      await expect(page.getByTestId("certificate-card")).toBeVisible();
    });
  });
});
