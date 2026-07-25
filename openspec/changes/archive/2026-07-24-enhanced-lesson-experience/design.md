## Context

Lesson creation currently uses a plain textarea for content. The student page renders content as whitespace-pre-wrapped plain text. Quiz AI generation reads from the same content field, which will break once content becomes markdown. The student flow shows everything at once — no progression from content consumption to quiz. Teachers have no templates, no preview, and no formatting.

## Goals / Non-Goals

**Goals:**
- Provide a markdown editor with live preview and formatting toolbar for lesson content
- Add a separate plain-text source field for AI quiz generation
- Gate the quiz behind content consumption (content_viewed_at)
- Implement per-teacher and official template system
- Add full student page preview from the editor
- Render lesson content as markdown on the student page
- Admin CRUD for official templates

**Non-Goals:**
- Real-time collaborative editing
- WYSIWYG rich-text editor (TipTap/ProseMirror) — markdown + toolbar is sufficient
- Islamic content helper buttons (Insert Verse, Insert Hadith) — deferred to future phase
- Image upload and inline embedding — deferred
- AI lesson outline generation — deferred

## Decisions

**Decision 1: Markdown editor library — @uiw/react-md-editor**
Rationale: Provides built-in live preview (split pane), toolbar for formatting, and lightweight bundle (~40KB). Teachers who don't know markdown can use the toolbar buttons. Those who do can type directly.
Alternatives considered: react-simplemde-editor (unmaintained), TipTap (too heavy, 150-300KB), raw textarea with custom parser (too much work).

**Decision 2: Markdown renderer — react-markdown + remark-gfm**
Rationale: Standard React markdown renderer, well-maintained, supports GFM tables/strikethrough/URLs. Already commonly used in Next.js projects. ~25KB.
The student page will use the same renderer as the editor preview — consistent output.

**Decision 3: Preview mode renders inline, not a new route**
Rationale: The preview toggle re-renders the editor section with the student page layout, using the same components (video, files, quiz renderer). No navigation, no data fetch. The editor state is the source of truth. A "?? Preview" banner makes the mode obvious.
Alternative considered: Separate preview route (/preview) — requires saving first, breaks live preview editing.

**Decision 4: content_viewed_at stored on progress table**
Rationale: No new table needed. The existing progress row already tracks completion per user per lesson. Adding one nullable column is the minimal migration.
Quiz gating: student page checks content_viewed_at IS NOT NULL before showing quiz section. If null, show "Mark as Viewed" button. After clicking, set content_viewed_at = now() and reveal quiz.

**Decision 5: Template system uses a single table with teacher_id nullable**
Rationale: 	eacher_id null means official template. 	eacher_id set means per-teacher. The query WHERE teacher_id =  OR is_official = true fetches both. Official templates are created by admins, visible to all teachers but read-only copies. Teachers can save their own.
Insert always creates a copy (teacher edits are independent). Save as Template creates a new row with current content.

**Decision 6: Quiz source copy preserves markdown as-is**
Rationale: The "Copy from content" button copies the raw markdown content into quiz_source_content. The AI model can handle markdown syntax; it just needs plain text rather than structured objects. The teacher can edit the source manually if needed.

## Risks / Trade-offs

- **[Risk] Markdown learning curve**: Teachers unfamiliar with markdown may find the toolbar insufficient.
  ? Mitigation: Toolbar covers common actions (Bold, Italic, Heading 1/2, Lists). We can add a brief help tooltip.
- **[Risk] @uiw/react-md-editor compatibility with Next.js 16**: Some markdown editors have SSR issues.
  ? Mitigation: Import dynamically with 
ext/dynamic and ssr: false.
- **[Risk] Quiz source out of sync with content**: Teacher updates content but forgets to update quiz source.
  ? Mitigation: The "Copy from content" button is always available next to the source field. The field has a hint label "Required for AI Generation" with a visual indicator if it's empty.
- **[Risk] Templates proliferation**: Many templates degrade UX.
  ? Mitigation: Simple alphabetical list for now. Search/filter can be added later if needed.
