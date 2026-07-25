## ADDED Requirements

### Requirement: Teacher can create and manage classes
The system SHALL allow teachers to create, view, edit, and delete classes.

#### Scenario: Teacher creates a class
- **WHEN** teacher navigates to `/en/teacher/classes/new`
- **AND** fills in class name and description
- **AND** clicks submit
- **THEN** a new class is created
- **AND** redirects to the class detail page

#### Scenario: Teacher dashboard shows classes
- **WHEN** teacher navigates to `/en/teacher`
- **THEN** stats cards (total classes, students, courses) are shown
- **AND** recent classes are listed

#### Scenario: Empty teacher dashboard
- **WHEN** teacher has no classes
- **THEN** a "no classes" empty state message is shown

### Requirement: Teacher can manage class details
The system SHALL show invite code, student list, and course list on the class detail page.

#### Scenario: Class detail shows invite code
- **WHEN** teacher navigates to `/en/teacher/classes/{id}`
- **THEN** the invite code is displayed
- **AND** a "Copy" button and "Regenerate" button are visible

#### Scenario: Teacher regenerates invite code
- **WHEN** teacher clicks "Regenerate"
- **THEN** the invite code changes to a new value

#### Scenario: Teacher views student list
- **WHEN** teacher navigates to class detail
- **THEN** enrolled students are listed
- **AND** a "Remove" button is available for each student

### Requirement: Teacher can create courses, sections, and lessons
The system SHALL allow teachers to create a course hierarchy within a class.

#### Scenario: Teacher creates a course
- **WHEN** teacher navigates to class detail
- **AND** clicks "New Course"
- **AND** fills in title and description
- **AND** clicks submit
- **THEN** the course is created
- **AND** redirects to the course detail page

#### Scenario: Teacher creates a section
- **WHEN** teacher is on the course detail page
- **AND** adds a new section with a title
- **THEN** the section appears in the curriculum

#### Scenario: Teacher creates a lesson
- **WHEN** teacher is on a section
- **AND** adds a new lesson with title and content
- **THEN** the lesson appears in the section

#### Scenario: Lesson editor loads with all elements
- **WHEN** teacher navigates to the lesson editor
- **THEN** the lesson title input, save button, preview toggle, and file upload area are visible

#### Scenario: Preview mode toggles correctly
- **WHEN** teacher clicks preview toggle
- **THEN** a preview banner is shown
- **AND** a "Back to Edit" button returns to edit mode

### Requirement: Teacher can save and manage templates
The system SHALL allow teachers to save lessons as templates.

#### Scenario: Save as template dialog
- **WHEN** teacher clicks "Save as Template"
- **THEN** a dialog opens with name and description fields
- **AND** clicking save closes the dialog

### Requirement: Teacher can view student progress
The system SHALL display a progress matrix of students vs. lessons with completion and quiz scores.

#### Scenario: Progress matrix shows data
- **WHEN** teacher navigates to progress page
- **THEN** a table shows students as rows and lessons as columns
- **AND** each cell shows a checkmark or quiz score
- **AND** completion percentage per student is displayed
