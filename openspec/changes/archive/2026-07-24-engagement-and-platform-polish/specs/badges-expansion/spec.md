## ADDED Requirements

### Requirement: Badge definitions are config-driven
Badge types SHALL be defined in a configuration object with key, condition function, and metadata, not hardcoded check logic.

#### Scenario: New badge can be added via config
- **WHEN** a new entry is added to the badge definitions config
- **THEN** the scanning function automatically evaluates it for all users

### Requirement: New badge types exist
The following badge types SHALL be added beyond the existing `section_{id}` badge:

| Badge Key | Condition | Icon |
|-----------|-----------|------|
| `first_lesson` | Complete at least 1 lesson | BookOpen |
| `lessons_10` | Complete at least 10 lessons | Layers |
| `lessons_50` | Complete at least 50 lessons | Award |
| `streak_7` | Achieve 7-day streak | Flame |
| `streak_30` | Achieve 30-day streak | Flame |
| `quiz_ace` | Score 100% on any quiz | Brain |
| `course_{courseId}` | Complete all lessons in a course | GraduationCap |

#### Scenario: First lesson badge awarded
- **WHEN** a student completes their first lesson
- **THEN** the `first_lesson` badge is awarded

#### Scenario: Streak badge awarded at milestones
- **WHEN** streak reaches 7 days
- **THEN** `streak_7` badge is awarded
- **WHEN** streak reaches 30 days
- **THEN** `streak_30` badge is awarded

#### Scenario: Quiz ace badge awarded
- **WHEN** a student scores 100% on any quiz
- **THEN** the `quiz_ace` badge is awarded

#### Scenario: Course completion badge awarded
- **WHEN** a student completes all lessons in a course
- **THEN** the `course_{courseId}` badge is awarded

### Requirement: Badge grid shows locked previews
The BadgeGrid component SHALL show locked badges with their unlock conditions visible.

#### Scenario: Locked badge shows unlock condition
- **WHEN** a student views the badge grid
- **THEN** locked badges display their unlock condition text (e.g., "Complete 50 lessons")
