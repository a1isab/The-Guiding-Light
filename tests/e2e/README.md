# E2E Browser Tests

Automated end-to-end tests using [agent-browser](https://opencode.ai) CLI.

## Prerequisites

- `agent-browser` installed globally: `npm i -g agent-browser && agent-browser install`
- Next.js dev server running: `npm run dev`
- Supabase project running (local or remote)
- Test users seeded (run `npm run seed:users`)

## Running

```bash
# Default: http://localhost:3000
npm run test:e2e

# Custom URL
BASE_URL=https://theguidinglight.app npm run test:e2e
```

## Test Credentials

| Role    | Email                          | Password    |
|---------|--------------------------------|-------------|
| Admin   | admin@theguidinglight.com      | Admin123!   |
| Teacher | teacher@theguidinglight.com    | Teacher123! |
| Student | student@theguidinglight.com    | Student123! |

## Test Structure

```
tests/e2e/
  config.sh           # Shared config: URLs, credentials, assertions
  helpers/
    login.sh          # login() function - authenticates as any role
  specs/
    01-login-all-roles.sh          # All 3 roles login + redirect
    02-teacher-create-class.sh     # Teacher creates a class
    03-teacher-create-lesson.sh    # Teacher edits a lesson
    04-teacher-file-upload.sh      # File upload to lesson
    05-teacher-preview-mode.sh     # Preview mode toggle
    06-teacher-save-template.sh    # Save lesson as template
    07-student-join-class.sh       # Student joins via invite code
    08-student-view-lesson.sh      # Student views lesson, marks content
    09-admin-template-crud.sh      # Admin CRUD on templates
    10-admin-role-guard.sh         # Role-based access control
    11-invite-code-regenerate.sh   # Teacher regenerates invite code
  screenshots/        # PNG captures from each test step
  run-all.sh          # Orchestrator - runs all specs sequentially
```

## Manual URL Placeholders

Tests 03, 04, 05, 06, 08, and 11 require real database IDs (class, course, section, lesson).
Edit these scripts to replace `TODO` placeholders with actual UUIDs from your database.

To find UUIDs:
- **Classes**: Log in as teacher → navigate to Classes → the URL contains the class ID
- **Courses**: Open a class detail page → course links contain course IDs
- **Lessons**: Open a course → section → lesson → the URL contains the lesson ID
