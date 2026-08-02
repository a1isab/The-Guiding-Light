## MODIFIED Requirements

### Requirement: Guided tour on first login
The system SHALL automatically display a guided tour for new users on their first login after account creation. Tour steps SHALL target DOM elements using `data-section` and `data-nav` attributes that exist on the page.

#### Scenario: First-time student sees tour
- **WHEN** a student logs in for the first time (no `tour_completed` flag in localStorage)
- **THEN** the system SHALL display a driver.js guided tour with student-specific steps highlighting: dashboard heading, Featured nav link (`data-nav="featured"`), My Classes section (`data-section="my-classes"`), badge grid (`data-section="badge-grid"`), and streak display (`data-section="streak"`)

#### Scenario: First-time teacher sees tour
- **WHEN** a teacher logs in for the first time
- **THEN** the system SHALL display a guided tour with teacher-specific steps highlighting: dashboard heading, classes list, new class button, class detail page, quiz builder, analytics link, and verify link

#### Scenario: First-time admin sees tour
- **WHEN** an admin logs in for the first time
- **THEN** the system SHALL display a guided tour with admin-specific steps highlighting: dashboard overview, users link, verifications link, and courses link

#### Scenario: Tour does not replay automatically
- **WHEN** a user has `tour_completed = true` in localStorage
- **THEN** the system SHALL NOT display the tour automatically

### Requirement: Tour is role-specific
The system SHALL display different tour steps depending on the user's role (student, teacher, or admin). Tour steps MUST target elements with the correct `data-section` or `data-nav` attributes.

#### Scenario: Student tour steps
- **WHEN** the tour is triggered for a user with role "student"
- **THEN** the tour SHALL include steps for: dashboard, Featured link, My Classes, badges, and streak

#### Scenario: Teacher tour steps
- **WHEN** the tour is triggered for a user with role "teacher" or "admin"
- **THEN** the tour SHALL include steps for: dashboard, classes, class creation, course builder, quizzes, analytics, and verification

#### Scenario: Admin tour steps
- **WHEN** the tour is triggered for a user with role "admin"
- **THEN** the tour SHALL include steps for: dashboard overview, users, verifications, and courses
