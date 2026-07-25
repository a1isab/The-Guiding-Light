# featured-classes Specification

## Purpose
TBD - created by archiving change teacher-verification-featured-tour. Update Purpose after archive.
## Requirements
### Requirement: Featured page displays verified teachers and classes
The system SHALL provide a `/featured` page accessible to all authenticated users showing verified teachers and their classes.

#### Scenario: Student views featured page
- **WHEN** an authenticated student navigates to `/featured`
- **THEN** the system SHALL display a page with two toggleable views: "Verified Teachers" and "Verified Classes", defaulting to "Verified Classes"

#### Scenario: No verified teachers exist
- **WHEN** an authenticated student navigates to `/featured` and no teachers have `is_verified = true`
- **THEN** the system SHALL display an empty state message "No verified teachers yet"

#### Scenario: Unauthenticated user attempts to access featured
- **WHEN** an unauthenticated user navigates to `/featured`
- **THEN** the system SHALL redirect to the login page

### Requirement: Verified Teachers listing
The system SHALL display a grid of verified teacher cards showing the teacher's display name (or email fallback), number of classes, and total lesson count.

#### Scenario: Student toggles to teachers view
- **WHEN** the student clicks the "Verified Teachers" toggle on the featured page
- **THEN** the system SHALL display a responsive grid of teacher cards, each showing display name, class count, and lesson count

#### Scenario: Student clicks a teacher card
- **WHEN** the student clicks on a verified teacher card
- **THEN** the system SHALL display that teacher's classes below the card (or navigate to a teacher detail view)

### Requirement: Verified Classes listing
The system SHALL display a grid of class cards for all classes owned by verified teachers, showing class name, teacher name, course count, and cover image (if set).

#### Scenario: Student toggles to classes view
- **WHEN** the student clicks the "Verified Classes" toggle on the featured page
- **THEN** the system SHALL display a responsive grid of class cards, each showing class name, teacher display name, course count, and cover image

#### Scenario: Student clicks a class card title
- **WHEN** the student clicks on a class card's title/link
- **THEN** the system SHALL navigate to `/featured/classes/{classId}` showing the full curriculum

### Requirement: One-click class join from featured
The system SHALL allow students to join a featured class with a single button click, using the class's invite code.

#### Scenario: Student joins a featured class
- **WHEN** the student clicks "Join Class" on a featured class card
- **THEN** the system SHALL call the join API with the class's invite_code (fetched server-side), add the student to `class_members`, and redirect to `/dashboard/classes/{classId}`

#### Scenario: Student is already enrolled
- **WHEN** the student clicks "Join Class" on a class they are already enrolled in
- **THEN** the system SHALL redirect to `/dashboard/classes/{classId}` without error

#### Scenario: Join fails (expired or invalid code)
- **WHEN** the join API returns an error (e.g., expired invite code)
- **THEN** the system SHALL display an error toast message to the student

### Requirement: Featured class detail page (read-only browse)
The system SHALL provide a `/featured/classes/[classId]` page showing the full curriculum (courses, sections, lessons) and lesson content (text + video) without requiring enrollment.

#### Scenario: Student views featured class curriculum
- **WHEN** a student navigates to `/featured/classes/{classId}` for a verified teacher's class
- **THEN** the system SHALL display the class name, description, and a tree of courses → sections → lessons

#### Scenario: Student views a lesson's content
- **WHEN** the student clicks on a lesson in the featured class curriculum
- **THEN** the system SHALL display the lesson's full text content and video (if present) in read-only mode — no quiz, no "mark complete" button, no progress tracking

#### Scenario: Student views non-verified class
- **WHEN** a student navigates to `/featured/classes/{classId}` for a class whose teacher is NOT verified
- **THEN** the system SHALL return a 404 Not Found

#### Scenario: Featured class detail shows join CTA
- **WHEN** the student views a featured class detail page and is not enrolled
- **THEN** the system SHALL display a "Join Class" call-to-action button at the top of the page

### Requirement: Navbar replaces Courses with Featured
The system SHALL replace the "Courses" navigation link with "Featured" linking to `/featured` for all authenticated users.

#### Scenario: Student sees Featured in navbar
- **WHEN** a logged-in student views the navbar
- **THEN** the navbar SHALL show a "Featured" link (with Sparkles icon) pointing to `/featured`, and the old "Courses" link SHALL NOT appear

#### Scenario: Teacher sees Featured in navbar
- **WHEN** a logged-in teacher views the navbar
- **THEN** the navbar SHALL show a "Featured" link pointing to `/featured`

### Requirement: Featured data API
The system SHALL provide a `GET /api/featured` endpoint returning verified teachers with their classes, courses, section counts, and lesson counts.

#### Scenario: API returns featured data
- **WHEN** an authenticated user calls `GET /api/featured`
- **THEN** the system SHALL return a JSON payload with `{ teachers: [...], classes: [...] }` where each teacher includes user_id, display_name, class_count, lesson_count; each class includes id, name, description, cover_image, invite_code, teacher display_name, course_count, lesson_count

#### Scenario: API requires authentication
- **WHEN** an unauthenticated user calls `GET /api/featured`
- **THEN** the system SHALL return a 401 Unauthorized response

