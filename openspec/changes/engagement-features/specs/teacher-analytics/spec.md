## ADDED Requirements

### Requirement: Teacher sees class overview metrics
The system SHALL display key metrics for each class: total students, average quiz score, overall completion rate, and at-risk students count.

#### Scenario: Analytics page loads with metrics
- **WHEN** a teacher navigates to the analytics tab for a class
- **THEN** they see cards showing total students, avg quiz score %, completion %, and at-risk count

### Requirement: Teacher sees quiz score distribution
The system SHALL display a chart showing the distribution of quiz scores across students in the class.

#### Scenario: Quiz score chart renders
- **WHEN** a teacher views the analytics page
- **THEN** a bar chart shows score ranges (0-20%, 21-40%, 41-60%, 61-80%, 81-100%) with student counts

### Requirement: Teacher sees completion timeline
The system SHALL display a chart showing lesson completion counts over time (last 30 days).

#### Scenario: Completion timeline chart renders
- **WHEN** a teacher views the analytics page
- **THEN** a line chart shows daily completion counts for the past 30 days

### Requirement: Teacher identifies at-risk students
The system SHALL flag students as "at-risk" if they have a streak of 0 and haven't been active in 3+ days.

#### Scenario: At-risk student list
- **WHEN** a teacher views the at-risk section
- **THEN** they see a list of students with 0 streak and last activity 3+ days ago, with their last active date

### Requirement: Teacher sees per-lesson completion rates
The system SHALL show completion percentages for each lesson in the class.

#### Scenario: Lesson completion breakdown
- **WHEN** a teacher views lesson breakdown
- **THEN** they see each lesson title with X/Y students completed and a progress bar

### Requirement: Analytics data is computed server-side
The system SHALL compute all analytics metrics in API routes, not in the browser.

#### Scenario: API returns pre-computed metrics
- **WHEN** the analytics API is called
- **THEN** it returns aggregated metrics (counts, averages, distributions) not raw rows
