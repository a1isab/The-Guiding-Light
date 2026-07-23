import { test, expect, type Page } from "@playwright/test";
import { loginAs } from "./helpers/auth";

const STUDENT_EMAIL = "student@theguidinglight.com";
const STUDENT_PASSWORD = "Student123!";
const TEACHER_EMAIL = "teacher@theguidinglight.com";
const TEACHER_PASSWORD = "Teacher123!";

const PUBLIC_COURSE_SLUG = "new-muslim-guide";
const PUBLIC_SECTION_SLUG = "the-basics";
const PUBLIC_LESSON_SLUG = "what-is-islam";

test.describe.configure({ timeout: 120000 });
test.describe("engagement features", () => {
  let lessonId: string | null = null;

  test("dashboard shows engagement elements", async ({ page }) => {
    await loginAs(page, STUDENT_EMAIL, STUDENT_PASSWORD);

    await expect(page.getByText("Lessons Completed", { exact: true })).toBeVisible();
    await expect(page.getByText("Current Streak", { exact: true })).toBeVisible();
    await expect(page.getByText("Your Plan", { exact: true })).toBeVisible();
    await expect(page.getByText(/lessons this week/i)).toBeVisible();
    await expect(page.getByText("Overall Progress")).toBeVisible();
  });

  test("course page shows social proof counter", async ({ page }) => {
    await loginAs(page, STUDENT_EMAIL, STUDENT_PASSWORD);
    await page.goto(`/en/courses/${PUBLIC_COURSE_SLUG}`);
    await expect(page.getByText(/enrolled/i)).toBeVisible();
  });

  test("lesson page shows social proof counter", async ({ page }) => {
    await loginAs(page, STUDENT_EMAIL, STUDENT_PASSWORD);
    await page.goto(
      `/en/courses/${PUBLIC_COURSE_SLUG}/${PUBLIC_SECTION_SLUG}/${PUBLIC_LESSON_SLUG}`
    );
    await expect(page.getByText(/students completed/i)).toBeVisible();
  });

  test("full lesson completion flow", async ({ browser }) => {
    const teacherCtx = await browser.newContext();
    const teacherPage = await teacherCtx.newPage();

    await loginAs(teacherPage, TEACHER_EMAIL, TEACHER_PASSWORD);

    lessonId = await teacherPage.evaluate(
      async ({ s }) => {
        const res = await fetch(`/api/admin/quizzes`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lessonSlug: s }),
        });
        if (!res.ok) {
          const body = await res.text();
          throw new Error(`Failed to create quiz (${res.status}): ${body}`);
        }
        const data = await res.json();
        return data.lessonId as string;
      },
      { s: PUBLIC_LESSON_SLUG }
    );
    expect(lessonId).toBeTruthy();
    await teacherCtx.close();

    const studentCtx = await browser.newContext();
    const studentPage = await studentCtx.newPage();
    await loginAs(studentPage, STUDENT_EMAIL, STUDENT_PASSWORD);

    await studentPage.goto(
      `/en/courses/${PUBLIC_COURSE_SLUG}/${PUBLIC_SECTION_SLUG}/${PUBLIC_LESSON_SLUG}`
    );
    await studentPage.waitForLoadState("networkidle");

    await studentPage.getByText(/Take Quiz/i).click();
    await studentPage.waitForTimeout(1500);

    const correctOptions = ["B.", "B.", "C."];
    for (let i = 0; i < 3; i++) {
      await studentPage.waitForTimeout(500);
      const optionBtn = studentPage.locator(`button:has-text("${correctOptions[i]}")`);
      await optionBtn.first().click();
      await studentPage.waitForTimeout(500);
      const nextBtn = studentPage.getByText(/Next Question|See Results/);
      if (await nextBtn.isVisible().catch(() => false)) {
        await nextBtn.click();
      }
    }

    await studentPage.waitForTimeout(3000);

    await expect(studentPage.getByText("Lesson Complete!")).toBeVisible({ timeout: 10000 });

    const canvas = studentPage.locator("canvas");
    await expect(canvas).toBeVisible({ timeout: 5000 });

    await expect(studentPage.getByText("Continue to Next Lesson")).toBeVisible({ timeout: 5000 });

    await studentCtx.close();

    const cleanupCtx = await browser.newContext();
    const cleanupPage = await cleanupCtx.newPage();
    if (lessonId) {
      await loginAs(cleanupPage, TEACHER_EMAIL, TEACHER_PASSWORD);
      await cleanupPage.evaluate(
        async ([lid]) => {
          await fetch("/api/admin/quizzes", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ lessonId: lid }),
          });
        },
        [lessonId]
      );
    }
    await cleanupCtx.close();
  });
});
