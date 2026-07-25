# Spec: Settings Page

## Overview
New settings page with dark/light theme toggle and language selector.

## Route
`/[locale]/settings`

## Features

### Theme Toggle
- Visual toggle: dark (moon icon) / light (sun icon)
- Shows current theme with preview
- Instant preview on toggle
- Persists to localStorage

### Language Selector
- Dropdown with available locales: English, Arabic, Urdu, French
- Uses existing `next-intl` routing
- Persists via cookie (existing behavior)

## Layout
- Centered card layout
- Theme section with toggle + preview
- Language section with dropdown
- Back to dashboard link

## Implementation
- Client component (needs interactivity)
- Uses `useTheme` hook or inline localStorage logic
- Matches existing page styling patterns
