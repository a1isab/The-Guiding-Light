import { test, expect } from "@playwright/test";
import { setupTeacherLesson, type TestData } from "./helpers/teacher-setup";

let data: TestData;

test.beforeEach(async ({ page }) => {
  data = await setupTeacherLesson(page);
});

test("invite code regeneration button exists", async ({ page }) => {
  await page.goto(`/${data.locale}/teacher/classes/${data.classId}`);
  await expect(page.getByTestId("invite-code-value")).toBeVisible();
  await expect(page.getByTestId("btn-regenerate-invite")).toBeVisible();
});
