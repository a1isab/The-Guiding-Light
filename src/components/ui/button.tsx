"use client";

import { forwardRef } from "react";
import Link from "next/link";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonPropsBase {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
  testId?: string;
}

interface ButtonAsButton extends ButtonPropsBase, Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonPropsBase> {
  href?: never;
}

interface ButtonAsLink extends ButtonPropsBase {
  href: string;
  disabled?: boolean;
  onClick?: () => void;
  [key: `data-${string}`]: unknown;
}

type ButtonProps = ButtonAsButton | ButtonAsLink;

const variantStyles: Record<Variant, React.CSSProperties> = {
  primary: {
    backgroundColor: "var(--accent)",
    color: "var(--text-primary)",
    boxShadow: "0 0 12px var(--glow)",
  },
  secondary: {
    backgroundColor: "transparent",
    color: "var(--accent)",
    border: "1px solid var(--accent)",
  },
  ghost: {
    backgroundColor: "transparent",
    color: "var(--text-secondary)",
  },
  danger: {
    backgroundColor: "var(--error)",
    color: "#FFFFFF",
  },
};

const sizeStyles: Record<Size, React.CSSProperties> = {
  sm: { padding: "0.375rem 0.75rem", fontSize: "0.75rem" },
  md: { padding: "0.5rem 1rem", fontSize: "0.875rem" },
  lg: { padding: "0.625rem 1.25rem", fontSize: "1rem" },
};

export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", loading, disabled, className = "", children, testId, href, onClick, ...rest },
  ref
) {
  const isDisabled = disabled || loading;

  const baseStyle: React.CSSProperties = {
    ...variantStyles[variant],
    ...sizeStyles[size],
    display: "inline-flex",
    alignItems: "center",
    gap: "0.5rem",
    borderRadius: "0.75rem",
    fontWeight: 500,
    fontFamily: "var(--font-sans)",
    cursor: isDisabled ? "not-allowed" : "pointer",
    opacity: isDisabled ? 0.5 : 1,
    transition: "all 0.2s ease-out",
    border: variant === "secondary" ? "1px solid var(--accent)" : "none",
    lineHeight: 1.4,
    textDecoration: "none",
    whiteSpace: "nowrap",
  };

  const hoverStyle: React.CSSProperties = isDisabled ? {} : {
    boxShadow: "0 0 20px var(--glow-strong)",
    transform: "translateY(-1px)",
  };

  const activeStyle: React.CSSProperties = isDisabled ? {} : {
    transform: "scale(0.98)",
  };

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" || e.key === " ") {
      (e.currentTarget as HTMLElement).click();
    }
  }

  const linkRest = rest as Record<string, unknown>;
  if (href) {
    return (
      <Link
        href={href}
        data-testid={testId}
        className={className}
        style={baseStyle}
        ref={ref as React.Ref<HTMLAnchorElement>}
        onMouseEnter={(e) => { if (!isDisabled) Object.assign(e.currentTarget.style, hoverStyle); }}
        onMouseLeave={(e) => { Object.assign(e.currentTarget.style, baseStyle); }}
        onMouseDown={(e) => { if (!isDisabled) Object.assign(e.currentTarget.style, activeStyle); }}
        onMouseUp={(e) => { if (!isDisabled) Object.assign(e.currentTarget.style, hoverStyle); }}
        onClick={onClick}
        tabIndex={isDisabled ? -1 : 0}
        role="button"
        aria-disabled={isDisabled}
        {...linkRest}
      >
        {children}
      </Link>
    );
  }

  const buttonRest = rest as React.ButtonHTMLAttributes<HTMLButtonElement>;

  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      data-testid={testId}
      disabled={isDisabled}
      className={className}
      style={baseStyle}
      onMouseEnter={(e) => { if (!isDisabled) Object.assign(e.currentTarget.style, hoverStyle); }}
      onMouseLeave={(e) => { Object.assign(e.currentTarget.style, baseStyle); }}
      onMouseDown={(e) => { if (!isDisabled) Object.assign(e.currentTarget.style, activeStyle); }}
      onMouseUp={(e) => { if (!isDisabled) Object.assign(e.currentTarget.style, hoverStyle); }}
      onKeyDown={handleKeyDown}
      onClick={onClick}
      aria-disabled={isDisabled}
      aria-busy={loading}
      {...buttonRest}
    >
      {loading && (
        <span
          className="animate-spin"
          style={{
            width: "1em",
            height: "1em",
            border: "2px solid currentColor",
            borderTopColor: "transparent",
            borderRadius: "50%",
            display: "inline-block",
          }}
        />
      )}
      {children}
    </button>
  );
});
