# Tasks: Frontend Design Overhaul

## Phase 1: Token Foundation
- [ ] 1a. Update `src/app/globals.css` — refined palette, type scale, spacing grid, glow tokens, prefers-reduced-motion enhancement
- [ ] 1b. Update `src/app/[locale]/layout.tsx` — blocking script to set data-theme from localStorage before first paint

## Phase 2: UI Primitives (src/components/ui/)
- [ ] 2a. Create `src/components/ui/button.tsx` — 4 variants, 3 sizes, 5 states, loading spinner, glow, href support
- [ ] 2b. Create `src/components/ui/card.tsx` — hoverable glow, consistent padding options, data-testid prop
- [ ] 2c. Create `src/components/ui/input.tsx` — label, error, helperText, focus ring, aria-describedby
- [ ] 2d. Create `src/components/ui/empty-state.tsx` — icon + title + description + optional CTA
- [ ] 2e. Create `src/components/ui/badge.tsx` — 4 color variants (success, warning, error, info)

## Phase 3: Migration — High-Visibility Pages
- [ ] 3a. Update `src/app/[locale]/dashboard/page.tsx` — stats cards → Card, buttons → Button, empty states
- [ ] 3b. Update `src/components/featured-browser.tsx` + `featured/join-button.tsx` — cards → Card, buttons → Button
- [ ] 3c. Update `src/app/[locale]/auth/login/page.tsx` + `signup/page.tsx` — inputs → Input, buttons → Button
- [ ] 3d. Update `src/app/[locale]/page.tsx` (landing) — hero glow, feature cards → Card
- [ ] 3e. Update `src/components/navbar.tsx` — focus-visible states, Button for CTA
- [ ] 3f. Update `src/app/[locale]/teacher/page.tsx` — dashboard cards → Card, buttons → Button
- [ ] 3g. Update `src/components/onboarding-wizard.tsx` — inputs → Input, buttons → Button

## Phase 4: Polish
- [ ] 4a. Add global `:focus-visible` ring to `globals.css` for raw `<a>` and `<button>` elements
- [ ] 4b. Enhance `prefers-reduced-motion` to disable glow effects
- [ ] 4c. Audit all state transitions (target: 200ms ease-out everywhere)

## Verification
- [ ] `npm run build` — no errors
- [ ] `npm run lint` — no new warnings
- [ ] Check: dark mode dashboard renders with new gold accent
- [ ] Check: light mode renders correctly
- [ ] Check: theme no longer flashes on page load
- [ ] Check: focus rings visible on keyboard nav
- [ ] Check: disabled buttons are visually distinct
- [ ] Check: prefers-reduced-motion disables glow + animations
