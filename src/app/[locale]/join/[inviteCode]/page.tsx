"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

export default function JoinPage() {
  const params = useParams<{ locale: string; inviteCode: string }>();
  const router = useRouter();
  const t = useTranslations("teacher");

  const [status, setStatus] = useState<"loading" | "success" | "error" | "expired" | "exists">("loading");
  const [className, setClassName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    async function join() {
      try {
        const res = await fetch("/api/classes/join", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ inviteCode: params.inviteCode }),
        });

        const data = await res.json();

        if (!res.ok) {
          if (res.status === 401) {
            router.push(`/${params.locale}/auth/login?redirect=/join/${params.inviteCode}`);
            return;
          }
          if (res.status === 410) {
            setStatus("expired");
            setClassName(data.className ?? "");
            return;
          }
          if (res.status === 409) {
            setStatus("exists");
            setClassName(data.className ?? "");
            return;
          }
          setStatus("error");
          setErrorMsg(data.error ?? t("join_error"));
          return;
        }

        setStatus("success");
        setClassName(data.className);
      } catch (err) {
        setStatus("error");
        setErrorMsg(t("join_error"));
      }
    }

    join();
  }, [params.locale, params.inviteCode, router, t]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div
        className="w-full max-w-md rounded-2xl p-8 text-center"
        style={{ border: "1px solid var(--border)", backgroundColor: "var(--bg-surface)" }}
      >
        {status === "loading" && (
          <div>
            <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4" style={{ color: "var(--accent)" }} />
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{t("join_loading")}</p>
          </div>
        )}

        {status === "success" && (
          <div data-testid="join-success">
            <CheckCircle className="h-10 w-10 mx-auto mb-4" style={{ color: "var(--success)" }} />
            <h2 className="font-display text-lg font-bold mb-2" style={{ color: "var(--text-primary)" }}>{t("join_success_title")}</h2>
            <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>{t("join_success_msg", { name: className })}</p>
            <button
              onClick={() => router.push(`/${params.locale}/dashboard`)}
              data-testid="join-go-to-dashboard"
              className="rounded-xl px-6 py-2.5 text-sm font-medium text-white transition-all"
              style={{ backgroundColor: "var(--accent)" }}
            >
              {t("go_to_dashboard")}
            </button>
          </div>
        )}

        {status === "exists" && (
          <div data-testid="join-exists">
            <CheckCircle className="h-10 w-10 mx-auto mb-4" style={{ color: "var(--accent)" }} />
            <h2 className="font-display text-lg font-bold mb-2" style={{ color: "var(--text-primary)" }}>{t("join_exists_title")}</h2>
            <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>{t("join_exists_msg", { name: className })}</p>
            <button
              onClick={() => router.push(`/${params.locale}/dashboard`)}
              data-testid="join-go-to-dashboard-exists"
              className="rounded-xl px-6 py-2.5 text-sm font-medium text-white transition-all"
              style={{ backgroundColor: "var(--accent)" }}
            >
              {t("go_to_dashboard")}
            </button>
          </div>
        )}

        {status === "expired" && (
          <div data-testid="join-expired">
            <XCircle className="h-10 w-10 mx-auto mb-4" style={{ color: "var(--error)" }} />
            <h2 className="font-display text-lg font-bold mb-2" style={{ color: "var(--text-primary)" }}>{t("join_expired_title")}</h2>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{t("join_expired_msg", { name: className })}</p>
          </div>
        )}

        {status === "error" && (
          <div data-testid="join-error">
            <XCircle className="h-10 w-10 mx-auto mb-4" style={{ color: "var(--error)" }} />
            <h2 className="font-display text-lg font-bold mb-2" style={{ color: "var(--text-primary)" }}>{t("join_error_title")}</h2>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{errorMsg}</p>
          </div>
        )}
      </div>
    </div>
  );
}
