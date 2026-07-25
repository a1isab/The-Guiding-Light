# Design: Night Study Redesign

## Concept

"Night study" — a dark room, a single warm light source, focused learning. The Guiding Light isn't just a name, it's the visual metaphor. Content emerges from darkness, illuminated by a warm amber glow. The page feels like a late-night study session: focused, calm, but alive with purpose.

## Palette

### Dark Mode (Default)

| Token | Hex | Role |
|-------|-----|------|
| bg-primary | #0A0D12 | Page background (deep navy-black) |
| bg-surface | #13171F | Card/surface backgrounds |
| bg-elevated | #1C2130 | Elevated panels |
| bg-subtle | #252A36 | Subtle backgrounds |
| text-primary | #F0ECE4 | Main text (warm off-white) |
| text-secondary | #8B8D94 | Secondary text |
| text-muted | #52566A | Muted text |
| accent | #D4915E | Amber glow — THE guiding light |
| accent-dim | #8B5E3C | Dimmed amber |
| border | #1C2130 | Borders |
| border-subtle | #13171F | Subtle borders |
| success | #3DD68C | Confirmations |
| error | #E05252 | Destructive actions |

### Light Mode (Inverse)

| Token | Hex | Role |
|-------|-----|------|
| bg-primary | #F5F1EB | Warm parchment background |
| bg-surface | #FFFFFF | White cards |
| bg-elevated | #FAF8F5 | Off-white panels |
| bg-subtle | #F0ECE4 | Cream backgrounds |
| text-primary | #1A1D24 | Near-black text |
| text-secondary | #6B7280 | Gray text |
| text-muted | #9CA3AF | Light gray text |
| accent | #B87A4A | Darker amber (contrast on light) |
| accent-dim | #D4915E | Lighter amber |
| border | #E5E1DB | Warm gray borders |
| border-subtle | #F0ECE4 | Cream borders |
| success | #16A34A | Deeper green |
| error | #DC2626 | Deeper red |

## Typography

| Role | Font | Sizes | Weight |
|------|------|-------|--------|
| Display | Crimson Pro | 48/56/72px | 400-700 |
| Heading | Inter | 32/36/40px | 600 |
| Body | Inter | 16/18px | 400 |
| Utility | IBM Plex Mono | 12/14px | 400 |
| Arabic | Noto Sans Arabic | Mirrors Latin | 400-700 |

Crimson Pro is a scholarly serif with renaissance quality — evokes manuscripts without being decorative. Paired with Inter (clean, modern body) and IBM Plex Mono (utility/labels).

## Signature Element: Lamplight Glow

A subtle radial gradient (amber → transparent) behind hero content. Not animated, not flashy. Just *there*. Like a light source behind the words. On hover, cards get a faint warm glow from below — as if lit by a candle beneath them.

## Layout

```
┌─────────────────────────────────────────────────────────────┐
│  NAVBAR (logo + links + language + auth + settings)         │
├─────────────────────────────────────────────────────────────┤
│                    ·  ·  ·  ·  ·                            │
│                ·   ◌ amber glow  ·                          │
│                    ·  ·  ·  ·  ·                            │
│                                                             │
│              "Where Knowledge                               │
│               Meets Devotion"                               │
│                                                             │
│            [ Start Learning ]  ← amber CTA                  │
├─────────────────────────────────────────────────────────────┤
│   ┌──────────┐  ┌──────────┐  ┌──────────┐                 │
│   │ Expert   │  │Structured│  │  Track   │                  │
│   │Teachers  │  │Curriculum│  │ Progress │                  │
│   └──────────┘  └──────────┘  └──────────┘                 │
├─────────────────────────────────────────────────────────────┤
│         1,200+ Students  ·  50+ Courses                     │
├─────────────────────────────────────────────────────────────┤
│              Testimonial / Quote                             │
├─────────────────────────────────────────────────────────────┤
│  FOOTER                                                     │
└─────────────────────────────────────────────────────────────┘
```

## Motion

- Page load: content fades in from darkness (opacity + slight translate-y)
- Scroll: sections reveal with subtle fade
- Hover: cards get warm glow effect
- All animations respect `prefers-reduced-motion`
- No flashy animations — calm demands restraint
