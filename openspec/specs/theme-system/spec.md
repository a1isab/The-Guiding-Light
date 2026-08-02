# theme-system Specification

## Purpose
Defines the "Nur" design system theme: dark-default color tokens with a warm gold accent, light-mode inverse, an 8px spacing grid, a warm glow signature, global focus rings, and a flash-free theme initialization script. Synced from frontend-design-overhaul (07-31).

## Requirements
### Requirement: CSS custom properties define all color tokens
The system SHALL define all color tokens as CSS custom properties in `:root` (dark mode) and `[data-theme="light"]` (light mode), including background, text, accent, border, semantic, and glow tokens.

#### Scenario: Dark mode tokens are defined
- **WHEN** the page loads without a `data-theme` attribute (or with `data-theme="dark"`)
- **THEN** the system SHALL apply dark mode tokens: `--bg-deep: #080B10`, `--bg-primary: #080B10`, `--bg-surface: #111827`, `--bg-elevated: #1E293B`, `--bg-subtle: #273548`, `--text-primary: #F0ECE4`, `--text-secondary: #94A3B8`, `--text-muted: #64748B`, `--accent: #D4A54A`, `--accent-dim: #8B6914`, `--accent-hover: #E5B85A`, `--border: #1E293B`, `--border-subtle: #111827`, `--success: #2D7D6A`, `--error: #DC4444`, `--glow: rgba(212,165,74,0.08)`, `--glow-strong: rgba(212,165,74,0.15)`

#### Scenario: Light mode tokens are defined
- **WHEN** the page has `data-theme="light"` on the `<html>` element
- **THEN** the system SHALL apply light mode tokens: `--bg-deep: #F5F1EB`, `--bg-primary: #F5F1EB`, `--bg-surface: #FFFFFF`, `--bg-elevated: #FAF8F5`, `--bg-subtle: #F0ECE4`, `--text-primary: #1A1A1E`, `--text-secondary: #6B7280`, `--text-muted: #9CA3AF`, `--accent: #B8860B`, `--accent-dim: #D4A54A`, `--accent-hover: #9A7209`, `--border: #E5E1DB`, `--border-subtle: #F0ECE4`, `--success: #1A7A5C`, `--error: #DC2626`, `--glow: rgba(184,134,11,0.06)`, `--glow-strong: rgba(184,134,11,0.12)`

### Requirement: Spacing grid is 8px increments
The system SHALL define a spacing grid in 8px increments as CSS custom properties.

#### Scenario: Spacing tokens are available
- **WHEN** a component needs spacing
- **THEN** the system SHALL provide `--space-1: 0.5rem`, `--space-2: 1rem`, `--space-3: 1.5rem`, `--space-4: 2rem`, `--space-5: 2.5rem`, `--space-6: 3rem`, `--space-8: 4rem`, `--space-10: 5rem`, `--space-12: 6rem`

### Requirement: Warm glow is the signature effect
The system SHALL define glow tokens and apply a warm gold box-shadow glow to interactive elements (cards, buttons, focus rings) and ambient radial glow via the `lamplight-glow` utility.

#### Scenario: Cards emit glow on hover
- **WHEN** a user hovers a `hoverable` Card or an element with `card-glow`
- **THEN** the element SHALL transition `box-shadow` to `0 0 40px var(--glow-strong)`

#### Scenario: Ambient lamplight glow
- **WHEN** a hero or section uses `lamplight-glow`
- **THEN** the system SHALL render a `::before` radial-gradient ellipse using `var(--glow)`

### Requirement: Global focus rings use accent glow
The system SHALL style `:focus-visible` on all elements with a gold outline and glow instead of the browser default.

#### Scenario: Keyboard focus is visible
- **WHEN** a user tabs to any focusable element
- **THEN** the system SHALL apply `outline: 2px solid var(--accent)` with `outline-offset: 2px` and `box-shadow: 0 0 12px var(--glow-strong)`

### Requirement: Tailwind v4 maps CSS variables to utilities
The system SHALL use a Tailwind v4 `@theme inline` block to map CSS custom properties to Tailwind utility classes.

#### Scenario: Tailwind utilities resolve to CSS variables
- **WHEN** a component uses a Tailwind class like `bg-[var(--bg-primary)]` or theme-mapped utility
- **THEN** Tailwind SHALL resolve it to the corresponding CSS custom property value

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
- **THEN** the system SHALL disable all CSS transitions, animations, and glow effects (via `box-shadow: none !important` and near-zero durations) related to theme switching and UI motion

