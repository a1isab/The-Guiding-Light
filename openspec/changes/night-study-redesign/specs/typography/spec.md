# Spec: Typography

## Overview
Typography system with four font roles: display, body, utility, and Arabic.

## Fonts

| Role | Font | Source | Usage |
|------|------|--------|-------|
| Display | Crimson Pro | Google Fonts | Hero headlines, section titles |
| Body | Inter | Google Fonts (existing) | All body text, UI elements |
| Utility | IBM Plex Mono | Google Fonts | Labels, metadata, code |
| Arabic | Noto Sans Arabic | Google Fonts (replaces Amiri) | All Arabic/Urdu content |

## Type Scale

| Level | Size | Weight | Usage |
|-------|------|--------|-------|
| Display LG | 72px | 700 | Hero headline |
| Display MD | 56px | 600 | Section titles |
| Display SM | 48px | 600 | Sub-section titles |
| Heading LG | 40px | 600 | Page headings |
| Heading MD | 36px | 600 | Card titles |
| Heading SM | 32px | 600 | Sub-headings |
| Body LG | 18px | 400 | Long-form text |
| Body MD | 16px | 400 | Default body |
| Caption LG | 14px | 400 | Labels, metadata |
| Caption SM | 12px | 400 | Fine print, code |

## Implementation
- Load via `next/font/google` in `src/app/[locale]/layout.tsx`
- CSS variables: `--font-display`, `--font-body`, `--font-utility`, `--font-arabic`
- Map to Tailwind: `font-display`, `font-body`, `font-utility`, `font-arabic`
- Remove Amiri font (replaced by Noto Sans Arabic)
