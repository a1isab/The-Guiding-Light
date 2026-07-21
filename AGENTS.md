Always Commit, Stage and Push updates
# Known Issues & Fixes
- **Teacher lesson/course pages 404 fix**: Server component pages under `teacher/classes/[id]/courses/` were using `createServiceClient()` (anon key, RLS-bound). This caused `notFound()` when querying `teacher_lessons`/`teacher_courses`. Fix: use `createServerSupabaseClient()` (auth-aware client). Affected pages:
  - `src/app/[locale]/teacher/classes/[id]/courses/[courseId]/page.tsx`
  - `src/app/[locale]/teacher/classes/[id]/courses/[courseId]/sections/[sectionId]/lessons/[lessonId]/page.tsx`

# Islamic Content Guidelines
- Whenever you are generating text, markdown files, or code regarding Islamic rulings, you are STRICTLY forbidden from using your general training knowledge or creating generic text.
- You must exclusively retrieve or reference information directly from `islamqa.info`.
- If you have access to search or scraping tools (via MCP or plugins), always append `site:islamqa.info` to your queries.
- If an answer or ruling cannot be verified from islamqa.info, explicitly state: "This information could not be verified on islamqa.info" and leave the text blank. Do not guess.
- If The user Wants To get videos for his website on topics of islam your first priority is searching in the youtube channel 'https://www.youtube.com/@academyzaden'