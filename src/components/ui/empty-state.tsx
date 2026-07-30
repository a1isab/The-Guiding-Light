import type { ReactNode } from "react";
import { Button } from "./button";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div
      className="rounded-2xl border border-dashed p-12 text-center"
      style={{
        borderColor: "var(--border)",
        backgroundColor: "var(--bg-surface)",
      }}
    >
      {icon && (
        <div style={{ marginBottom: "0.75rem", color: "var(--text-muted)" }}>
          {icon}
        </div>
      )}
      <p
        style={{
          fontSize: "var(--text-lead)",
          fontWeight: 600,
          color: "var(--text-primary)",
          marginBottom: description ? "0.25rem" : 0,
        }}
      >
        {title}
      </p>
      {description && (
        <p
          style={{
            fontSize: "var(--text-body)",
            color: "var(--text-muted)",
            marginBottom: action ? "1rem" : 0,
          }}
        >
          {description}
        </p>
      )}
      {action && (
        <Button
          variant="primary"
          size="md"
          href={action.href}
          onClick={action.onClick}
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}
