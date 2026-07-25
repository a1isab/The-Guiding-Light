# component-retheme Specification

## Purpose
TBD - created by archiving change night-study-redesign. Update Purpose after archive.
## Requirements
### Requirement: Shared components use CSS variable tokens
The system SHALL render all shared components using CSS custom property tokens instead of hardcoded hex values.

#### Scenario: Navbar renders with theme tokens
- **WHEN** the navbar is rendered
- **THEN** it SHALL use `bg-[var(--bg-primary)]`, `text-[var(--text-primary)]`, `border-[var(--border)]` and include a settings link

#### Scenario: Sidebar nav renders with theme tokens
- **WHEN** the sidebar nav is rendered
- **THEN** it SHALL use CSS variable tokens and highlight the active item with amber accent

#### Scenario: Footer renders with theme tokens
- **WHEN** the footer is rendered
- **THEN** it SHALL use CSS variable tokens for all colors

#### Scenario: Logo renders with theme tokens
- **WHEN** the logo component is rendered
- **THEN** it SHALL use CSS variable tokens for all colors

#### Scenario: Badge grid renders with theme tokens
- **WHEN** the badge grid is rendered
- **THEN** it SHALL use CSS variable tokens for all colors

#### Scenario: Course list renders with theme tokens
- **WHEN** the course list is rendered
- **THEN** it SHALL use CSS variable tokens for all colors

#### Scenario: Course curriculum renders with theme tokens
- **WHEN** the course curriculum is rendered
- **THEN** it SHALL use CSS variable tokens for all colors

#### Scenario: Student curriculum renders with theme tokens
- **WHEN** the student curriculum is rendered
- **THEN** it SHALL use CSS variable tokens for all colors

#### Scenario: Quiz renders with theme tokens
- **WHEN** the quiz component is rendered
- **THEN** it SHALL use CSS variable tokens for all colors

#### Scenario: Join class card renders with theme tokens
- **WHEN** the join class card is rendered
- **THEN** it SHALL use CSS variable tokens for all colors

#### Scenario: Announcement banner renders with theme tokens
- **WHEN** the announcement banner is rendered
- **THEN** it SHALL use CSS variable tokens for all colors

#### Scenario: Breadcrumbs render with theme tokens
- **WHEN** the breadcrumbs are rendered
- **THEN** they SHALL use CSS variable tokens for all colors

#### Scenario: Certificate card renders with theme tokens
- **WHEN** the certificate card is rendered
- **THEN** it SHALL use CSS variable tokens for all colors

#### Scenario: Bookmark button renders with theme tokens
- **WHEN** the bookmark button is rendered
- **THEN** it SHALL use CSS variable tokens for all colors

### Requirement: Teacher components use CSS variable tokens
The system SHALL render all teacher components using CSS custom property tokens instead of hardcoded hex values.

#### Scenario: Teacher components render with theme tokens
- **WHEN** any teacher component is rendered (class-form, class-list, file-upload, markdown-content, markdown-editor, quiz-editor, quiz-viewer, template-picker, video-upload)
- **THEN** it SHALL use CSS variable tokens for all colors instead of hardcoded values

### Requirement: Auth components use CSS variable tokens
The system SHALL render the onboarding wizard using CSS custom property tokens.

#### Scenario: Onboarding wizard renders with theme tokens
- **WHEN** the onboarding wizard is rendered
- **THEN** it SHALL use CSS variable tokens for all colors

### Requirement: Cards have hover glow effect
The system SHALL apply a subtle warm glow effect on cards when hovered.

#### Scenario: Card hover produces warm glow
- **WHEN** a user hovers over a card element
- **THEN** the card SHALL display a `box-shadow: 0 0 30px rgba(212, 145, 94, 0.08)` glow effect

