import { test, expect } from "@playwright/test";
import { setupTeacherLesson, type TestData } from "./helpers/teacher-setup";

let data: TestData;

test.beforeEach(async ({ page }) => {
  data = await setupTeacherLesson(page);
});

test("save as template dialog opens and can be submitted", async ({ page }) => {
  await page.goto(
    `/${data.locale}/teacher/classes/${data.classId}/courses/${data.courseId}/sections/${data.sectionId}/lessons/${data.lessonId}`
  );
  await page.getByTestId("save-template").click();
  await expect(page.getByTestId("template-dialog")).toBeVisible();
  await page.getByTestId("template-name").fill("E2E Test Template");
  await page.getByTestId("template-desc").fill("Created by E2E test");
  await page.getByTestId("template-save").click();
  await expect(page.getByTestId("template-dialog")).not.toBeVisible();
});
