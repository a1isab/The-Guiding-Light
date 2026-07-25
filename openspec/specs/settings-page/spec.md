# settings-page Specification

## Purpose
TBD - created by archiving change night-study-redesign. Update Purpose after archive.
## Requirements
### Requirement: Settings page route
The system SHALL provide a settings page at the route `/[locale]/settings`.

#### Scenario: Authenticated user navigates to settings
- **WHEN** an authenticated user navigates to `/[locale]/settings`
- **THEN** the system SHALL display the settings page with theme and language options

#### Scenario: Unauthenticated user navigates to settings
- **WHEN** an unauthenticated user navigates to `/[locale]/settings`
- **THEN** the system SHALL redirect to the login page

### Requirement: Theme toggle on settings page
The system SHALL display a visual theme toggle with dark (moon icon) and light (sun icon) options.

#### Scenario: Toggle displays current theme
- **WHEN** the settings page loads
- **THEN** the system SHALL show the current theme with a visual preview and the appropriate icon (moon for dark, sun for light)

#### Scenario: Toggle switches theme instantly
- **WHEN** the user clicks the theme toggle
- **THEN** the system SHALL immediately apply the new theme and persist the selection to localStorage

### Requirement: Language selector on settings page
The system SHALL display a language dropdown with available locales: English, Arabic, Urdu, French.

#### Scenario: Language selector uses next-intl routing
- **WHEN** the user selects a language from the dropdown
- **THEN** the system SHALL use existing `next-intl` routing to switch the locale and persist via cookie

### Requirement: Settings page layout
The system SHALL display settings in a centered card layout with back-to-dashboard navigation.

#### Scenario: Settings layout renders sections
- **WHEN** the settings page renders
- **THEN** it SHALL display a centered card with a theme section (toggle + preview), a language section (dropdown), and a back-to-dashboard link

### Requirement: Settings page is a client component
The system SHALL implement the settings page as a client component to support interactivity.

#### Scenario: Settings page uses client-side state
- **WHEN** the settings page loads
- **THEN** it SHALL be a React client component using `useTheme` hook or inline localStorage logic for theme persistence

