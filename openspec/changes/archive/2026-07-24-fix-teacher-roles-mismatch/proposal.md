## Why

Teachers on the platform get a **403 Forbidden** when saving a new class, even though they are
authenticated and the teacher layout renders correctly. The browser console shows:

```
/api/teacher/classes:1 Failed to load resource: the server responded with a status of 403 ()
```

Root cause: stale cookies from an older version of `@supabase/ssr`. The library was upgraded to
v0.12, which introduced `cookieEncoding: "base64url"` as the server-side default. Older
versions stored cookies as plain base64 (no prefix). The v0.12 decoder only recognizes:
- `base64-<base64url(JSON)>` (new format)
- `<raw JSON>` (no prefix, fallthrough)

It does NOT recognize plain base64 without a `base64-` prefix. Users with stale pre-upgrade
cookies hit `getUser() → null → requireTeacher() → 403`.

## What Changes

- **Add `cookieEncoding: "base64url"` to `createBrowserClient()`** — ensures the browser client
  writes cookies in the same format the server reads. This entrypoint is in `src/lib/supabase-client.ts`.
- **Stale cookies** — existing users must clear cookies and log in again, OR token refresh will
  upgrade cookies to the new format.

## Capabilities

### Fixed Capabilities
- `teacher-api-auth`: Teacher API routes now correctly identify teachers who have stale pre-upgrade
  cookies (token refresh or clearing cookies resolves the 403)

## Impact

- **Code change**: One option added to `createBrowserClient()` — `cookieEncoding: "base64url"`.
- **User action**: Existing users with 403 need to clear browser cookies and log in again.
- **No database changes**: The DB was already correct (roles were properly set).
