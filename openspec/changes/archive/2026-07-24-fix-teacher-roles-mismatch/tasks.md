## 1. Fix Double Token Refresh

- [x] 1.1 Remove `getSession()` and all auth cookie handling from `src/middleware.ts`
- [x] 1.2 Keep i18n routing only — middleware should not touch Supabase auth

## 2. Verify

- [x] 2.1 Run `npm run build` — zero TypeScript/ESLint errors
- [ ] 2.2 Deploy to `the-guiding-light.vercel.app` and test refresh logout is fixed
- [ ] 2.3 Confirm creating a class returns 200 and class page loads
- [ ] 2.4 Confirm no regressions on dashboard, teacher, and admin pages
