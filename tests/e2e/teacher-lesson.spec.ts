import { test, expect } from "@playwright/test";
import { setupTeacherLesson, type TestData } from "./helpers/teacher-setup";

let data: TestData;

test.beforeEach(async ({ page }) => {
  data = await setupTeacherLesson(page);
});

test("lesson editor loads with data-testid elements", async ({ page }) => {
  await page.goto(
    `/${data.locale}/teacher/classes/${data.classId}/courses/${data.courseId}/sections/${data.sectionId}/lessons/${data.lessonId}`
  );
  await expect(page.getByTestId("lesson-title")).toBeVisible();
  await expect(page.getByTestId("save-lesson")).toBeVisible();
  await expect(page.getByTestId("preview-toggle")).toBeVisible();
});
