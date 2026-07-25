# Spec: Component Retheme

## Overview
Update all 39+ component files to use CSS variable tokens instead of hardcoded hex values.

## Pattern
Replace hardcoded colors:
- `bg-[#0a0a0a]` → `bg-[var(--bg-primary)]`
- `bg-[#111111]` → `bg-[var(--bg-surface)]`
- `text-zinc-100` → `text-[var(--text-primary)]`
- `border-zinc-800` → `border-[var(--border)]`
- `text-emerald-500` → `text-[var(--accent)]`
- etc.

## Components to Update

### Shared (14 files)
- navbar.tsx — theme tokens, add settings link
- sidebar-nav.tsx — theme tokens, amber active state
- footer.tsx — theme tokens
- logo.tsx — theme tokens
- badge-grid.tsx — theme tokens
- course-list.tsx — theme tokens
- course-curriculum.tsx — theme tokens
- student-curriculum.tsx — theme tokens
- quiz.tsx — theme tokens
- join-class-card.tsx — theme tokens
- announcement-banner.tsx — theme tokens
- breadcrumbs.tsx — theme tokens
- certificate-card.tsx — theme tokens
- bookmark-button.tsx — theme tokens

### Teacher (8 files)
- class-form.tsx, class-list.tsx, file-upload.tsx, markdown-content.tsx
- markdown-editor.tsx, quiz-editor.tsx, quiz-viewer.tsx, template-picker.tsx
- video-upload.tsx

### Auth (1 file)
- onboarding-wizard.tsx — theme tokens

## Hover Glow Effect
Cards with `hover:` state get subtle warm glow:
```css
.card:hover {
  box-shadow: 0 0 30px rgba(212, 145, 94, 0.08);
}
```
