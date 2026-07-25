# Spec: Landing Page

## Overview
Complete rewrite of the landing page with Night Study theme, lamplight glow hero, and responsive layout.

## Sections

### 1. Hero
- Crimson Pro display headline: "Where Knowledge Meets Devotion"
- Subtitle: "Learn Quran, Hadith, Fiqh and more with expert teachers worldwide"
- CTA button: "Start Learning" (amber accent, links to onboarding or dashboard)
- Lamplight glow: subtle radial gradient (amber → transparent) behind content
- Page-load fade-in animation

### 2. Features (3-up)
- Expert Teachers (BookOpen icon)
- Structured Curriculum ( Layers icon)
- Track Your Progress (TrendingUp icon)
- Cards use `bg-surface` with `border` styling
- Hover: warm glow effect from below

### 3. Stats
- 1,200+ Students · 50+ Courses · 95% Completion
- Amber accent numbers, muted labels

### 4. Testimonial
- Quote with attribution
- Centered, muted styling

### 5. Final CTA
- "Begin Your Journey" or similar
- Amber button
- Subtle glow shadow

### 6. Footer
- Logo, links, copyright
- Theme tokens

## Responsive
- Mobile: single column, stacked sections
- Tablet: 2-column feature grid
- Desktop: 3-column features, centered hero

## Animation
- Fade-in on page load (opacity 0→1, translateY 20px→0)
- Staggered children fade-in
- `prefers-reduced-motion`: disable all animations
