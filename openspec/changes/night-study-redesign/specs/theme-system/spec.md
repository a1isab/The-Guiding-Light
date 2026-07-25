# Spec: Theme System

## Overview
CSS custom properties theme system with dark default and light inverse, toggled via `data-theme` attribute on `<html>`.

## Requirements
- All color tokens defined as CSS custom properties in `:root` (dark) and `[data-theme="light"]` (light)
- Tailwind v4 `@theme inline` block maps CSS variables to Tailwind utilities
- Theme toggle persists to localStorage
- Initialization script in root `<head>` reads localStorage before paint (prevents flash)
- `prefers-reduced-motion` disables all animations

## Tokens

### Dark Mode (`:root`)
```
--bg-primary: #0A0D12
--bg-surface: #13171F
--bg-elevated: #1C2130
--bg-subtle: #252A36
--text-primary: #F0ECE4
--text-secondary: #8B8D94
--text-muted: #52566A
--accent: #D4915E
--accent-dim: #8B5E3C
--border: #1C2130
--border-subtle: #13171F
--success: #3DD68C
--error: #E05252
```

### Light Mode (`[data-theme="light"]`)
```
--bg-primary: #F5F1EB
--bg-surface: #FFFFFF
--bg-elevated: #FAF8F5
--bg-subtle: #F0ECE4
--text-primary: #1A1D24
--text-secondary: #6B7280
--text-muted: #9CA3AF
--accent: #B87A4A
--accent-dim: #D4915E
--border: #E5E1DB
--border-subtle: #F0ECE4
--success: #16A34A
--error: #DC2626
```

## Implementation
- `src/app/globals.css`: CSS variables + `@theme inline` block
- `src/app/layout.tsx`: Initialization script in `<head>`
- Theme toggle reads/writes `localStorage.getItem('theme')` and sets `document.documentElement.dataset.theme`
