## ADDED Requirements

### Requirement: Student lesson page renders content as markdown
The student-facing lesson page SHALL render content as formatted markdown instead of raw text.

#### Scenario: Student sees formatted lesson content
- **WHEN** student navigates to a lesson page
- **THEN** the content SHALL be rendered as markdown using eact-markdown with GFM support
- **AND** headings, lists, bold, italic, and links SHALL display properly formatted

#### Scenario: Markdown safety
- **WHEN** content contains raw HTML
- **THEN** the renderer SHALL NOT execute embedded HTML or scripts (XSS prevention — react-markdown disables HTML by default)

#### Scenario: Empty content renders gracefully
- **WHEN** lesson content is empty or null
- **THEN** the content section SHALL not render (no empty container)
