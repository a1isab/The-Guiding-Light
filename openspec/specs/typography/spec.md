# typography Specification

## Purpose
TBD - created by archiving change night-study-redesign. Update Purpose after archive.
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

### Requirement: Type scale defines sizing levels
The system SHALL implement a type scale with defined sizes, weights, and usage contexts.

#### Scenario: Display-level typography
- **WHEN** display-level text is rendered
- **THEN** the system SHALL support Display LG (72px/700), Display MD (56px/600), and Display SM (48px/600)

#### Scenario: Heading-level typography
- **WHEN** heading-level text is rendered
- **THEN** the system SHALL support Heading LG (40px/600), Heading MD (36px/600), and Heading SM (32px/600)

#### Scenario: Body-level typography
- **WHEN** body-level text is rendered
- **THEN** the system SHALL support Body LG (18px/400) and Body MD (16px/400)

#### Scenario: Caption-level typography
- **WHEN** caption-level text is rendered
- **THEN** the system SHALL support Caption LG (14px/400) and Caption SM (12px/400)

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

