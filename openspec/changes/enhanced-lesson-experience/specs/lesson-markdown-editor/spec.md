## ADDED Requirements

### Requirement: Teacher can write lesson content in markdown
The lesson content field SHALL use markdown syntax with a visual formatting toolbar.

#### Scenario: Teacher writes content with formatting
- **WHEN** teacher opens the lesson editor
- **THEN** the content area SHALL display a split-pane markdown editor with a live preview pane

#### Scenario: Teacher uses toolbar for bold text
- **WHEN** teacher selects text in the editor and clicks the Bold toolbar button
- **THEN** the editor SHALL wrap the selection in markdown bold syntax (**text**)
- **AND** the preview pane SHALL update in real-time showing bold text

#### Scenario: Toolbar provides formatting options
- **WHEN** teacher views the editor toolbar
- **THEN** the toolbar SHALL include buttons for: Bold, Italic, Heading 1, Heading 2, Unordered List, Ordered List

#### Scenario: Teacher can type markdown directly
- **WHEN** teacher types markdown syntax directly (e.g., ## Heading, **bold**)
- **THEN** the preview pane SHALL render the formatted output in real-time

### Requirement: Editor handles SSR safely
The markdown editor SHALL only render on the client side.

#### Scenario: Editor loads in browser
- **WHEN** the lesson editor page loads in the browser
- **THEN** the markdown editor SHALL render (no server-side render of the editor component)

### Requirement: Teacher can switch between edit and preview
The editor SHALL support writing in the left pane while seeing rendered output in the right pane.

#### Scenario: Live preview updates on change
- **WHEN** teacher types or edits content
- **THEN** the preview pane SHALL update within 500ms of the last keystroke
