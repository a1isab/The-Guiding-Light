# Design: Frontend Design Overhaul — "Nur"

## Concept

**Light as knowledge.** The Guiding Light isn't just a name — it's the organizing visual metaphor. The interface is like an illuminated manuscript: dark warm backgrounds, gold accents used sparingly, generous margins, and a subtle warm glow that makes interactive elements feel like they're catching candlelight.

The design refines the existing Night Study direction rather than replacing it. The changes are deliberate shifts away from generic dark-mode defaults toward something that feels specific to an Islamic learning platform.

## Palette Changes from Current

### Changed tokens

| Current | New | Why |
|---------|-----|-----|
| `--bg-primary: #0A0D12` | `--bg-deep: #080B10` | Warmer, less cold-black |
| `--accent: #D4915E` | `--accent: #D4A54A` | Copper → gold. More manuscript, less terracotta |
| `--success: #3DD68C` | `--success: #2D7D6A` | Generic green → teal. More distinctive |
| — | `--glow: rgba(212,165,74,0.08)` | New — ambient glow token |
| — | `--glow-strong: rgba(212,165,74,0.15)` | New — strong glow for hover |

### Unchanged tokens (renamed only)

`--bg-surface`, `--bg-elevated`, `--bg-subtle`, `--text-primary`, `--text-secondary`, `--text-muted`, `--accent-dim`, `--accent-hover`, `--error`, `--border`, `--border-subtle` keep their current values, just with `--bg-primary` → `--bg-deep`.

## Type Scale

Introduced as CSS variables for the first time (currently sizes are ad-hoc):

```
--text-caption:  0.75rem  (12px)
--text-body:     0.875rem (14px)
--text-lead:     1rem     (16px)
--text-h4:       1.25rem  (20px)
--text-h3:       1.5rem   (24px)
--text-h2:       2rem     (32px)
--text-h1:       2.5rem   (40px)
--text-hero:     3.5rem   (56px)
```

Ratio: 1.25 (Major Third). Font families unchanged (Crimson Pro display, Inter body, IBM Plex Mono utility, Noto Sans Arabic).

## Spacing Grid

8px increments as CSS variables:

```
--space-1:  0.5rem  (8px)
--space-2:  1rem   (16px)
--space-3:  1.5rem (24px)
--space-4:  2rem   (32px)
--space-5:  2.5rem (40px)
--space-6:  3rem   (48px)
--space-8:  4rem   (64px)
--space-10: 5rem   (80px)
--space-12: 6rem   (96px)
```

Eliminates `p-5` (20px) which breaks the 4px grid.

## Signature Element: Warm Glow

Interactive elements (cards, buttons, links) emit a subtle warm gold glow on hover — `box-shadow: 0 0 20px var(--glow-strong)`. This replaces the current flat interactionless state with a tactile sense of "catching light." Applied to:

- Hero section heading (ambient glow behind text)
- Card hover states
- Button default state (subtle, always-on glow)
- Focus-visible rings (gold glow instead of browser default blue)

## Interactive States

Every interactive element now has 5 defined states:

| State | Effect |
|---|---|
| default | Base styling |
| hover | Warm glow + translateY(-1px) lift |
| focus-visible | Gold ring + glow (via `:focus-visible`) |
| active/pressed | scale(0.98) |
| disabled | opacity 0.5, pointer-events: none |

## Layout

- Page max-width remains 5xl (dashboard), 4xl (lesson), 3xl (prose)
- Side padding remains `px-4` mobile, `px-6` tablet, `px-8` desktop (already on 8px grid)
- Section dividers use `border-top` with `--border` color and `--space-6` vertical rhythm

## Motion

- All state transitions: 200ms ease-out
- No new animation library (CSS-only, keeps the bundle small)
- `prefers-reduced-motion` already handled globally in CSS — enhanced to also disable glow effects

## Primitive Components API

### Button
```
<Button variant="primary|secondary|ghost|danger" size="sm|md|lg" loading disabled href>
```
- `primary`: filled gold bg, white text
- `secondary`: transparent, gold border
- `ghost`: transparent, text only
- `danger`: filled red bg
- `loading`: shows spinner, disables interaction
- `href`: renders as `<a>` instead of `<button>`

### Card
```
<Card hoverable padding="sm|md|lg" testId>
```
- `hoverable`: adds glow on hover + border transition
- `padding`: controls interior padding (sm=space-3, md=space-4, lg=space-5)

### Input
```
<Input label error helperText placeholder type>
```
- Renders label + input + error message in consistent structure
- Error state: red border, error message below
- Includes `aria-describedby` when helperText or error is present

### EmptyState
```
<EmptyState icon title description action>
```
- Centered layout with icon, title, description, and optional CTA button
- Replaces 8+ ad-hoc implementations

### Badge
```
<Badge variant="success|warning|error|info">
```
- Consistent pill styling with semantic colors
