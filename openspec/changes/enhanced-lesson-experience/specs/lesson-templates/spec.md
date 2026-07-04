## ADDED Requirements

### Requirement: Teacher can save lesson content as a template
Teachers SHALL be able to save the current lesson content as a reusable template.

#### Scenario: Save current content as template
- **WHEN** teacher clicks the "Save as Template" button in the lesson editor
- **THEN** a dialog SHALL prompt for a template name and optional description
- **AND** on save, a new row SHALL be inserted into 	eacher_lesson_templates with the teacher's ID and current content

### Requirement: Teacher can load a template into a lesson
Templates SHALL be available when creating a new lesson.

#### Scenario: Load template on new lesson
- **WHEN** teacher creates a new lesson
- **THEN** a template picker SHALL show available templates (teacher's own + official templates)
- **AND** selecting a template SHALL pre-fill the content editor with the template's markdown

#### Scenario: Template loads as a copy
- **WHEN** teacher selects a template and begins editing
- **THEN** the loaded content SHALL be a copy — editing does NOT modify the saved template

### Requirement: Templates are fetched by teacher
The system SHALL show the correct templates to each teacher.

#### Scenario: Teacher sees their own templates
- **WHEN** teacher opens the template picker
- **THEN** all templates where 	eacher_id = currentUser.id SHALL be listed

#### Scenario: Teacher sees official templates
- **WHEN** teacher opens the template picker
- **THEN** all templates where is_official = true SHALL also be listed
- **AND** official templates SHALL be marked distinctly in the picker

### Requirement: Templates persist in database
The 	eacher_lesson_templates table SHALL store templates with proper metadata.

#### Scenario: Template schema
- **WHEN** a template is saved
- **THEN** it SHALL store: id, teacher_id (nullable), is_official (boolean, default false), name, description, content (markdown), created_at, updated_at
