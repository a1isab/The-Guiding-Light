## ADDED Requirements

### Requirement: Weekly activity indicator on dashboard
The dashboard SHALL show a visual indicator of the student's activity over the last 7 days.

#### Scenario: Weekly mini-heatmap displays
- **WHEN** a student views the dashboard
- **THEN** they see a row of 7 dots/cells representing the last 7 days
- **AND** days with completed lessons are filled/colored
- **AND** today is highlighted

### Requirement: Clear course completion percentage
The course page SHALL show a visible completion percentage, preferably as a donut or filled ring chart.

#### Scenario: Course progress shows as percentage
- **WHEN** a student views a course page
- **THEN** they see a donut/filled ring showing completion percentage
- **AND** the numeric percentage is displayed

### Requirement: Lessons-this-week counter
The dashboard SHALL show how many lessons the student has completed this week.

#### Scenario: Weekly lesson count displayed
- **WHEN** a student views the dashboard
- **THEN** they see "X lessons this week"
- **AND** an optional weekly goal indicator

### Requirement: Estimated lessons remaining
The course/section view SHALL show how many lessons remain to complete the section or course.

#### Scenario: Remaining count displayed
- **WHEN** a student views a section or course
- **THEN** they see "X lessons remaining" for the current section/course
