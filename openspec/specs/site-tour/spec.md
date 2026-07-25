# site-tour Specification

## Purpose
TBD - created by archiving change teacher-verification-featured-tour. Update Purpose after archive.
## Requirements
### Requirement: Guided tour on first login
The system SHALL automatically display a guided tour for new users on their first login after account creation.

#### Scenario: First-time student sees tour
- **WHEN** a student logs in for the first time (no `tour_completed` flag in localStorage)
- **THEN** the system SHALL display a driver.js guided tour with student-specific steps highlighting: dashboard heading, Featured nav link, My Classes section, badge grid, and streak display

#### Scenario: First-time teacher sees tour
- **WHEN** a teacher logs in for the first time
- **THEN** the system SHALL display a guided tour with teacher-specific steps highlighting: dashboard heading, classes list, new class button, class detail page, quiz builder, analytics link, and verify link

#### Scenario: First-time admin sees tour
- **WHEN** an admin logs in for the first time
- **THEN** the system SHALL display a guided tour with admin-specific steps highlighting: dashboard overview, users link, verifications link, and courses link

#### Scenario: Tour does not replay automatically
- **WHEN** a user has `tour_completed = true` in localStorage
- **THEN** the system SHALL NOT display the tour automatically

### Requirement: Tour replay from user dropdown
The system SHALL provide a "Tour" button in the user dropdown menu that replays the guided tour.

#### Scenario: User clicks Tour button
- **WHEN** a user clicks the "Tour" button in the user dropdown menu
- **THEN** the system SHALL display the guided tour from the beginning, regardless of prior completion status

### Requirement: Tour marks completion in localStorage
The system SHALL store tour completion in localStorage to prevent automatic replay.

#### Scenario: Tour completes
- **WHEN** the user finishes all tour steps (or clicks "Done")
- **THEN** the system SHALL set `localStorage.tour_completed = "true"`

#### Scenario: Tour is skipped
- **WHEN** the user clicks "Skip" during the tour
- **THEN** the system SHALL set `localStorage.tour_completed = "true"` and close the tour overlay

### Requirement: Tour uses driver.js highlighting
The system SHALL use driver.js to highlight target UI elements with popover descriptions.

#### Scenario: Tour step highlights an element
- **WHEN** a tour step targets a DOM element (by CSS selector)
- **THEN** driver.js SHALL highlight the element with an overlay and display a popover with the step title and description

#### Scenario: Tour step with no DOM target
- **WHEN** a tour step targets a page-level concept (e.g., "Welcome to The Guiding Light")
- **THEN** driver.js SHALL display a centered popover without element highlighting

### Requirement: Tour is role-specific
The system SHALL display different tour steps depending on the user's role (student, teacher, or admin).

#### Scenario: Student tour steps
- **WHEN** the tour is triggered for a user with role "student"
- **THEN** the tour SHALL include steps for: dashboard, Featured link, My Classes, badges, and streak

#### Scenario: Teacher tour steps
- **WHEN** the tour is triggered for a user with role "teacher" or "admin"
- **THEN** the tour SHALL include steps for: dashboard, classes, class creation, course builder, quizzes, analytics, and verification

#### Scenario: Admin tour steps
- **WHEN** the tour is triggered for a user with role "admin"
- **THEN** the tour SHALL include steps for: dashboard overview, users, verifications, and courses

