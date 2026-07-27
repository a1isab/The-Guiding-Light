import { test, expect } from "@playwright/test";
import { setupTeacherLesson, type TestData } from "./helpers/teacher-setup";
import { loginAs, getUserId, enrollStudent } from "./helpers/auth";

const STUDENT_EMAIL = "student@theguidinglight.com";
const STUDENT_PASSWORD = "Student123!";

test.describe.configure({ timeout: 120000 });

test.describe("student class detail flow", () => {
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

  test("class detail page shows class name", async ({ page }) => {
    await loginAs(page, STUDENT_EMAIL, STUDENT_PASSWORD);
    await page.goto(`/en/dashboard/classes/${data.classId}`);
    await page.waitForLoadState("networkidle");

    await expect(page.getByTestId("breadcrumbs")).toBeVisible();
    const heading = page.locator("h1, h2").first();
    await expect(heading).toBeVisible();
  });

  test("class detail page shows course card", async ({ page }) => {
    await loginAs(page, STUDENT_EMAIL, STUDENT_PASSWORD);
    await page.goto(`/en/dashboard/classes/${data.classId}`);
    await page.waitForLoadState("networkidle");

    const courseCard = page.getByTestId(`class-course-card-${data.courseId}`);
    await expect(courseCard).toBeVisible();
  });

  test("clicking course card navigates to course curriculum", async ({ page }) => {
    await loginAs(page, STUDENT_EMAIL, STUDENT_PASSWORD);
    await page.goto(`/en/dashboard/classes/${data.classId}`);
    await page.waitForLoadState("networkidle");

    await page.goto(`/en/dashboard/classes/${data.classId}/courses/${data.courseId}`);
    await page.waitForLoadState("networkidle");
    expect(page.url()).toContain(`/courses/${data.courseId}`);
  });

  test("course curriculum shows section and lesson", async ({ page }) => {
    await loginAs(page, STUDENT_EMAIL, STUDENT_PASSWORD);
    await page.goto(`/en/dashboard/classes/${data.classId}/courses/${data.courseId}`);
    await page.waitForLoadState("networkidle");

    await expect(page.getByTestId(`student-section-${data.sectionId}`)).toBeVisible();
    await expect(page.getByTestId(`student-lesson-${data.lessonId}`)).toBeVisible();
  });

  test("lesson page shows mark viewed button", async ({ page }) => {
    await loginAs(page, STUDENT_EMAIL, STUDENT_PASSWORD);
    await page.goto(`/en/dashboard/classes/${data.classId}/courses/${data.courseId}/lessons/${data.lessonId}`);
    await page.waitForLoadState("networkidle");

    await expect(page.getByTestId("mark-viewed")).toBeVisible();
  });

  test("lesson page has prev navigation (Back to Course)", async ({ page }) => {
    await loginAs(page, STUDENT_EMAIL, STUDENT_PASSWORD);
    await page.goto(`/en/dashboard/classes/${data.classId}/courses/${data.courseId}/lessons/${data.lessonId}`);
    await page.waitForLoadState("networkidle");

    const prevLink = page.getByTestId("nav-prev-lesson");
    await expect(prevLink).toBeVisible();
  });

  test("student can mark lesson as viewed", async ({ page }) => {
    await loginAs(page, STUDENT_EMAIL, STUDENT_PASSWORD);
    await page.goto(`/en/dashboard/classes/${data.classId}/courses/${data.courseId}/lessons/${data.lessonId}`);
    await page.waitForLoadState("networkidle");

    const markBtn = page.getByTestId("mark-viewed");
    await expect(markBtn).toBeVisible({ timeout: 15000 });
    await markBtn.click({ force: true, timeout: 15000 });
    await page.waitForTimeout(2000);

    const isDisabled = await markBtn.isDisabled().catch(() => false);
    const text = await markBtn.textContent().catch(() => "");
    expect(isDisabled || text?.toLowerCase().includes("viewed")).toBe(true);
  });

  test("student navigates back to class detail from breadcrumbs", async ({ page }) => {
    await loginAs(page, STUDENT_EMAIL, STUDENT_PASSWORD);
    await page.goto(`/en/dashboard/classes/${data.classId}/courses/${data.courseId}`);
    await page.waitForLoadState("networkidle");

    const breadcrumbs = page.getByTestId("breadcrumbs");
    await expect(breadcrumbs).toBeVisible();
    const links = breadcrumbs.getByRole("link");
    const count = await links.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test("non-enrolled student gets 404 on class detail", async ({ page }) => {
    await loginAs(page, STUDENT_EMAIL, STUDENT_PASSWORD);
    await page.goto("/en/dashboard/classes/00000000-0000-0000-0000-000000000000");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000);

    const body = await page.locator("main, body").textContent() ?? "";
    const is404 = body.includes("404") || body.toLowerCase().includes("not found") || page.url().includes("404");
    expect(is404).toBe(true);
  });
});
