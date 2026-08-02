# Proposal: Frontend Design Overhaul — "Nur"

## What

Refine the existing Night Study visual language into a more distinctive, manuscript-inspired design system called "Nur" (light). The changes are: shift the accent from copper/terracotta (#D4915E) to warm gold (#D4A54A), formalize a type scale and spacing grid, add a warm glow signature effect, create shared UI primitives to eliminate 100+ duplicate inline style patterns, fix the theme flash on page load, and add missing interactive states (focus, active, disabled) to every element.

## Why

The current design sits close to the "generic dark mode + single accent" default. The platform is being actively tested and presented — it needs a visual identity that feels intentional and crafted, not templated. The existing 40+ components each redefine buttons, cards, and inputs from scratch with inline styles, making the codebase hard to maintain and inconsistent. The theme preference currently flashes on page load because localStorage is read only on the settings page JS. Interactive elements lack focus rings and active/disabled states.

## Scope

- globals.css: new token names, refined palette (copper → gold), type scale, spacing grid, glow tokens
- Theme flash fix: blocking script in layout.tsx
- 5 new UI primitives: Button, Card, Input, EmptyState, Badge
- Migrate ~12 high-visibility pages to use primitives
- Add focus rings, disabled states, active states globally
- All changes respect prefers-reduced-motion

## Not in Scope

- No new features or API changes
- No database migrations
- No test changes (visual regression only)
- No RTL/i18n content changes
- No new pages or routes
