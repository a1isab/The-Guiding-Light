## ADDED Requirements

### Requirement: Certificate earned on course completion
The system SHALL automatically generate a certificate when a student completes all lessons in a course within a class.

#### Scenario: Student completes last lesson
- **WHEN** a student marks the final lesson in a course as viewed
- **THEN** a certificate record is created with student name, course name, teacher name, and completion date

#### Scenario: Certificate not duplicated
- **WHEN** a student has already completed a course and marks another lesson
- **THEN** no duplicate certificate is created

### Requirement: Student can download certificate as PDF
The system SHALL allow students to download their certificate as a PDF file.

#### Scenario: PDF download
- **WHEN** a student clicks "Download Certificate" on their completed course
- **THEN** a PDF file is generated and downloaded with the certificate content

### Requirement: Certificate shows on dashboard
The system SHALL display earned certificates in a dedicated section on the student dashboard.

#### Scenario: Certificates section visible
- **WHEN** a student has earned certificates and visits the dashboard
- **THEN** they see a "Certificates" section with list of earned certificates and download buttons

### Requirement: Teacher can customize certificate branding
The system SHALL allow teachers to set a custom title and optional logo URL for certificates issued for their courses.

#### Scenario: Teacher sets certificate branding
- **WHEN** a teacher updates certificate settings for a class
- **THEN** certificates for that class's courses use the custom title and logo

### Requirement: Certificate page shows course details
The system SHALL display certificate details including student name, course name, teacher name, class name, and completion date.

#### Scenario: Certificate detail view
- **WHEN** a student views a specific certificate
- **THEN** they see all certificate details in a styled card layout
