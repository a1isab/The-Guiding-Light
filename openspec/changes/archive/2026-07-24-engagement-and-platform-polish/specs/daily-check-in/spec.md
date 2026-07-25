## ADDED Requirements

### Requirement: Daily learning session acknowledgment
The dashboard SHALL acknowledge when a student has studied today.

#### Scenario: Greeting shows study acknowledgment
- **WHEN** a student views the dashboard and has completed a lesson today
- **THEN** they see "You studied today ✓" or similar acknowledgment

#### Scenario: New day shows no acknowledgment
- **WHEN** a student views the dashboard and has NOT studied today
- **THEN** the acknowledgment is absent or replaced with "Start today's learning"

### Requirement: Time-of-day greeting
The dashboard SHALL show a time-appropriate greeting.

#### Scenario: Morning greeting
- **WHEN** the local time is before 12:00
- **THEN** the greeting says "Good morning" or equivalent in the current locale

#### Scenario: Afternoon greeting
- **WHEN** the local time is between 12:00 and 18:00
- **THEN** the greeting says "Good afternoon" or equivalent

#### Scenario: Evening greeting
- **WHEN** the local time is after 18:00
- **THEN** the greeting says "Good evening" or equivalent
