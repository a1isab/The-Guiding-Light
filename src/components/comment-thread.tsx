"use client";

import { useState, useEffect, useCallback } from "react";
import { MessageSquare, Trash2, Reply } from "lucide-react";
import { CommentForm } from "./comment-form";

interface Comment {
  id: string;
  lesson_id: string;
  user_id: string;
  body: string;
  parent_id: string | null;
  created_at: string;
  author_name: string;
  author_role: string;
  is_owner: boolean;
}

interface CommentThreadProps {
  lessonId: string;
}

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = Math.floor((now - then) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function CommentItem({
  comment,
  replies,
  onDelete,
  onReply,
  currentUserId,
}: {
  comment: Comment;
  replies: Comment[];
  onDelete: (id: string) => void;
  onReply: (parentId: string, body: string) => Promise<void>;
  currentUserId: string;
}) {
  const [replying, setReplying] = useState(false);

  return (
    <div data-testid="comment-item" className="group">
      <div className="flex items-start gap-3 py-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold" style={{ background: "var(--bg-subtle)", color: "var(--text-secondary)" }}>
          {comment.author_name[0]}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{comment.author_name}</span>
            {comment.author_role === "teacher" && (
              <span className="rounded-full px-2 py-0.5 text-[10px] font-medium" style={{ background: "color-mix(in srgb, var(--success) 15%, transparent)", color: "var(--success)" }}>
                Teacher
              </span>
            )}
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>{timeAgo(comment.created_at)}</span>
          </div>
          <p className="mt-1 text-sm whitespace-pre-wrap" style={{ color: "var(--text-primary)" }}>{comment.body}</p>
          <div className="mt-2 flex items-center gap-3">
            {!comment.parent_id && comment.user_id !== currentUserId && (
              <button
                data-testid="comment-reply-btn"
                onClick={() => setReplying(!replying)}
                className="flex items-center gap-1 text-xs transition-colors"
                style={{ color: "var(--text-secondary)" }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "var(--text-primary)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-secondary)"; }}
              >
                <Reply className="h-3 w-3" /> Reply
              </button>
            )}
            {comment.is_owner && (
              <button
                data-testid="comment-delete-btn"
                onClick={() => onDelete(comment.id)}
                className="flex items-center gap-1 text-xs transition-colors opacity-0 group-hover:opacity-100"
                style={{ color: "var(--text-muted)" }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "var(--error)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-muted)"; }}
              >
                <Trash2 className="h-3 w-3" /> Delete
              </button>
            )}
          </div>
        </div>
      </div>

      {replying && (
        <div className="ml-11 mb-2">
          <CommentForm
            compact
            placeholder="Write a reply..."
            onSubmit={async (body) => {
              await onReply(comment.id, body);
              setReplying(false);
            }}
          />
        </div>
      )}

      {replies.map((reply) => (
        <div key={reply.id} className="ml-11 pl-3" style={{ borderLeft: "1px solid var(--border)" }}>
          <div className="flex items-start gap-3 py-2">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold" style={{ background: "var(--bg-subtle)", color: "var(--text-secondary)" }}>
              {reply.author_name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium" style={{ color: "var(--text-primary)" }}>{reply.author_name}</span>
                {reply.author_role === "teacher" && (
                  <span className="rounded-full px-1.5 py-0.5 text-[9px] font-medium" style={{ background: "color-mix(in srgb, var(--success) 15%, transparent)", color: "var(--success)" }}>
                    Teacher
                  </span>
                )}
                <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>{timeAgo(reply.created_at)}</span>
              </div>
              <p className="mt-0.5 text-xs whitespace-pre-wrap" style={{ color: "var(--text-primary)" }}>{reply.body}</p>
              {reply.is_owner && (
                <button
                  data-testid="comment-delete-btn"
                  onClick={() => onDelete(reply.id)}
                  className="mt-1 flex items-center gap-1 text-[10px] transition-colors opacity-0 group-hover:opacity-100"
                  style={{ color: "var(--text-muted)" }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "var(--error)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-muted)"; }}
                >
                  <Trash2 className="h-3 w-3" /> Delete
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function CommentThread({ lessonId }: CommentThreadProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const loadComments = useCallback(async (): Promise<Comment[]> => {
    const res = await fetch(`/api/student/lessons/comments?lessonId=${lessonId}`);
    if (res.ok) {
      const data = await res.json();
      return data.comments ?? [];
    }
    return [];
  }, [lessonId]);

  useEffect(() => {
    loadComments()
      .then((items) => {
        setComments(items);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => setCurrentUserId(d.userId ?? ""))
      .catch(() => {});
  }, [loadComments]);

  async function handlePost(body: string) {
    await fetch("/api/student/lessons/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lessonId, body }),
    });
    setComments(await loadComments());
  }

  async function handleReply(parentId: string, body: string) {
    await fetch("/api/student/lessons/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lessonId, body, parentId }),
    });
    setComments(await loadComments());
  }

  async function handleDelete(id: string) {
    await fetch(`/api/student/lessons/comments?id=${id}`, { method: "DELETE" });
    setComments(await loadComments());
  }

  const topLevel = comments.filter((c) => !c.parent_id);
  const repliesByParent: Record<string, Comment[]> = {};
  for (const c of comments) {
    if (c.parent_id) {
      if (!repliesByParent[c.parent_id]) repliesByParent[c.parent_id] = [];
      repliesByParent[c.parent_id].push(c);
    }
  }

  return (
    <div className="mt-10 pt-8" style={{ borderTop: "1px solid var(--border)" }}>
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare className="h-5 w-5" style={{ color: "var(--text-secondary)" }} />
        <h3 className="text-sm font-medium" style={{ color: "var(--text-primary)" }} data-testid="comments-header">
          Discussion ({comments.length})
        </h3>
      </div>

      <CommentForm onSubmit={handlePost} />

      {loading ? (
        <p className="mt-4 text-xs" style={{ color: "var(--text-muted)" }}>Loading comments...</p>
      ) : topLevel.length === 0 ? (
        <p className="mt-4 text-xs" style={{ color: "var(--text-muted)" }}>No comments yet. Be the first to ask a question!</p>
      ) : (
        <div className="mt-4">
          {topLevel.map((c) => (
            <div key={c.id} style={{ borderTop: "1px solid color-mix(in srgb, var(--border) 50%, transparent)" }}>
              <CommentItem
                comment={c}
                replies={repliesByParent[c.id] ?? []}
                onDelete={handleDelete}
                onReply={handleReply}
                currentUserId={currentUserId}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
