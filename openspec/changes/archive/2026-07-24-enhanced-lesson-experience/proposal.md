## Why

Lesson creation is currently a bare plain-text form with no formatting, no preview, and no structural guidance. Teachers have no way to write rich, beautiful Islamic lesson content or see what students will experience. The quiz AI generation uses the raw lesson content (which will soon be markdown), so a separate plain-text source field is needed. Student flow is flat — everything visible at once — when it should be a guided journey through content, then quiz.

## What Changes

- Replace the lesson content textarea with a **markdown editor + live preview** (split pane, toolbar for B/I/H1/H2/UL/OL)
- Add a **quiz_source_content** field to lessons — visible in the editor, required for AI quiz generation, labeled "Required for AI Generation"
- Add "Copy from content" button that copies the markdown content into the source field (preserving markdown syntax)
- Render lesson content as **markdown on the student page** (using eact-markdown)
- Gate the quiz section behind **content_viewed_at** — student must mark content as viewed before quiz unlocks
- Add **content_viewed_at** column to the progress table
- Create a **template system** with a 	eacher_lesson_templates table (per-teacher + official/admin templates, loaded as copies)
- Add **template picker** on new lesson and **Save as Template** button in the editor
- Add **Preview as Student** toggle that renders the full student page inline from current editor state
- Add **admin template management** page (/admin/templates) for creating official templates shared with all teachers

## Capabilities

### New Capabilities

- lesson-markdown-editor: Markdown content editor with live preview, formatting toolbar, and Islamic content helpers
- quiz-source-field: Separate plain-text source field for AI quiz generation, with copy-from-content button
- content-viewed-gating: Student progress gating — quiz unlocks only after content is marked as viewed
- lesson-templates: Template system — per-teacher saved templates and admin-created official templates shared with all teachers
- preview-mode: Live preview toggle showing the full student lesson page from the editor
- markdown-rendering: Render lesson content as markdown on the student-facing lesson page
- dmin-template-management: Admin CRUD page for managing official lesson templates

## Impact

- **Data model**: New column quiz_source_content on 	eacher_lessons; new column content_viewed_at on progress; new table 	eacher_lesson_templates
- **UI components**: Lesson editor replaced (markdown editor replaces textarea); new template picker modal; new preview overlay; admin template page
- **Dependencies**: eact-markdown + emark-gfm added; @uiw/react-md-editor (or similar markdown editor) added
- **Student flow**: Quiz section behavior changes — hidden until content viewed
