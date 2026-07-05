## Overview

Replace the cross-origin Supabase REST API calls in `createQuizQuestions` with a same-origin call to the existing `/api/teacher/quiz/save` POST handler.

## Current Behavior (Broken)

The helper currently:
1. Parses `document.cookie` to find the `sb-*-auth-token` cookie
2. Base64-decodes it and extracts `access_token`
3. Uses that token to call `supabase.co/rest/v1/teacher_quiz_questions` with `Authorization: Bearer <token>`
4. First `DELETE`s existing questions, then `POST`s new ones individually

This fails intermittently because:
- The extracted JWT may expire
- Supabase RLS may reject if the JWT subject doesn't match the ownership chain
- Cross-origin CORS preflight adds latency

## New Behavior (Fixed)

The helper will:

1. Call `POST /api/teacher/quiz/save` via same-origin `fetch` inside `page.evaluate`
2. Browser cookies are sent automatically (same-origin)
3. The route's `requireTeacher()` and `createApiSupabaseClient()` handle auth server-side
4. The route deletes existing questions and inserts new ones in a single request

```
teacherPage.evaluate (single call)
  → POST /api/teacher/quiz/save
  → body: { lessonId, questions: [...] }
  → Content-Type: application/json
  → BROWSER SENDS AUTH COOKIES AUTOMATICALLY (same-origin)
```

## API Payload Mapping

`QuizQuestion` interface:
- `question: string` → `question: string`
- `options: string[]` → `options: string[]`
- `correct_index: number` → `correctIndex: number`

The route expects `correctIndex` (camelCase), so the helper must map the property.

## Error Handling

- If save route returns non-2xx, throw with status code + error body text
- Error message format: `"Failed to create quiz questions (${status}): ${body}"`

## Files Changed

- `tests/e2e/helpers/quiz-setup.ts` — rewritten helper
- `tests/e2e/quiz-submission.spec.ts` — no changes
