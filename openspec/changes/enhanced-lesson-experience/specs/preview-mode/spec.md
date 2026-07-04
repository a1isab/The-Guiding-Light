## ADDED Requirements

### Requirement: Teacher can preview the student lesson page
The lesson editor SHALL have a preview toggle that renders the full student page from the current editor state.

#### Scenario: Toggle preview mode
- **WHEN** teacher clicks the "?? Preview" button in the editor
- **THEN** the editor SHALL be replaced by the student lesson page layout rendered with current content, video URL, files, and quiz
- **AND** a prominent banner SHALL display: "?? Preview Mode — Students will see this page"

#### Scenario: Preview reflects unsaved changes
- **WHEN** teacher has unsaved changes in the editor and toggles preview
- **THEN** the preview SHALL render using the current editor state, not the saved lesson data

#### Scenario: Exit preview mode
- **WHEN** teacher clicks "Back to Edit" in the preview banner
- **THEN** the editor SHALL be restored with all content intact

### Requirement: Preview renders student layout
The preview SHALL match the student-facing lesson page layout.

#### Scenario: Preview shows all lesson sections
- **WHEN** teacher previews a lesson
- **THEN** the preview SHALL render: title, video (if URL set), rendered markdown content, downloadable files (if any), and quiz section in correct order
