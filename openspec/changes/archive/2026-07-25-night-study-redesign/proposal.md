# Proposal: Night Study Redesign

## What

Complete visual redesign of The Guiding Light — a dark-first "Night Study" theme with light mode toggle, new typography system, and lamplight glow signature element. Full platform rewrite touching 45 files across landing page, auth, dashboards, and shared components.

## Why

The current UI uses hardcoded dark zinc/emerald colors with no light mode, generic styling, and Amiri (traditional Arabic serif). The platform is being presented to a school and needs a distinctive, professional visual identity that avoids templated Islamic app aesthetics.

## Scope

- New CSS variable theme system (dark default + light inverse)
- Typography overhaul: Crimson Pro (display), Inter (body), IBM Plex Mono (utility), Noto Sans Arabic (replaces Amiri)
- Landing page complete rewrite with lamplight glow hero
- New settings page with dark/light theme toggle
- All auth pages retheme
- All student/teacher/admin dashboard pages retheme
- All shared components retheme

## Not in Scope

- No new features or API changes
- No database migrations
- No test changes (visual-only)
