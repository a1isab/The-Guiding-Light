import { test, expect } from "@playwright/test";
import { setupTeacherLesson } from "./helpers/teacher-setup";

test("file upload area is visible on lesson editor", async ({ page }) => {
  const data = await setupTeacherLesson(page);

  await page.goto(
    `/${data.locale}/teacher/classes/${data.classId}/courses/${data.courseId}/sections/${data.sectionId}/lessons/${data.lessonId}`,
    { waitUntil: "networkidle" }
  );
  await expect(page.getByTestId("file-upload-area")).toBeVisible({ timeout: 10000 });
});
