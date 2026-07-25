## ADDED Requirements

### Requirement: Teacher can upload document files per lesson
The system SHALL allow a teacher to upload document files (pdf, doc, docx, txt) to a lesson. Files SHALL be stored in the `lesson-files` Supabase Storage bucket, with metadata in `teacher_lesson_files` table.

#### Scenario: Teacher uploads a PDF
- **WHEN** a teacher POSTs a PDF file to `/api/teacher/files/upload` with `lessonId`
- **THEN** the system SHALL validate the file type is allowed (pdf, doc, docx, txt)
- **THEN** the system SHALL upload the file to the `lesson-files` bucket
- **THEN** the system SHALL insert a record in `teacher_lesson_files` with filename, mime_type, storage_path, lesson_id, teacher_id
- **THEN** the system SHALL return the file metadata

#### Scenario: Teacher uploads an image
- **WHEN** a teacher attempts to upload a .jpg or .png file
- **THEN** the system SHALL reject with 400 "File type not allowed"

### Requirement: Teacher can list files for a lesson
The system SHALL allow a teacher to list all document files for a lesson.

#### Scenario: Teacher lists lesson files
- **WHEN** a teacher GETs `/api/teacher/files?lessonId=X`
- **THEN** the system SHALL return all file metadata for that lesson

### Requirement: Teacher can delete a file
The system SHALL allow a teacher to delete a document file.

#### Scenario: Teacher deletes a file
- **WHEN** a teacher DELETEs `/api/teacher/files?id=X`
- **THEN** the system SHALL delete the file from storage
- **THEN** the system SHALL delete the record from `teacher_lesson_files`
- **THEN** the system SHALL verify the teacher owns the file

### Requirement: Student can view and download files
The system SHALL allow a student enrolled in the class to view and download lesson document files.

#### Scenario: Student sees file list in lesson
- **WHEN** a student opens a lesson page
- **THEN** the system SHALL display a list of downloadable document files
- **THEN** each file SHALL show its name and type icon
- **THEN** clicking a file SHALL download it
