"use client";

import { useId } from "react";

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  error?: string;
  helperText?: string;
}

export function Input({ label, error, helperText, id, className = "", style, ...rest }: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = error ? `${inputId}-error` : undefined;
  const helperId = helperText && !error ? `${inputId}-helper` : undefined;

  const baseStyle: React.CSSProperties = {
    width: "100%",
    borderRadius: "0.75rem",
    border: `1px solid ${error ? "var(--error)" : "var(--border)"}`,
    padding: "0.625rem 0.75rem",
    fontSize: "0.875rem",
    backgroundColor: "var(--bg-surface)",
    color: "var(--text-primary)",
    outline: "none",
    transition: "all 0.2s ease-out",
    ...style,
  };

  const focusStyle: React.CSSProperties = {
    borderColor: error ? "var(--error)" : "var(--accent)",
    boxShadow: error
      ? "0 0 0 2px rgba(220, 68, 68, 0.2)"
      : `0 0 0 2px var(--glow-strong)`,
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
      {label && (
        <label
          htmlFor={inputId}
          style={{
            fontSize: "0.875rem",
            fontWeight: 500,
            color: "var(--text-secondary)",
          }}
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        aria-invalid={!!error}
        aria-describedby={errorId ?? helperId}
        aria-required={rest.required}
        className={className}
        style={baseStyle}
        onFocus={(e) => Object.assign(e.currentTarget.style, focusStyle)}
        onBlur={(e) => Object.assign(e.currentTarget.style, baseStyle)}
        {...rest}
      />
      {error && (
        <p
          id={errorId}
          role="alert"
          style={{ fontSize: "0.75rem", color: "var(--error)", margin: 0 }}
        >
          {error}
        </p>
      )}
      {helperText && !error && (
        <p
          id={helperId}
          style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: 0 }}
        >
          {helperText}
        </p>
      )}
    </div>
  );
}
