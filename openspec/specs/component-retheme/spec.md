# component-retheme Specification

## Purpose
Requires all shared, teacher, and auth components to render with theme tokens and the Nur UI primitives (Button, Card, Input, EmptyState, Badge) instead of hardcoded hex values or inline style duplication. Synced from frontend-design-overhaul (07-31).
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
The system SHALL apply a warm gold glow effect on cards when hovered, using the `--glow-strong` token.

#### Scenario: Card hover produces warm glow
- **WHEN** a user hovers over a card element
- **THEN** the card SHALL transition `box-shadow` to `0 0 40px var(--glow-strong)` (gold)

### Requirement: UI primitives are the standard interface
The system SHALL use the shared UI primitives in `src/components/ui/` as the standard for all buttons, cards, inputs, empty states, and badges.

#### Scenario: Buttons use the Button primitive
- **WHEN** an interactive action button is rendered
- **THEN** it SHALL use `Button` with one of four variants (primary, secondary, ghost, danger), three sizes (sm, md, lg), and supporting states (loading, disabled, focus-visible, active) plus optional `href` (renders `<a>`)

#### Scenario: Cards use the Card primitive
- **WHEN** a contained content region is rendered
- **THEN** it SHALL use `Card` with `hoverable` and `padding` (sm/md/lg) options, and `testId` for testing

#### Scenario: Inputs use the Input primitive
- **WHEN** a form text input is rendered
- **THEN** it SHALL use `Input` with `label`, `error`, `helperText`, focus ring, and `aria-describedby` wiring

#### Scenario: Empty states use the EmptyState primitive
- **WHEN** a section has no content to show
- **THEN** it SHALL use `EmptyState` with `icon`, `title`, `description`, and optional CTA, replacing ad-hoc empty-state markup

#### Scenario: Badges use the Badge primitive
- **WHEN** a status or label pill is rendered
- **THEN** it SHALL use `Badge` with a color variant (success, warning, error, info)

