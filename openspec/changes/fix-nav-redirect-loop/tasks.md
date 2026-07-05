## 1. Seed Script: Update Auth Password for Existing Users

- [x] 1.1 In \scripts/seed-users.ts\, after fetching existing Auth user, call \supabase.auth.admin.updateUserById(existing.id, { password: u.password })\ alongside the profile update
- [x] 1.2 Run \
pm run seed:users\ and verify console output shows password update confirmation for existing users

## 2. Middleware: Propagate Verified User Info via Headers

- [x] 2.1 In \src/proxy.ts\, after successful \getUser()\ on protected routes, create a new \Request\ object with \x-user-id\ and \x-user-roles\ headers set, and pass it to \NextResponse.next({ request: newRequest })\
- [x] 2.2 Verified by subsequent Server Component changes (tasks 3.x)

## 3. Server Components: Remove Duplicate getUser() Calls

- [x] 3.1 Admin layout: replaced \getUser()\ + redirect with \headers()\ read
- [x] 3.2 Dashboard page: replaced \getUser()\ + role redirect with \headers()\ read, removed \createServerSupabaseClient\ import
- [x] 3.3 Student class page: replaced \getUser()\ + redirect with \headers()\ read, removed \createServerSupabaseClient\ import
- [x] 3.4 Student course page: replaced \getUser()\ + redirect with \headers()\ read, removed \createServerSupabaseClient\ import
- [x] 3.5 Student lesson page: replaced \getUser()\ + redirect with \headers()\ read, removed \createServerSupabaseClient\ import
- [x] 3.6 Verified: no remaining \getUser()\ in Server Components; only Client Components and optional course pages remain

## 4. Clean Up and Verify

- [x] 4.1 Build passes with 0 errors \
pm run build\ and fix any TypeScript errors
- [ ] 4.2 Login as \heyamer123@gmail.com\ (password: \Admin123!\), navigate to teacher + admin paths — verify no redirect to login
- [ ] 4.3 Login as \admin@theguidinglight.com\ (password: \Admin123!\), verify admin access
- [ ] 4.4 Login as \student@theguidinglight.com\ (password: \Student123!\), verify dashboard works, admin/teacher redirects to dashboard
