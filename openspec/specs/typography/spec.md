# typography Specification

## Purpose
Defines the "Nur" design system typography: a four-font system (Crimson Pro / Inter / IBM Plex Mono / Noto Sans Arabic) and a formal type scale based on a 1.25 Major Third ratio, exposed as CSS variables and Tailwind-mapped utilities. Synced from frontend-design-overhaul (07-31).

## Requirements
### Requirement: Four-font typography system
The system SHALL use four font roles: Display (Crimson Pro), Body (Inter), Utility (IBM Plex Mono), and Arabic (Noto Sans Arabic).

#### Scenario: Display font is Crimson Pro
- **WHEN** hero headlines or section titles are rendered
- **THEN** the system SHALL use Crimson Pro loaded from Google Fonts via `next/font/google`

#### Scenario: Body font is Inter
- **WHEN** body text or UI elements are rendered
- **THEN** the system SHALL use Inter loaded from Google Fonts (existing)

#### Scenario: Utility font is IBM Plex Mono
- **WHEN** labels, metadata, or code are rendered
- **THEN** the system SHALL use IBM Plex Mono loaded from Google Fonts

#### Scenario: Arabic font is Noto Sans Arabic
- **WHEN** Arabic or Urdu content is rendered
- **THEN** the system SHALL use Noto Sans Arabic loaded from Google Fonts, replacing the previous Amiri font

### Requirement: Type scale follows a 1.25 Major Third ratio
The system SHALL implement a type scale as CSS variables sized on a 1.25 Major Third ratio, from caption to hero.

#### Scenario: Type scale tokens are defined
- **WHEN** text is rendered at a named scale level
- **THEN** the system SHALL provide `--text-caption: 0.75rem`, `--text-body: 0.875rem`, `--text-lead: 1rem`, `--text-h4: 1.25rem`, `--text-h3: 1.5rem`, `--text-h2: 2rem`, `--text-h1: 2.5rem`, `--text-hero: 3.5rem`

#### Scenario: Display-level text uses Crimson Pro
- **WHEN** text at `--text-h4` and above is rendered
- **THEN** the system SHALL apply the display font (Crimson Pro) alongside the scale size

#### Scenario: Caption and body text use Inter
- **WHEN** text at `--text-caption`, `--text-body`, or `--text-lead` is rendered
- **THEN** the system SHALL use the body font (Inter) at the scale size

### Requirement: Fonts loaded via next/font in layout
The system SHALL load all fonts via `next/font/google` in `src/app/[locale]/layout.tsx` and expose them as CSS variables.

#### Scenario: CSS variables are available
- **WHEN** the layout renders
- **THEN** the system SHALL define `--font-display`, `--font-body`, `--font-utility`, and `--font-arabic` CSS variables

#### Scenario: Tailwind maps font variables
- **WHEN** a component uses `font-display`, `font-body`, `font-utility`, or `font-arabic` Tailwind classes
- **THEN** Tailwind SHALL resolve them to the corresponding font family

### Requirement: Amiri font is removed
The system SHALL remove the Amiri font and replace it with Noto Sans Arabic for all Arabic/Urdu content.

#### Scenario: Amiri font is no longer loaded
- **WHEN** the application loads
- **THEN** the Amiri font SHALL NOT be included in any font loading configuration

