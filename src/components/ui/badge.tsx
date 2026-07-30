type BadgeVariant = "success" | "warning" | "error" | "info";

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, React.CSSProperties> = {
  success: {
    backgroundColor: "color-mix(in srgb, var(--success) 15%, transparent)",
    color: "var(--success)",
  },
  warning: {
    backgroundColor: "color-mix(in srgb, var(--accent) 15%, transparent)",
    color: "var(--accent)",
  },
  error: {
    backgroundColor: "color-mix(in srgb, var(--error) 15%, transparent)",
    color: "var(--error)",
  },
  info: {
    backgroundColor: "color-mix(in srgb, var(--text-secondary) 15%, transparent)",
    color: "var(--text-secondary)",
  },
};

export function Badge({ variant = "info", children, className = "" }: BadgeProps) {
  return (
    <span
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.25rem",
        borderRadius: "9999px",
        padding: "0.125rem 0.625rem",
        fontSize: "0.75rem",
        fontWeight: 500,
        lineHeight: 1.5,
        ...variantStyles[variant],
      }}
    >
      {children}
    </span>
  );
}
