## ADDED Requirements

### Requirement: Prev/Next lesson navigation buttons

At the bottom of each student lesson page, navigation buttons allow sequential movement through lessons within a course.

#### Scenario: Both buttons visible when middle lesson
- **WHEN** the user is on lesson 2 of 4 in a course
- **THEN** both "Previous" and "Next" buttons are visible

#### Scenario: Previous button absent on first lesson
- **WHEN** the user is on lesson 1 of 4
- **THEN** only the "Next" button is visible

#### Scenario: Next button absent on last lesson
- **WHEN** the user is on lesson 4 of 4
- **THEN** only the "Previous" button is visible

#### Scenario: Button links to correct lesson
- **WHEN** the user clicks "Next" from lesson 2
- **THEN** the browser navigates to `/en/dashboard/classes/{classId}/courses/{courseId}/lessons/{nextLessonId}`

#### Scenario: Previous button returns to course page if no previous
- **WHEN** this is the first lesson and user clicks Previous
- **THEN** it navigates to `/en/dashboard/classes/{classId}/courses/{courseId}` (the course page)

#### Scenario: Navigation computed server-side
- **WHEN** the lesson page renders
- **THEN** the server component queries all lessons in the course and computes prev/next before rendering

#### Scenario: Component has test identifiers
- **WHEN** the navigation renders
- **THEN** previous button has `data-testid="nav-prev-lesson"` and next button has `data-testid="nav-next-lesson"`
