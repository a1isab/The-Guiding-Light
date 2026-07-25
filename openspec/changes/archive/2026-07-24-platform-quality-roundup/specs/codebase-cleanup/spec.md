## ADDED Requirements

### Requirement: Remove duplicate supabase-server.ts
The file `src/lib/supabase-server.ts` SHALL be deleted as it is a duplicate of `src/lib/supabase.ts` with identical exports.

#### Scenario: All imports use supabase.ts
- **WHEN** all imports of `@/lib/supabase-server` are updated to `@/lib/supabase`
- **THEN** the duplicate file can be deleted without breaking the build

### Requirement: Remove dead gemini.ts code
The file `src/lib/gemini.ts` contains a `generateQuiz()` function that is not called by any API route. The file SHALL either be deleted (if truly unused) or have unused exports removed.

#### Scenario: gemini.ts is not imported anywhere
- **WHEN** searching for imports of `@/lib/gemini` or `gemini.ts`
- **THEN** no active imports are found, confirming the file is dead code

### Requirement: Build passes after cleanup
After removing duplicate and dead code, the project SHALL build without errors.

#### Scenario: Clean build succeeds
- **WHEN** `npm run build` is executed after cleanup
- **THEN** the build exits with code 0 and no errors
