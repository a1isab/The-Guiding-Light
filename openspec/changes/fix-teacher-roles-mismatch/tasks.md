## 1. Cookie Encoding Fix

- [x] 1.1 Add `cookieEncoding: "base64url"` to `createBrowserClient()` in `src/lib/supabase-client.ts`
- [x] 1.2 Remove debug `console.log` statements from `src/app/api/teacher/classes/route.ts`

## 2. Verification

- [x] 2.1 E2E test confirms fresh login + create class returns 200 (cookies in correct `base64-` format)
- [ ] 2.2 Existing teachers with stale cookies must clear cookies and log in again (or wait for token refresh to upgrade cookies)
- [ ] 2.3 Create a quick note so deployment instructions include "clear cookies" step for existing users
- [ ] 2.4 Run `npm run build` — zero TypeScript/ESLint errors

## 3. Cleanup

- [ ] 3.1 Remove exploratory test scripts: `fix-teacher-roles.ts`, `debug-teacher-roles.ts`, `test-api-route*.ts`, `test-raw-json-cookie.ts`
- [ ] 3.2 Reset git history — the initial migration-018 direction was wrong; squash or discard those commits
