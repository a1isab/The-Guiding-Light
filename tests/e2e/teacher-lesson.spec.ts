import { test, expect } from "@playwright/test";
import { setupTeacherLesson, type TestData } from "./helpers/teacher-setup";

let data: TestData;

test.beforeAll(async ({ browser }) => {
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  data = await setupTeacherLesson(page);
  await ctx.close();
});

test("lesson editor loads with data-testid elements", async ({ page }) => {
  await page.goto("/en/auth/login");
  await page.getByTestId("login-email").fill("teacher@theguidinglight.com");
  await page.getByTestId("login-password").fill("Teacher123!");
  await page.getByTestId("login-submit").click();
  await page.waitForURL(/\/en\/(teacher|dashboard)/);

  await page.goto(
    `/${data.locale}/teacher/classes/${data.classId}/courses/${data.courseId}/sections/${data.sectionId}/lessons/${data.lessonId}`
  );
  await expect(page.getByTestId("lesson-title")).toBeVisible();
  await expect(page.getByTestId("save-lesson")).toBeVisible();
  await expect(page.getByTestId("preview-toggle")).toBeVisible();
});
