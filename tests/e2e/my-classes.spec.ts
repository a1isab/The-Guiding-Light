import { test, expect } from "@playwright/test";
import { setupTeacherLesson, type TestData } from "./helpers/teacher-setup";
import { loginAs, getUserId, enrollStudent } from "./helpers/auth";

const STUDENT_EMAIL = "student@theguidinglight.com";
const STUDENT_PASSWORD = "Student123!";

test.describe.configure({ timeout: 120000 });

test.describe("my classes page", () => {
  let data: TestData;
  let studentUserId: string;

  test.beforeAll(async ({ browser }) => {
    test.setTimeout(120000);
    const teacherCtx = await browser.newContext();
    const teacherPage = await teacherCtx.newPage();
    data = await setupTeacherLesson(teacherPage);

    const studentCtx = await browser.newContext();
    const studentPage = await studentCtx.newPage();
    await loginAs(studentPage, STUDENT_EMAIL, STUDENT_PASSWORD);
    studentUserId = (await getUserId(studentPage))!;
    expect(studentUserId).toBeTruthy();
    await studentCtx.close();

    await enrollStudent(teacherPage, data.classId, studentUserId);
    await teacherCtx.close();
  });

  test("my classes page shows enrolled classes", async ({ page }) => {
    await loginAs(page, STUDENT_EMAIL, STUDENT_PASSWORD);
    await page.goto("/en/dashboard/classes");
    await page.waitForLoadState("networkidle");

    const classCard = page.getByTestId(`class-card-${data.classId}`);
    await expect(classCard).toBeVisible();
  });

  test("my classes page shows join class card", async ({ page }) => {
    await loginAs(page, STUDENT_EMAIL, STUDENT_PASSWORD);
    await page.goto("/en/dashboard/classes");
    await page.waitForLoadState("networkidle");

    await expect(page.getByTestId("join-class-card")).toBeVisible();
  });

  test("class card shows class name", async ({ page }) => {
    await loginAs(page, STUDENT_EMAIL, STUDENT_PASSWORD);
    await page.goto("/en/dashboard/classes");
    await page.waitForLoadState("networkidle");

    const classCard = page.getByTestId(`class-card-${data.classId}`);
    const text = await classCard.textContent();
    expect(text).toBeTruthy();
  });

  test("clicking class card navigates to class detail", async ({ page }) => {
    await loginAs(page, STUDENT_EMAIL, STUDENT_PASSWORD);
    await page.goto("/en/dashboard/classes");
    await page.waitForLoadState("networkidle");

    const classCard = page.getByTestId(`class-card-${data.classId}`);
    await classCard.click();
    await page.waitForURL(new RegExp(`/en/dashboard/classes/${data.classId}$`));
  });

  test("join class card accepts invite code input", async ({ page }) => {
    await loginAs(page, STUDENT_EMAIL, STUDENT_PASSWORD);
    await page.goto("/en/dashboard/classes");
    await page.waitForLoadState("networkidle");

    const joinCard = page.getByTestId("join-class-card");
    const input = joinCard.locator("input");
    if (await input.isVisible().catch(() => false)) {
      await input.fill("TESTCODE");
      const value = await input.inputValue();
      expect(value).toBe("TESTCODE");
    }
  });

  test("navbar shows My Classes link for student", async ({ page }) => {
    await loginAs(page, STUDENT_EMAIL, STUDENT_PASSWORD);
    await page.goto("/en/dashboard");
    await page.waitForLoadState("networkidle");

    const myClassesLink = page.getByRole("link", { name: /My Classes/i });
    await expect(myClassesLink.first()).toBeVisible();
  });
});
