## Context

The platform uses `@supabase/ssr` v0.12 for auth session management. Both
the browser client (`createBrowserClient`) and server client
(`createServerClient`) use PKCE flow with cookie-based session persistence.

The server client defaults to `cookieEncoding: "base64url"`, storing cookies
as `base64-<base64url(JSON.stringify(session))>`. The browser client (called
without `cookieEncoding`) stored raw JSON — the session object serialized
directly into the cookie.

These formats are both readable by the server's `decodeChunkedCookieValue()`
function, which falls through to return the raw value when no `base64-`
prefix is present. **However**, cookies set by older versions of
`@supabase/ssr` (pre-v0.10) used plain base64 encoding without any prefix.
This format is NOT recognized by the current decoder — `getItem()` returns
a base64 string that the auth client cannot parse as JSON, causing
`getUser()` to return null → 403.

## Root Cause

```
Old `@supabase/ssr` cookie format (pre-v0.10):
  sb-<ref>-auth-token = base64(json)          ← NOT readable by v0.12 decoder

Current formats readable by v0.12:
  sb-<ref>-auth-token = <raw JSON>            ← readable (no base64- prefix)
  sb-<ref>-auth-token = base64-<base64url()>  ← readable (full format)
```

Stale cookies from before the `@supabase/ssr` upgrade remain in the old
base64 format. The server client's `decodeChunkedCookieValue()` cannot
parse them, and `getUser()` returns null → `requireTeacher()` → 403.

## Solution

### 1. Consistent cookie encoding

Add `cookieEncoding: "base64url"` to `createBrowserClient()` in
`src/lib/supabase-client.ts`. This ensures both browser and server clients
use the identical encoding format from the moment the session is created:

```
sb-<ref>-auth-token = base64-<base64url(JSON.stringify(session))>
```

The server already defaults to this encoding. Making the browser explicit
prevents future format drift.

### 2. Clear stale cookies

Users who previously logged in with an older `@supabase/ssr` version need
to clear their browser cookies and log in again, or wait for the existing
session to expire (token refresh will re-write cookies in the new format).

## Verification

1. Log in as the affected teacher (after clearing cookies)
2. Navigate to New Class, enter name, click Save
3. Confirm 200 response and redirect to class page
4. Confirm cookie has the `base64-` prefix format
