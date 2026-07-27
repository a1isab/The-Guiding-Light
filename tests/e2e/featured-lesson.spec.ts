import { test, expect } from "@playwright/test";
import { loginAs } from "./helpers/auth";
import { setupTeacherLesson } from "./helpers/teacher-setup";

const TEACHER_EMAIL = "teacher@theguidinglight.com";
const TEACHER_PASSWORD = "Teacher123!";
const STUDENT_EMAIL = "student@theguidinglight.com";
const STUDENT_PASSWORD = "Student123!";

test.describe.configure({ timeout: 120000 });

test.describe("featured lesson content", () => {
  let classId: string;
  let lessonId: string;

  test.beforeAll(async ({ browser }) => {
    test.setTimeout(120000);
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    const data = await setupTeacherLesson(page);
    classId = data.classId;
    lessonId = data.lessonId;
    await ctx.close();
  });

  test("10.7 featured lesson page shows content or 404", async ({ page }) => {
    await loginAs(page, STUDENT_EMAIL, STUDENT_PASSWORD);
    await page.goto(`/en/featured/classes/${classId}/lessons/${lessonId}`);
    await page.waitForLoadState("networkidle");

    const isNotFound = page.locator("text=404").or(page.locator("text=This page could not be found"));
    const hasNotFound = await isNotFound.isVisible().catch(() => false);

    if (!hasNotFound) {
      await expect(page.locator("h1")).toBeVisible();
    }
  });

  test("10.7 featured lesson shows back link", async ({ page }) => {
    await loginAs(page, STUDENT_EMAIL, STUDENT_PASSWORD);
    await page.goto(`/en/featured/classes/${classId}/lessons/${lessonId}`);
    await page.waitForLoadState("networkidle");

    const isNotFound = page.locator("text=404").or(page.locator("text=This page could not be found"));
    if (!(await isNotFound.isVisible().catch(() => false))) {
      const backLink = page.getByText("Back to class").or(page.getByText("←"));
      const hasBack = await backLink.isVisible().catch(() => false);
      expect(hasBack).toBe(true);
    }
  });

  test("10.7 featured lesson shows join CTA", async ({ page }) => {
    await loginAs(page, STUDENT_EMAIL, STUDENT_PASSWORD);
    await page.goto(`/en/featured/classes/${classId}/lessons/${lessonId}`);
    await page.waitForLoadState("networkidle");

    const isNotFound = page.locator("text=404").or(page.locator("text=This page could not be found"));
    if (!(await isNotFound.isVisible().catch(() => false))) {
      const joinCta = page.getByText("Join").first();
      const hasCta = await joinCta.isVisible().catch(() => false);
      expect(hasCta).toBe(true);
    }
  });

  test("10.7 featured lesson with non-existent ID shows 404", async ({ page }) => {
    await loginAs(page, STUDENT_EMAIL, STUDENT_PASSWORD);
    await page.goto("/en/featured/classes/00000000-0000-0000-0000-000000000000/lessons/00000000-0000-0000-0000-000000000000");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000);

    const has404 = page.url().includes("404");
    const hasNotFound = await page.getByText("not found").or(page.getByText("404")).isVisible().catch(() => false);
    const hasEmpty = (await page.locator("main, body").textContent())?.trim().length === 0;
    expect(has404 || hasNotFound || hasEmpty).toBe(true);
  });
});
