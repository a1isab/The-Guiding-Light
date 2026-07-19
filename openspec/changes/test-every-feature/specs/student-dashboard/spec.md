## ADDED Requirements

### Requirement: Student dashboard shows stats cards
The system SHALL display key engagement metrics on the student dashboard.

#### Scenario: Dashboard shows all stat cards
- **WHEN** student logs in and navigates to `/en/dashboard`
- **THEN** the following stats are visible: "Lessons Completed", "Current Streak", "Your Plan", "Overall Progress"
- **AND** a weekly activity summary is shown

#### Scenario: Dashboard shows class list
- **WHEN** student has joined one or more classes
- **THEN** each class card shows the class name and course count
- **AND** clicking a class card navigates to the class detail page

#### Scenario: Dashboard shows "Continue Learning"
- **WHEN** student has uncompleted lessons
- **THEN** a "Continue Learning" card shows the next lesson
- **AND** clicking it navigates to that lesson

#### Scenario: Dashboard shows badges
- **WHEN** student has earned badges
- **THEN** badges are displayed with their names

#### Scenario: Dashboard shows empty state
- **WHEN** student has no classes and no progress
- **THEN** the dashboard shows a "Join a Class" prompt
- **AND** a link to browse courses

### Requirement: Student can join a class with invite code
The system SHALL allow a student to join a class using an invite code.

#### Scenario: Successful join shows success state
- **WHEN** student navigates to `/en/join/VALIDCODE`
- **THEN** a success message with class name is shown
- **AND** a "Go to Dashboard" button navigates to `/en/dashboard`

#### Scenario: Already a member shows exists state
- **WHEN** student navigates to a join link for a class they already belong to
- **THEN** an "already a member" message is shown
- **AND** a "Go to Dashboard" button is shown

#### Scenario: Expired invite shows expired state
- **WHEN** student navigates to a join link with an expired invite code
- **THEN** an "invite expired" message is shown

#### Scenario: Invalid invite shows error state
- **WHEN** student navigates to a join link with a nonexistent invite code
- **THEN** an error message is shown
