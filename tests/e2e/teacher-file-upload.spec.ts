import { test, expect } from "@playwright/test";
import { setupTeacherLesson, type TestData } from "./helpers/teacher-setup";

let data: TestData;

test.beforeEach(async ({ page }) => {
  data = await setupTeacherLesson(page);
});

test("file upload area is visible on lesson editor", async ({ page }) => {
  await page.goto(
    `/${data.locale}/teacher/classes/${data.classId}/courses/${data.courseId}/sections/${data.sectionId}/lessons/${data.lessonId}`
  );
  await expect(page.getByTestId("file-upload-area")).toBeVisible();
});
