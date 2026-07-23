## ADDED Requirements

### Requirement: Reusable breadcrumb navigation component

A `<Breadcrumbs>` client component renders a navigation trail showing the user's position in the page hierarchy.

#### Scenario: Breadcrumb renders with separators
- **WHEN** the component receives `items=[{label: "Dashboard", href: "/en/dashboard"}, {label: "My Class"}]`
- **THEN** it renders "Dashboard" as a link and "My Class" as plain text, separated by a ChevronRight icon

#### Scenario: Current page is not a link
- **WHEN** an item has no `href` property
- **THEN** it renders as plain text with `text-zinc-300 font-medium` styling (not a link)

#### Scenario: Parent pages are links
- **WHEN** an item has an `href` property
- **THEN** it renders as an `<a>` tag with `text-zinc-500 hover:text-emerald-400 transition-colors` styling

#### Scenario: Long labels are truncated
- **WHEN** a label exceeds 180px width
- **THEN** it truncates with ellipsis (`max-w-[180px] truncate`)

#### Scenario: Component has test identifier
- **WHEN** the breadcrumb renders
- **THEN** the wrapper element has `data-testid="breadcrumbs"`

### Requirement: Breadcrumbs appear on all nested pages

#### Scenario: Student dashboard nested pages show breadcrumbs
- **WHEN** a student navigates to `/en/dashboard/classes/{id}`
- **THEN** breadcrumbs show "Dashboard / Class Name"

#### Scenario: Student course page shows breadcrumbs
- **WHEN** a student navigates to `/en/dashboard/classes/{id}/courses/{courseId}`
- **THEN** breadcrumbs show "Dashboard / Class Name / Course Name"

#### Scenario: Student lesson page shows breadcrumbs
- **WHEN** a student navigates to `/en/dashboard/classes/{id}/courses/{courseId}/lessons/{lessonId}`
- **THEN** breadcrumbs show "Dashboard / Class Name / Course Name / Lesson Name"

#### Scenario: Teacher pages show breadcrumbs
- **WHEN** a teacher navigates to `/en/teacher/classes/{id}/courses/{courseId}`
- **THEN** breadcrumbs show "Classes / Class Name / Course Name"

#### Scenario: Root pages do not show breadcrumbs
- **WHEN** a user is on `/en/dashboard` or `/en/teacher`
- **THEN** no breadcrumb component is rendered

#### Scenario: Back link replaced by breadcrumbs
- **WHEN** a page previously had an `<ArrowLeft> Back` link
- **THEN** that link is removed and replaced by the breadcrumb component
