# Role-Based Nav Cleanup

## What

Remove unnecessary navigation tabs based on user role. Teachers see only "Teacher", admins see everything, students see "Courses" and "Dashboard".

## Why

Teachers currently see irrelevant tabs: "Courses" (student catalog), "Dashboard" (student dashboard — redirects them), and "Admin" (redirects them). This is confusing and adds unnecessary clicks.

## Files Changed

- `src/components/navbar.tsx` — 3 nav blocks updated with independent role conditions
