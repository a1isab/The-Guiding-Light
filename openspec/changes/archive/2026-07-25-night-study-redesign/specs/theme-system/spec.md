## ADDED Requirements

### Requirement: CSS custom properties define all color tokens
The system SHALL define all color tokens as CSS custom properties in `:root` (dark mode) and `[data-theme="light"]` (light mode).

#### Scenario: Dark mode tokens are defined
- **WHEN** the page loads without a `data-theme` attribute (or with `data-theme="dark"`)
- **THEN** the system SHALL apply dark mode tokens: `--bg-primary: #0A0D12`, `--bg-surface: #13171F`, `--bg-elevated: #1C2130`, `--bg-subtle: #252A36`, `--text-primary: #F0ECE4`, `--text-secondary: #8B8D94`, `--text-muted: #52566A`, `--accent: #D4915E`, `--accent-dim: #8B5E3C`, `--border: #1C2130`, `--border-subtle: #13171F`, `--success: #3DD68C`, `--error: #E05252`

#### Scenario: Light mode tokens are defined
- **WHEN** the page has `data-theme="light"` on the `<html>` element
- **THEN** the system SHALL apply light mode tokens: `--bg-primary: #F5F1EB`, `--bg-surface: #FFFFFF`, `--bg-elevated: #FAF8F5`, `--bg-subtle: #F0ECE4`, `--text-primary: #1A1D24`, `--text-secondary: #6B7280`, `--text-muted: #9CA3AF`, `--accent: #B87A4A`, `--accent-dim: #D4915E`, `--border: #E5E1DB`, `--border-subtle: #F0ECE4`, `--success: #16A34A`, `--error: #DC2626`

### Requirement: Tailwind v4 maps CSS variables to utilities
The system SHALL use a Tailwind v4 `@theme inline` block to map CSS custom properties to Tailwind utility classes.

#### Scenario: Tailwind utilities resolve to CSS variables
- **WHEN** a component uses a Tailwind class like `bg-[var(--bg-primary)]` or theme-mapped utility
- **THEN** Tailwind SHALL resolve it to the corresponding CSS custom property value

### Requirement: Theme toggle persists to localStorage
The system SHALL persist the user's theme preference to `localStorage` under the key `theme`.

#### Scenario: User toggles to light mode
- **WHEN** the user selects light mode via the theme toggle
- **THEN** the system SHALL set `localStorage.setItem('theme', 'light')` and apply `data-theme="light"` on `<html>`

#### Scenario: User toggles to dark mode
- **WHEN** the user selects dark mode via the theme toggle
- **THEN** the system SHALL set `localStorage.setItem('theme', 'dark')` and remove the `data-theme` attribute (or set it to `"dark"`)

### Requirement: Theme initialization script prevents flash
The system SHALL include an initialization script in the root `<head>` that reads `localStorage` before first paint.

#### Scenario: Page loads with saved light theme
- **WHEN** the user has `localStorage.theme = "light"` and loads any page
- **THEN** the initialization script SHALL set `data-theme="light"` on `<html>` before the browser renders, preventing a flash of dark-then-light

#### Scenario: Page loads with no saved theme
- **WHEN** the user has no `localStorage.theme` value
- **THEN** the page SHALL render in dark mode (default)

### Requirement: Reduced motion disables animations
The system SHALL respect the `prefers-reduced-motion` media query to disable all theme-related animations.

#### Scenario: User prefers reduced motion
- **WHEN** the user's OS setting has `prefers-reduced-motion: reduce`
- **THEN** the system SHALL disable all CSS transitions and animations related to theme switching
