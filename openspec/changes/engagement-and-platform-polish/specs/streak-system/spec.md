## ADDED Requirements

### Requirement: Streak auto-increments on lesson completion
The streak counter in `profiles.streak` SHALL be automatically incremented when a student completes a lesson, with daily cadence (one increment per day regardless of how many lessons completed).

#### Scenario: First lesson of the day increments streak
- **WHEN** a student completes a lesson and today is a new day since their last activity
- **THEN** `profiles.streak` SHALL increment by 1
- **AND** `profiles.last_activity_at` SHALL be updated to now

#### Scenario: Multiple lessons same day do not over-increment
- **WHEN** a student completes multiple lessons on the same day
- **THEN** `profiles.streak` SHALL increment only once

#### Scenario: Missed day resets streak
- **WHEN** a student completes a lesson after more than 1 day since last activity
- **THEN** `profiles.streak` SHALL reset to 1

#### Scenario: First ever completion starts streak
- **WHEN** a student completes their first lesson ever
- **THEN** `profiles.streak` SHALL be set to 1

### Requirement: Streak displayed with milestone indicators
The dashboard SHALL display the current streak with a flame icon and visual milestones.

#### Scenario: Streak shows flame icon and count
- **WHEN** a student views the dashboard
- **THEN** they see a flame icon with their current streak count

#### Scenario: Streak milestone triggers notification
- **WHEN** streak reaches 3, 7, or 30 days
- **THEN** a milestone notification SHALL display (reuse BadgeNotification pattern or inline celebration)

#### Scenario: Streak-at-risk warning
- **WHEN** a student has not studied today and has an active streak
- **THEN** the streak icon SHALL show a subtle warning (dimmed flame, "Study today to keep your streak" message)
