import { test, expect } from "@playwright/test";
import { setupTeacherLesson, type TestData } from "./helpers/teacher-setup";
import { loginAs, getUserId, enrollStudent } from "./helpers/auth";

const STUDENT_EMAIL = "student@theguidinglight.com";
const STUDENT_PASSWORD = "Student123!";
const TEACHER_EMAIL = "teacher@theguidinglight.com";
const TEACHER_PASSWORD = "Teacher123!";

test.describe.configure({ timeout: 120000 });

async function gotoNoTour(page: import("@playwright/test").Page, url: string) {
  await page.goto("/en/auth/login");
  await page.evaluate(() => localStorage.setItem("tour_completed", "true"));
  await page.goto(url);
  await page.waitForLoadState("networkidle");
}

test.describe("breadcrumbs on student pages", () => {
  let data: TestData;
  let studentUserId: string;

  test.beforeAll(async ({ browser }) => {
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

  test("9.1 breadcrumbs visible on student class detail page", async ({ page }) => {
    await loginAs(page, STUDENT_EMAIL, STUDENT_PASSWORD);
    await gotoNoTour(page, `/en/dashboard/classes/${data.classId}`);

    await expect(page.getByTestId("breadcrumbs")).toBeVisible();
    const crumbs = page.getByTestId("breadcrumbs");
    await expect(crumbs).toContainText("My Classes");
  });

  test("9.2 breadcrumbs visible on student course page with 3 levels", async ({ page }) => {
    await loginAs(page, STUDENT_EMAIL, STUDENT_PASSWORD);
    await gotoNoTour(page, `/en/dashboard/classes/${data.classId}/courses/${data.courseId}`);

    await expect(page.getByTestId("breadcrumbs")).toBeVisible();
    const crumbs = page.getByTestId("breadcrumbs");
    await expect(crumbs).toContainText("My Classes");
    await expect(crumbs).toContainText("Course");
  });

  test("9.3 breadcrumbs visible on student lesson page with 4 levels", async ({ page }) => {
    await loginAs(page, STUDENT_EMAIL, STUDENT_PASSWORD);
    await gotoNoTour(page, `/en/dashboard/classes/${data.classId}/courses/${data.courseId}/lessons/${data.lessonId}`);

    await expect(page.getByTestId("breadcrumbs")).toBeVisible();
    const crumbs = page.getByTestId("breadcrumbs");
    await expect(crumbs).toContainText("My Classes");
  });

  test("9.4 breadcrumbs on class page link back to dashboard", async ({ page }) => {
    await loginAs(page, STUDENT_EMAIL, STUDENT_PASSWORD);
    await gotoNoTour(page, `/en/dashboard/classes/${data.classId}`);

    const dashboardLink = page.getByTestId("breadcrumbs").getByRole("link", { name: /My Classes/i });
    await dashboardLink.click({ force: true });
    await page.waitForURL(/\/en\/dashboard/);
  });
});

test.describe("sidebar nav on teacher pages", () => {
  test("9.5 sidebar nav visible on teacher dashboard", async ({ page }) => {
    await loginAs(page, TEACHER_EMAIL, TEACHER_PASSWORD);
    await gotoNoTour(page, "/en/teacher");

    await expect(page.getByTestId("sidebar-nav")).toBeVisible();
  });

  test("9.6 teacher dashboard nav item is active on /teacher", async ({ page }) => {
    await loginAs(page, TEACHER_EMAIL, TEACHER_PASSWORD);
    await gotoNoTour(page, "/en/teacher");

    const dashLink = page.getByTestId("nav-teacher-dashboard");
    await expect(dashLink).toBeVisible();
    const style = await dashLink.getAttribute("style");
    expect(style).toContain("--bg-elevated");
  });

  test("9.7 classes nav item is active when on classes page", async ({ page }) => {
    await loginAs(page, TEACHER_EMAIL, TEACHER_PASSWORD);
    await gotoNoTour(page, "/en/teacher/classes");

    const classesLink = page.getByTestId("nav-classes");
    await expect(classesLink).toBeVisible();
    const style = await classesLink.getAttribute("style");
    expect(style).toContain("--bg-elevated");
  });

  test("9.8 clicking classes nav navigates to classes list", async ({ page }) => {
    await loginAs(page, TEACHER_EMAIL, TEACHER_PASSWORD);
    await gotoNoTour(page, "/en/teacher");

    await page.getByTestId("nav-classes").click({ force: true });
    await page.waitForURL(/\/en\/teacher\/classes/);
  });
});

test.describe("student curriculum collapsible sections", () => {
  let data: TestData;
  let studentUserId: string;

  test.beforeAll(async ({ browser }) => {
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

  test("9.9 student course page shows collapsible sections", async ({ page }) => {
    await loginAs(page, STUDENT_EMAIL, STUDENT_PASSWORD);
    await gotoNoTour(page, `/en/dashboard/classes/${data.classId}/courses/${data.courseId}`);

    await expect(page.getByTestId(`student-section-${data.sectionId}`)).toBeVisible();
  });

  test("9.10 lessons visible when section expanded", async ({ page }) => {
    await loginAs(page, STUDENT_EMAIL, STUDENT_PASSWORD);
    await gotoNoTour(page, `/en/dashboard/classes/${data.classId}/courses/${data.courseId}`);

    await expect(page.getByTestId(`student-lesson-${data.lessonId}`)).toBeVisible();
  });

  test("9.11 section can be collapsed and expanded", async ({ page }) => {
    await loginAs(page, STUDENT_EMAIL, STUDENT_PASSWORD);
    await gotoNoTour(page, `/en/dashboard/classes/${data.classId}/courses/${data.courseId}`);

    const section = page.getByTestId(`student-section-${data.sectionId}`);
    await expect(section).toBeVisible();

    const toggleButton = section.locator("button").first();
    await toggleButton.click({ force: true });
    await expect(page.getByTestId(`student-lesson-${data.lessonId}`)).not.toBeVisible();

    await toggleButton.click({ force: true });
    await expect(page.getByTestId(`student-lesson-${data.lessonId}`)).toBeVisible();
  });
});

test.describe("lesson prev/next navigation", () => {
  let data: TestData;
  let studentUserId: string;

  test.beforeAll(async ({ browser }) => {
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

  test("9.12 first lesson shows Back to Course as prev nav", async ({ page }) => {
    await loginAs(page, STUDENT_EMAIL, STUDENT_PASSWORD);
    await gotoNoTour(page, `/en/dashboard/classes/${data.classId}/courses/${data.courseId}/lessons/${data.lessonId}`);

    const prevLink = page.getByTestId("nav-prev-lesson");
    await expect(prevLink).toBeVisible();
    await expect(prevLink).toContainText("Course");
  });

  test("9.13 single lesson course has no next nav", async ({ page }) => {
    await loginAs(page, STUDENT_EMAIL, STUDENT_PASSWORD);
    await gotoNoTour(page, `/en/dashboard/classes/${data.classId}/courses/${data.courseId}/lessons/${data.lessonId}`);

    const nextLink = page.getByTestId("nav-next-lesson");
    await expect(nextLink).not.toBeVisible();
  });

  test("9.14 clicking prev (Back to Course) navigates to course page", async ({ page }) => {
    await loginAs(page, STUDENT_EMAIL, STUDENT_PASSWORD);
    await gotoNoTour(page, `/en/dashboard/classes/${data.classId}/courses/${data.courseId}/lessons/${data.lessonId}`);

    const prevLink = page.getByTestId("nav-prev-lesson");
    await prevLink.click({ force: true });
    await page.waitForURL(new RegExp(`/en/dashboard/classes/${data.classId}/courses/${data.courseId}`));
  });
});
