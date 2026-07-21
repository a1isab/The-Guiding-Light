import { test, expect } from "@playwright/test";
import { setupTeacherLesson } from "./helpers/teacher-setup";

test("lesson editor loads with data-testid elements", async ({ page }) => {
  const data = await setupTeacherLesson(page);

  await page.goto(
    `/${data.locale}/teacher/classes/${data.classId}/courses/${data.courseId}/sections/${data.sectionId}/lessons/${data.lessonId}`,
    { waitUntil: "networkidle" }
  );
  await expect(page.getByTestId("lesson-title")).toBeVisible({ timeout: 10000 });
  await expect(page.getByTestId("save-lesson")).toBeVisible();
  await expect(page.getByTestId("preview-toggle")).toBeVisible();
});
