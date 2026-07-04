## ADDED Requirements

### Requirement: Lesson has a separate quiz source content field
The 	eacher_lessons table SHALL have a quiz_source_content TEXT column for AI quiz generation.

#### Scenario: Quiz source field is visible in editor
- **WHEN** teacher opens the lesson editor
- **THEN** a dedicated textarea labeled "Required for AI Generation" SHALL be displayed below the content editor
- **AND** the label SHALL include hint text explaining this field is needed for AI quiz generation

#### Scenario: Teacher can copy content to quiz source
- **WHEN** teacher clicks the "Copy from content" button next to the quiz source field
- **THEN** the raw markdown content from the content editor SHALL be copied into the quiz source field (preserving markdown syntax)

#### Scenario: Empty quiz source is handled
- **WHEN** teacher clicks "Generate Quiz" and quiz_source_content is empty
- **THEN** the system SHALL show an error message: "Quiz source content is required. Enter text or copy from lesson content."
