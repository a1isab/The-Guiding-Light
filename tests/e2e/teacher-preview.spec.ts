import { test, expect } from "@playwright/test";
import { setupTeacherLesson, type TestData } from "./helpers/teacher-setup";

let data: TestData;

test.beforeEach(async ({ page }) => {
  data = await setupTeacherLesson(page);
});

test("preview mode toggle shows banner and back button", async ({ page }) => {
  await page.goto(
    `/${data.locale}/teacher/classes/${data.classId}/courses/${data.courseId}/sections/${data.sectionId}/lessons/${data.lessonId}`
  );
  await page.getByTestId("preview-toggle").click();
  await expect(page.getByTestId("preview-banner")).toBeVisible();
  await page.getByTestId("back-to-edit").click();
  await expect(page.getByTestId("preview-banner")).not.toBeVisible();
});
