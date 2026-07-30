"use client";

interface CardProps {
  children: React.ReactNode;
  hoverable?: boolean;
  padding?: "sm" | "md" | "lg";
  testId?: string;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

const paddingMap: Record<string, string> = {
  sm: "var(--space-3)",
  md: "var(--space-4)",
  lg: "var(--space-5)",
};

export function Card({
  children,
  hoverable,
  padding = "md",
  testId,
  className = "",
  style,
  onClick,
}: CardProps) {
  const baseStyle: React.CSSProperties = {
    borderRadius: "1rem",
    border: "1px solid var(--border)",
    backgroundColor: "var(--bg-surface)",
    padding: paddingMap[padding],
    transition: "all 0.2s ease-out",
    cursor: onClick ? "pointer" : undefined,
    ...style,
  };

  const hoverStyle: React.CSSProperties = hoverable ? {
    boxShadow: "0 0 24px var(--glow-strong)",
    borderColor: "var(--accent-dim)",
  } : {};

  return (
    <div
      data-testid={testId}
      className={className}
      style={baseStyle}
      onMouseEnter={(e) => {
        if (hoverable) Object.assign(e.currentTarget.style, hoverStyle);
      }}
      onMouseLeave={(e) => {
        if (hoverable) Object.assign(e.currentTarget.style, baseStyle);
      }}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === "Enter" || e.key === " ") onClick(); } : undefined}
    >
      {children}
    </div>
  );
}
