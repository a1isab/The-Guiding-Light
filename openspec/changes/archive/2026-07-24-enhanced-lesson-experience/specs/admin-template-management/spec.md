## ADDED Requirements

### Requirement: Admin can manage official templates
Admins SHALL have a dedicated page to create, edit, and delete official lesson templates.

#### Scenario: Admin view all official templates
- **WHEN** admin navigates to /admin/templates
- **THEN** a list of all official templates SHALL be displayed with name, description, and last updated date

#### Scenario: Admin creates a new official template
- **WHEN** admin clicks "New Template" button
- **THEN** a form SHALL open with fields: name, description, content (markdown editor)
- **AND** on save, a new row SHALL be inserted with 	eacher_id = null and is_official = true

#### Scenario: Admin edits an official template
- **WHEN** admin clicks edit on a template
- **THEN** the template content SHALL load into the editor
- **AND** on save, the template SHALL be updated

#### Scenario: Admin deletes an official template
- **WHEN** admin clicks delete on a template
- **THEN** a confirmation dialog SHALL appear
- **AND** on confirm, the template SHALL be permanently deleted
