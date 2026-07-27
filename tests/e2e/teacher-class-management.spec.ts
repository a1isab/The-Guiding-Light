import { test, expect } from "@playwright/test";
import { setupTeacherLesson, type TestData } from "./helpers/teacher-setup";
import { loginAs } from "./helpers/auth";

const TEACHER_EMAIL = "teacher@theguidinglight.com";
const TEACHER_PASSWORD = "Teacher123!";

test.describe.configure({ timeout: 120000 });

test.describe("teacher class management", () => {
  let data: TestData;

  test.beforeAll(async ({ browser }) => {
    test.setTimeout(120000);
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    data = await setupTeacherLesson(page);
    await ctx.close();
  });

  test("teacher can create a class", async ({ page }) => {
    await loginAs(page, TEACHER_EMAIL, TEACHER_PASSWORD);
    await page.goto("/en/teacher/classes/new");
    await page.waitForLoadState("networkidle");

    const ts = Date.now();
    await page.getByTestId("class-name-input").fill(`Test Class ${ts}`);
    await page.getByTestId("class-description").fill(`Created by E2E test ${ts}`);
    await page.getByTestId("class-submit").click();
    await page.waitForURL(/\/en\/teacher\/classes\/[0-9a-f]{8}-/);
    await page.waitForLoadState("networkidle");

    const classId = page.url().split("/classes/")[1]?.split(/[?#/]/)[0];
    expect(classId).toBeTruthy();
  });

  test("class detail page shows heading, students, courses sections", async ({ page }) => {
    await loginAs(page, TEACHER_EMAIL, TEACHER_PASSWORD);
    await page.goto(`/en/teacher/classes/${data.classId}`);
    await page.waitForLoadState("networkidle");

    await expect(page.getByTestId("class-heading")).toBeVisible();
    await expect(page.getByTestId("students-heading")).toBeVisible();
    await expect(page.getByTestId("courses-heading")).toBeVisible();
  });

  test("invite code is displayed on class detail", async ({ page }) => {
    await loginAs(page, TEACHER_EMAIL, TEACHER_PASSWORD);
    await page.goto(`/en/teacher/classes/${data.classId}`);
    await page.waitForLoadState("networkidle");

    await expect(page.getByTestId("invite-code-value")).toBeVisible();
    const codeText = await page.getByTestId("invite-code-value").textContent();
    expect(codeText).toBeTruthy();
    expect(codeText!.length).toBeGreaterThan(0);
  });

  test("regenerate and copy invite buttons exist", async ({ page }) => {
    await loginAs(page, TEACHER_EMAIL, TEACHER_PASSWORD);
    await page.goto(`/en/teacher/classes/${data.classId}`);
    await page.waitForLoadState("networkidle");

    await expect(page.getByTestId("btn-regenerate-invite")).toBeVisible();
    await expect(page.getByTestId("btn-copy-invite")).toBeVisible();
  });

  test("progress page loads with matrix", async ({ page }) => {
    await loginAs(page, TEACHER_EMAIL, TEACHER_PASSWORD);
    await page.goto(`/en/teacher/classes/${data.classId}/progress`);
    await page.waitForLoadState("networkidle");

    await expect(page.getByTestId("progress-matrix")).toBeVisible();
  });

  test("analytics page loads with stat cards", async ({ page }) => {
    await loginAs(page, TEACHER_EMAIL, TEACHER_PASSWORD);
    await page.goto(`/en/teacher/classes/${data.classId}/analytics`);
    await page.waitForLoadState("networkidle");

    await expect(page.getByTestId("stat-total-students")).toBeVisible();
    await expect(page.getByTestId("stat-avg-score")).toBeVisible();
    await expect(page.getByTestId("stat-completion")).toBeVisible();
  });

  test("view progress button navigates to progress page", async ({ page }) => {
    await loginAs(page, TEACHER_EMAIL, TEACHER_PASSWORD);
    await page.goto(`/en/teacher/classes/${data.classId}`);
    await page.waitForLoadState("networkidle");

    await page.getByTestId("view-progress").click();
    await page.waitForURL(new RegExp(`/en/teacher/classes/${data.classId}/progress`));
  });

  test("view analytics button navigates to analytics page", async ({ page }) => {
    await loginAs(page, TEACHER_EMAIL, TEACHER_PASSWORD);
    await page.goto(`/en/teacher/classes/${data.classId}`);
    await page.waitForLoadState("networkidle");

    await page.getByTestId("view-analytics").click();
    await page.waitForURL(new RegExp(`/en/teacher/classes/${data.classId}/analytics`));
  });

  test("new course link exists on class detail", async ({ page }) => {
    await loginAs(page, TEACHER_EMAIL, TEACHER_PASSWORD);
    await page.goto(`/en/teacher/classes/${data.classId}`);
    await page.waitForLoadState("networkidle");

    await expect(page.getByTestId("new-course-link")).toBeVisible();
  });
});
