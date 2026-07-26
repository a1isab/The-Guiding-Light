"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";

type ToastVariant = "success" | "error" | "warning" | "info";

interface Toast {
  id: string;
  message: string;
  variant: ToastVariant;
  duration?: number;
}

interface ToastContextValue {
  toast: (message: string, variant?: ToastVariant, duration?: number) => void;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue>({
  toast: () => {},
  dismiss: () => {},
});

export function useToast() {
  return useContext(ToastContext);
}

const ICONS: Record<ToastVariant, React.ReactNode> = {
  success: <CheckCircle className="h-5 w-5" />,
  error: <XCircle className="h-5 w-5" />,
  warning: <AlertTriangle className="h-5 w-5" />,
  info: <Info className="h-5 w-5" />,
};

const COLORS: Record<ToastVariant, { border: string; bg: string; icon: string; text: string }> = {
  success: {
    border: "color-mix(in srgb, var(--success) 50%, transparent)",
    bg: "color-mix(in srgb, var(--success) 10%, transparent)",
    icon: "var(--success)",
    text: "var(--success)",
  },
  error: {
    border: "color-mix(in srgb, var(--error) 50%, transparent)",
    bg: "color-mix(in srgb, var(--error) 10%, transparent)",
    icon: "var(--error)",
    text: "var(--error)",
  },
  warning: {
    border: "color-mix(in srgb, var(--accent) 50%, transparent)",
    bg: "color-mix(in srgb, var(--accent) 10%, transparent)",
    icon: "var(--accent)",
    text: "var(--accent)",
  },
  info: {
    border: "1px solid var(--border)",
    bg: "var(--bg-elevated)",
    icon: "var(--text-secondary)",
    text: "var(--text-primary)",
  },
};

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  const colors = COLORS[toast.variant];
  const icon = ICONS[toast.variant];

  useEffect(() => {
    if (toast.duration && toast.duration > 0) {
      const timer = setTimeout(onDismiss, toast.duration);
      return () => clearTimeout(timer);
    }
  }, [toast.duration, onDismiss]);

  return (
    <div
      className="flex items-start gap-3 rounded-xl border px-4 py-3 shadow-2xl animate-fade-in-up"
      style={{
        borderColor: colors.border,
        backgroundColor: colors.bg,
        minWidth: 280,
        maxWidth: 420,
      }}
    >
      <div className="mt-0.5 flex-shrink-0" style={{ color: colors.icon }}>
        {icon}
      </div>
      <p className="flex-1 text-sm" style={{ color: colors.text }}>
        {toast.message}
      </p>
      <button
        onClick={onDismiss}
        className="flex-shrink-0 rounded p-0.5 transition-colors hover:opacity-70"
        style={{ color: colors.text }}
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const counterRef = useRef(0);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (message: string, variant: ToastVariant = "info", duration: number = 4000) => {
      const id = `toast-${++counterRef.current}`;
      setToasts((prev) => [...prev, { id, message, variant, duration }]);
    },
    []
  );

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-3 pointer-events-none">
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto">
            <ToastItem toast={t} onDismiss={() => dismiss(t.id)} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
