## ADDED Requirements

### Requirement: Admin can manage courses
The system SHALL allow admins to create, edit, view, and delete public courses.

#### Scenario: Admin views course list
- **WHEN** admin navigates to `/en/admin/courses`
- **THEN** all public courses are listed with title, level, published status, and order

#### Scenario: Empty course list shows empty state
- **WHEN** no courses exist
- **THEN** a "no courses" message is shown
- **AND** a "Create Course" link is visible

#### Scenario: Admin creates a course
- **WHEN** admin clicks "Create Course"
- **AND** fills in title, description, level
- **AND** clicks save
- **THEN** the course is created and shown in the list

### Requirement: Admin can manage users
The system SHALL allow admins to view and change user roles.

#### Scenario: Admin views user list
- **WHEN** admin navigates to `/en/admin/users`
- **THEN** all users are listed with email, role, join date, and streak

#### Scenario: Admin changes user role
- **WHEN** admin selects a new role from the dropdown
- **THEN** the role is updated immediately

### Requirement: Admin can generate teacher invites
The system SHALL allow admins to generate teacher invite codes.

#### Scenario: Admin generates invite code
- **WHEN** admin navigates to `/en/admin/invites`
- **AND** clicks "Generate Invite"
- **THEN** a new invite code appears in the list with status "active"
- **AND** can be copied to clipboard

#### Scenario: Empty invite list
- **WHEN** no invites exist
- **THEN** a "no invites" message is shown

### Requirement: Admin can manage templates
The system SHALL allow admins to create, edit, and delete official templates.

#### Scenario: Admin creates a template
- **WHEN** admin navigates to `/en/admin/templates`
- **AND** clicks "New Template"
- **AND** fills in name, description, and markdown content
- **AND** clicks save
- **THEN** the template appears in the list

#### Scenario: Admin edits a template
- **WHEN** admin clicks edit on a template
- **AND** modifies the name or content
- **AND** clicks save
- **THEN** the changes are reflected in the list
