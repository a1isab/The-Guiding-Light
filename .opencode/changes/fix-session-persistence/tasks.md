# Tasks

- [x] Rename `src/proxy.ts` to `src/middleware.ts`, export `middleware` function
- [x] Remove silent cookie-drop catch in `createAuthServerClient`
- [x] Fix all teacher/admin/student API routes — wrap early returns with `applyCookies()`
- [x] Commit and push
- [x] Fix middleware cookie propagation — add `request.cookies.set()` in `setAll` callback so Server Components see refreshed tokens
