## ADDED Requirements

### Requirement: Teacher can create quiz questions
The system SHALL allow a teacher to create multiple-choice quiz questions for a lesson. Questions SHALL have a question text, 4 options, a correct answer index, and an order index.

#### Scenario: Teacher saves quiz questions
- **WHEN** a teacher POSTs a quiz with 5 questions to `/api/teacher/quiz/save` with `lessonId`
- **THEN** the system SHALL upsert the questions in `teacher_quiz_questions`
- **THEN** the system SHALL return the saved questions with their IDs

### Requirement: AI generates quiz from lesson content
The system SHALL allow a teacher to generate quiz questions from lesson content using Gemini AI. The teacher SHALL preview and edit the draft before saving.

#### Scenario: Teacher generates quiz with AI
- **WHEN** a teacher POSTs lesson content to `/api/teacher/quiz/generate` with a question count
- **THEN** the system SHALL call Gemini AI with the content
- **THEN** the system SHALL return a draft JSON array of { question, options[], correctIndex }
- **THEN** the system SHALL NOT persist the draft to the database

#### Scenario: Teacher edits generated draft
- **WHEN** the teacher receives the AI-generated draft
- **THEN** the UI SHALL display all questions with editable text, options, and correct answer selection
- **THEN** the teacher SHALL be able to modify any field before saving

### Requirement: Student can view quiz questions
The system SHALL allow a student to retrieve quiz questions for a lesson. The correct answer SHALL NOT be sent to students.

#### Scenario: Student requests quiz
- **WHEN** a student GETs `/api/teacher/quiz/questions?lessonId=X`
- **THEN** the system SHALL return questions with options but WITHOUT correct_index
- **THEN** the system SHALL verify the student is enrolled in the class

### Requirement: Student can submit quiz answers
The system SHALL allow a student to submit answers for a quiz and get an immediate score.

#### Scenario: Student submits quiz
- **WHEN** a student POSTs answers to `/api/teacher/quiz/submit`
- **THEN** the system SHALL calculate the score (correct/total)
- **THEN** the system SHALL return `{ score, total, passed: score/total >= 0.6 }`
- **THEN** the system SHALL record the attempt in `teacher_quiz_attempts`

### Requirement: Student is forced to pass quiz before lesson is complete
If a quiz exists for a lesson, the student MUST pass the quiz (>=60%) before the lesson is marked complete. Passing the quiz SHALL automatically mark the lesson complete in the progress table.

#### Scenario: Quiz completion marks lesson complete
- **WHEN** a student passes a quiz (>=60%)
- **THEN** the system SHALL insert/update `progress` with `completed: true` for that student and lesson
- **THEN** the existing "Mark Complete" button SHALL be hidden when a quiz exists

#### Scenario: Student fails quiz
- **WHEN** a student scores below 60%
- **THEN** the lesson SHALL NOT be marked complete
- **THEN** the system SHALL show the score and allow retry (if not locked)

### Requirement: Retake and lockout system
The system SHALL enforce: 3 failed attempts → lock for 30 minutes → 2 retakes become available → repeat cycle.

#### Scenario: First 3 attempts allowed
- **WHEN** a student has 0, 1, or 2 failed attempts in the last 30 minutes
- **THEN** the submit API SHALL accept the attempt

#### Scenario: Locked after 3 attempts
- **WHEN** a student has 3 or more failed attempts in the last 30 minutes
- **THEN** the submit API SHALL return 429 with `{ locked: true, retryAfter: <seconds> }`
- **THEN** the system SHALL NOT record the attempt

#### Scenario: Lockout expires after 30 min
- **WHEN** 30 minutes have passed since the earliest failed attempt in the current window
- **THEN** the student SHALL have 2 retakes available
- **THEN** the cycle SHALL repeat (3 fails → lock → 2 retakes)

#### Scenario: Student passes during retakes
- **WHEN** a student passes the quiz on their 4th or 5th attempt
- **THEN** the lesson SHALL be marked complete
- **THEN** the quiz SHALL be locked (no more attempts needed)

#### Scenario: Student sees quiz status
- **WHEN** a student GETs `/api/teacher/quiz/status?lessonId=X`
- **THEN** the system SHALL return `{ totalAttempts, passed, locked, retryAfter }`
- **THEN** the UI SHALL show remaining attempts or lockout timer

### Requirement: Configurable question count
The teacher SHALL configure the number of questions (3-10) when generating or creating a quiz.

#### Scenario: Teacher picks question count
- **WHEN** a teacher generates or saves a quiz
- **THEN** they SHALL be able to select between 3 and 10 questions
- **THEN** the system SHALL validate the count is within range
