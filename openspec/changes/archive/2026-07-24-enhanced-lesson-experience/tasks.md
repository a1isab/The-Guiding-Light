## 1. Data Migrations

- [x] 1.1 Create migration: add `quiz_source_content` column to `teacher_lessons`
- [x] 1.2 Create migration: add `content_viewed_at` column to `progress`
- [x] 1.3 Create migration: create `teacher_lesson_templates` table with RLS policies

## 2. Dependencies

- [x] 2.1 Install `react-markdown` and `remark-gfm`
- [x] 2.2 Install `@uiw/react-md-editor`
- [x] 2.3 Set up dynamic import for markdown editor (SSR-safe)

## 3. Markdown Editor Component

- [x] 3.1 Create `MarkdownEditor` component with split-pane edit/preview layout
- [x] 3.2 Add formatting toolbar (Bold, Italic, H1, H2, UL, OL)
- [x] 3.3 Integrate `MarkdownEditor` into `LessonEditor` replacing the content textarea
- [x] 3.4 Wire editor value to lesson content state (save on PATCH)

## 4. Quiz Source Field

- [x] 4.1 Add `quiz_source_content` textarea to `LessonEditor` below content editor
- [x] 4.2 Add "Copy from content" button that copies markdown into source field
- [x] 4.3 Add hint label "Required for AI Generation"
- [x] 4.4 Include `quiz_source_content` in lesson PATCH API payload
- [x] 4.5 Validate `quiz_source_content` is non-empty before allowing AI quiz generate request

## 5. Markdown Rendering on Student Page

- [x] 5.1 Create `MarkdownContent` component using `react-markdown` + `remark-gfm`
- [x] 5.2 Replace plain text rendering in student lesson page with `MarkdownContent`
- [x] 5.3 Handle empty/null content gracefully (render nothing)

## 6. Content Viewed Gating

- [x] 6.1 Add "Mark as Viewed" button below content section on student lesson page
- [x] 6.2 Create API route to set `content_viewed_at` on progress (`POST /api/student/lessons/viewed`)
- [x] 6.3 Gate quiz section visibility behind `content_viewed_at != null`
- [x] 6.4 Handle returning students (quiz visible immediately if already viewed)

## 7. Template System — Database & API

- [x] 7.1 Create `GET /api/teacher/templates` route (returns teacher's + official templates)
- [x] 7.2 Create `POST /api/teacher/templates` route (save current content as template)
- [x] 7.3 Create `DELETE /api/teacher/templates/[id]` route (delete own template)

## 8. Template System — UI

- [x] 8.1 Create template picker modal/component for new lesson
- [x] 8.2 Add "Save as Template" button in lesson editor with name/description dialog
- [x] 8.3 Load template content into editor on selection (as copy)

## 9. Preview Mode

- [x] 9.1 Add "Preview" toggle button to lesson editor header
- [x] 9.2 Create preview overlay/panel rendering student layout with current editor state
- [x] 9.3 Add "Preview Mode" banner with "Back to Edit" button
- [x] 9.4 Ensure preview reflects unsaved changes (reads from React state, not DB)

## 10. Admin Template Management

- [x] 10.1 Create `/admin/templates` page with template list
- [x] 10.2 Add "New Template" form with name, description, markdown content editor
- [x] 10.3 Add edit and delete actions for official templates
- [x] 10.4 Create API routes: `GET/POST/PATCH/DELETE /api/admin/templates`
