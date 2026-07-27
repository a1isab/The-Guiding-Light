import { test, expect } from "@playwright/test";
import { setupTeacherLesson, type TestData } from "./helpers/teacher-setup";
import { loginAs } from "./helpers/auth";

const TEACHER_EMAIL = "teacher@theguidinglight.com";
const TEACHER_PASSWORD = "Teacher123!";

test.describe.configure({ timeout: 120000 });

async function gotoNoTour(page: import("@playwright/test").Page, url: string) {
  await page.goto("/en/auth/login");
  await page.evaluate(() => localStorage.setItem("tour_completed", "true"));
  await page.goto(url);
  await page.waitForLoadState("networkidle");
}

test.describe("teacher quiz UI", () => {
  let data: TestData;

  test.beforeAll(async ({ browser }) => {
    test.setTimeout(120000);
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    data = await setupTeacherLesson(page);
    await ctx.close();
  });

  test("lesson editor page loads with title and save button", async ({ page }) => {
    await loginAs(page, TEACHER_EMAIL, TEACHER_PASSWORD);
    await gotoNoTour(page, `/en/teacher/classes/${data.classId}/courses/${data.courseId}/sections/${data.sectionId}/lessons/${data.lessonId}`);

    await expect(page.getByTestId("lesson-title")).toBeVisible();
    await expect(page.getByTestId("save-lesson")).toBeVisible();
  });

  test("preview toggle switches to preview mode", async ({ page }) => {
    await loginAs(page, TEACHER_EMAIL, TEACHER_PASSWORD);
    await gotoNoTour(page, `/en/teacher/classes/${data.classId}/courses/${data.courseId}/sections/${data.sectionId}/lessons/${data.lessonId}`);

    await page.getByTestId("preview-toggle").click();
    await expect(page.getByTestId("preview-banner")).toBeVisible();
    await expect(page.getByTestId("back-to-edit")).toBeVisible();
  });

  test("back to edit returns to edit mode", async ({ page }) => {
    await loginAs(page, TEACHER_EMAIL, TEACHER_PASSWORD);
    await gotoNoTour(page, `/en/teacher/classes/${data.classId}/courses/${data.courseId}/sections/${data.sectionId}/lessons/${data.lessonId}`);

    await page.getByTestId("preview-toggle").click();
    await expect(page.getByTestId("preview-banner")).toBeVisible();
    await page.getByTestId("back-to-edit").click();
    await expect(page.getByTestId("save-lesson")).toBeVisible();
  });

  test("save template button opens dialog", async ({ page }) => {
    await loginAs(page, TEACHER_EMAIL, TEACHER_PASSWORD);
    await gotoNoTour(page, `/en/teacher/classes/${data.classId}/courses/${data.courseId}/sections/${data.sectionId}/lessons/${data.lessonId}`);

    await page.getByTestId("save-template").click();
    await expect(page.getByTestId("template-dialog")).toBeVisible();
    await expect(page.getByTestId("template-name")).toBeVisible();
    await expect(page.getByTestId("template-desc")).toBeVisible();
    await expect(page.getByTestId("template-save")).toBeVisible();
  });

  test("copy from content button is visible", async ({ page }) => {
    await loginAs(page, TEACHER_EMAIL, TEACHER_PASSWORD);
    await gotoNoTour(page, `/en/teacher/classes/${data.classId}/courses/${data.courseId}/sections/${data.sectionId}/lessons/${data.lessonId}`);

    await expect(page.getByTestId("copy-from-content")).toBeVisible();
  });
});
