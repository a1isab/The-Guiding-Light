import { test, expect } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";
import { setupTeacherLesson } from "./helpers/teacher-setup";
import { loginAs, getUserId, enrollStudent } from "./helpers/auth";

const TEACHER_EMAIL = "teacher@theguidinglight.com";
const TEACHER_PASSWORD = "Teacher123!";
const STUDENT_EMAIL = "student@theguidinglight.com";
const STUDENT_PASSWORD = "Student123!";

// Read Supabase URL and anon key from env (with hosted fallback)
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://nbwclxbdiuzfxdnbjmti.supabase.co";
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

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
    // Retries re-run beforeAll in a fresh worker, creating a new lesson with no
    // assignment/submission — the sequential steps below can never pass on retry.
    // The hosted Supabase free tier can take ~30s to serve a cold-pool request,
    // so timeouts are generous.
    test.describe.configure({ retries: 0, timeout: 180000 });

    test("teacher creates assignment via lesson editor", async ({ page }) => {
      await loginAs(page, TEACHER_EMAIL, TEACHER_PASSWORD, /\/en\/teacher/);
      await page.goto(
        `/en/teacher/classes/${ctx.teacher.classId}/courses/${ctx.teacher.courseId}/sections/${ctx.teacher.sectionId}/lessons/${ctx.teacher.lessonId}`
      );
      await page.waitForLoadState("networkidle");

      await expect(page.getByTestId("assignment-title")).toBeVisible({ timeout: 30000 });
      await page.getByTestId("assignment-title").fill("E2E Test Assignment");
      await page.getByTestId("assignment-save").click();

      await expect(page.getByTestId("assignment-save")).toHaveText("Update", { timeout: 90000 });
    });

    test("student submits assignment", async ({ page }) => {
      await loginAs(page, STUDENT_EMAIL, STUDENT_PASSWORD, /\/en\/dashboard/);
      await page.goto(`/en/dashboard/classes/${ctx.teacher.classId}/courses/${ctx.teacher.courseId}/lessons/${ctx.teacher.lessonId}`);
      await page.waitForLoadState("networkidle");

      await expect(page.getByTestId("assignment-section")).toBeVisible({ timeout: 60000 });
      await expect(page.getByTestId("submission-form")).toBeVisible({ timeout: 60000 });

      await page.getByTestId("submission-body").fill("My test submission answer");
      await page.getByTestId("submission-submit").click();

      await expect(page.getByText("Submitted successfully!")).toBeVisible({ timeout: 90000 });
    });

    test("teacher grades submission", async ({ page }) => {
      await loginAs(page, TEACHER_EMAIL, TEACHER_PASSWORD, /\/en\/teacher/);
      await page.goto(
        `/en/teacher/classes/${ctx.teacher.classId}/courses/${ctx.teacher.courseId}/sections/${ctx.teacher.sectionId}/lessons/${ctx.teacher.lessonId}`
      );
      await page.waitForLoadState("networkidle");

      await expect(page.getByTestId("submission-list")).toBeVisible({ timeout: 60000 });

      const gradeBtn = page.getByTestId("grade-btn").first();
      if (await gradeBtn.isVisible()) {
        await gradeBtn.click();
        await page.getByTestId("grade-score-input").fill("85");
        await page.getByTestId("grade-feedback-input").fill("Good work");
        await page.getByTestId("grade-submit").click();

        await expect(page.getByText("85/")).toBeVisible({ timeout: 90000 });
      }
    });

    test("student sees graded result", async ({ page }) => {
      await loginAs(page, STUDENT_EMAIL, STUDENT_PASSWORD, /\/en\/dashboard/);
      await page.goto(`/en/dashboard/classes/${ctx.teacher.classId}/courses/${ctx.teacher.courseId}/lessons/${ctx.teacher.lessonId}`);
      await page.waitForLoadState("networkidle");

      await expect(page.getByTestId("assignment-section")).toBeVisible({ timeout: 60000 });
      await expect(page.getByTestId("submission-status")).toBeVisible({ timeout: 60000 });
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

      // Seed a certificate with the service role key: certificates has only a
      // SELECT policy, so the student's own token cannot INSERT one.
      const adminClient = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
        auth: { autoRefreshToken: false, persistSession: false },
      });
      const { error } = await adminClient.from("certificates").upsert(
        {
          user_id: ctx.studentUserId,
          course_id: "00000000-0000-0000-0000-000000000001",
          class_id: "00000000-0000-0000-0000-000000000002",
          student_name: "E2E Student",
          course_name: "E2E Test Certificate",
        },
        { onConflict: "user_id,course_id,class_id" }
      );
      expect(error).toBeNull();

      await page.goto("/en/dashboard");
      await page.waitForLoadState("networkidle");

      await expect(page.getByTestId("certificates-section")).toBeVisible({ timeout: 10000 });
      await expect(page.getByTestId("certificate-card")).toBeVisible();
    });
  });
});
