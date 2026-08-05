"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, ClipboardList } from "lucide-react";
import { MarkdownContent } from "@/components/teacher/markdown-content";
import { QuizViewer } from "@/components/teacher/quiz-viewer";
import { CommentThread } from "@/components/comment-thread";
import { SubmissionForm } from "@/components/submission-form";
import { SubmissionStatus } from "@/components/submission-status";
import { Button } from "@/components/ui/button";

interface Assignment {
  id: string;
  title: string;
  description: string | null;
  max_score: number;
  due_date: string | null;
}

interface Submission {
  status: string;
  score: number | null;
  feedback: string | null;
  submitted_at: string;
}

function AssignmentSection({ lessonId }: { lessonId: string }) {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/teacher/assignments?lessonId=${lessonId}`)
      .then((r) => r.json())
      .then((data) => {
        const list = data.assignments ?? [];
        setAssignments(list);
        if (list.length > 0) {
          return fetch(`/api/student/submissions?assignmentId=${list[0].id}`).then((r) => r.json());
        }
      })
      .then((subData) => {
        if (subData?.submission) setSubmission(subData.submission);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [lessonId]);

  if (loading || assignments.length === 0) return null;

  const assignment = assignments[0];

  return (
    <div data-testid="assignment-section" className="mt-8 pt-6" style={{ borderTop: "1px solid var(--border)" }}>
      <div className="flex items-center gap-2 mb-2">
        <ClipboardList className="h-5 w-5" style={{ color: "var(--accent)" }} />
        <h3 className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>Assignment</h3>
      </div>
      <div className="rounded-xl p-4" style={{ border: "1px solid var(--border)", backgroundColor: "var(--bg-elevated)" }}>
        <h4 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{assignment.title}</h4>
        {assignment.description && (
          <p className="mt-1 text-xs whitespace-pre-wrap" style={{ color: "var(--text-secondary)" }}>{assignment.description}</p>
        )}
        <div className="mt-2 flex items-center gap-4 text-xs" style={{ color: "var(--text-muted)" }}>
          <span>Max score: {assignment.max_score}</span>
          {assignment.due_date && (
            <span>Due: {new Date(assignment.due_date).toLocaleDateString()}</span>
          )}
        </div>
      </div>

      <SubmissionStatus submission={submission} maxScore={assignment.max_score} />

      {!submission || submission.status !== "graded" ? (
        <SubmissionForm
          assignmentId={assignment.id}
          existing={submission ? { id: "", body: null, file_urls: [], status: submission.status } : null}
          onSubmitted={() => {
            fetch(`/api/student/submissions?assignmentId=${assignment.id}`)
              .then((r) => r.json())
              .then((data) => { if (data.submission) setSubmission(data.submission); });
          }}
        />
      ) : null}
    </div>
  );
}

export function LessonContentView({
  lessonId,
  lessonContent,
  initialViewedAt,
  hasQuiz,
  prevLesson,
  nextLesson,
  classId,
  courseId,
  locale,
}: {
  lessonId: string;
  lessonContent: string | null;
  initialViewedAt: string | null;
  hasQuiz: boolean;
  prevLesson: { id: string; title: string } | null;
  nextLesson: { id: string; title: string } | null;
  classId: string;
  courseId: string;
  locale: string;
}) {
  const router = useRouter();
  const [viewedAt, setViewedAt] = useState<string | null>(initialViewedAt);
  const [viewing, setViewing] = useState(false);

  async function handleMarkViewed() {
    setViewing(true);
    try {
      const res = await fetch("/api/student/lessons/viewed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId }),
      });
      if (res.ok) {
        setViewedAt(new Date().toISOString());
        router.refresh();
      }
    } finally {
      setViewing(false);
    }
  }

  return (
    <div>
      {lessonContent && <MarkdownContent content={lessonContent} />}

      {!viewedAt && (
        <div className="mt-6">
          <Button
            onClick={handleMarkViewed}
            testId="mark-viewed"
            disabled={viewing}
            loading={viewing}
          >
            <Eye className="h-5 w-5" />
            {viewing ? "Marking..." : "Mark as Viewed"}
          </Button>
        </div>
      )}

      <div className="mt-10 pt-8" style={{ borderTop: "1px solid var(--border)" }}>
        {hasQuiz && viewedAt ? (
          <QuizViewer lessonId={lessonId} />
        ) : hasQuiz && !viewedAt ? (
          <p data-testid="quiz-locked" className="text-sm" style={{ color: "var(--text-muted)" }}>Mark the content as viewed above to unlock the quiz.</p>
        ) : (
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>No quiz for this lesson.</p>
        )}
      </div>

      <AssignmentSection lessonId={lessonId} />

      <CommentThread lessonId={lessonId} />

      {/* Prev/Next Navigation */}
      <div className="mt-10 pt-8 flex items-center justify-between gap-4" style={{ borderTop: "1px solid var(--border)" }}>
        {prevLesson ? (
          <a
            href={`/${locale}/dashboard/classes/${classId}/courses/${courseId}/lessons/${prevLesson.id}`}
            data-testid="nav-prev-lesson"
            className="flex items-center gap-2 rounded-xl px-4 py-3 transition-all"
            style={{ border: "1px solid var(--border)", backgroundColor: "var(--bg-surface)" }}
          >
            <svg className="h-4 w-4" style={{ color: "var(--text-muted)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <div className="text-left">
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>Previous</p>
              <p className="text-sm" style={{ color: "var(--text-primary)" }}>{prevLesson.title}</p>
            </div>
          </a>
        ) : (
          <a
            href={`/${locale}/dashboard/classes/${classId}/courses/${courseId}`}
            data-testid="nav-prev-lesson"
            className="flex items-center gap-2 rounded-xl px-4 py-3 transition-all"
            style={{ border: "1px solid var(--border)", backgroundColor: "var(--bg-surface)" }}
          >
            <svg className="h-4 w-4" style={{ color: "var(--text-muted)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <div className="text-left">
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>Back to</p>
              <p className="text-sm" style={{ color: "var(--text-primary)" }}>Course</p>
            </div>
          </a>
        )}

        {nextLesson && (
          <a
            href={`/${locale}/dashboard/classes/${classId}/courses/${courseId}/lessons/${nextLesson.id}`}
            data-testid="nav-next-lesson"
            className="flex items-center gap-2 rounded-xl px-4 py-3 transition-all ml-auto"
            style={{
              border: "1px solid color-mix(in srgb, var(--accent) 30%, transparent)",
              backgroundColor: "color-mix(in srgb, var(--accent) 10%, transparent)",
            }}
          >
            <div className="text-right">
              <p className="text-xs" style={{ color: "var(--accent)" }}>Next</p>
              <p className="text-sm" style={{ color: "var(--accent)" }}>{nextLesson.title}</p>
            </div>
            <svg className="h-4 w-4" style={{ color: "var(--accent)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        )}
      </div>
    </div>
  );
}
