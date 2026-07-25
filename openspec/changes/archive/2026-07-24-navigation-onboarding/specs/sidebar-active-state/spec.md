## ADDED Requirements

### Requirement: Active page indicator in teacher and admin sidebars

A `<SidebarNav>` client component renders sidebar navigation links with visual highlighting for the current page.

#### Scenario: Active route is highlighted
- **WHEN** the user is on `/en/teacher/classes`
- **THEN** the "Classes" nav link renders with `bg-zinc-800 text-zinc-100` styling

#### Scenario: Inactive route has default styling
- **WHEN** the user is on `/en/teacher/classes` and the sidebar has a "Dashboard" link
- **THEN** the "Dashboard" link renders with `text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200` styling

#### Scenario: Nested routes activate parent link
- **WHEN** the user is on `/en/teacher/classes/{id}/courses/{courseId}`
- **THEN** the "Classes" nav link is highlighted (since it's the parent route)

#### Scenario: Component accepts nav items and sign-out slot
- **WHEN** the SidebarNav renders
- **THEN** it accepts `items: Array<{href, label, icon}>` and a `children` slot for the sign-out button

#### Scenario: Teacher sidebar has test identifiers
- **WHEN** the teacher sidebar renders
- **THEN** the nav wrapper has `data-testid="nav-teacher"` and each link has a role-specific testid

#### Scenario: Admin sidebar uses the same component
- **WHEN** the admin layout renders
- **THEN** it uses `<SidebarNav>` with admin-specific nav items
