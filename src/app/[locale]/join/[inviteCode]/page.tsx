"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase-client";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

export default function JoinPage() {
  const params = useParams<{ locale: string; inviteCode: string }>();
  const router = useRouter();
  const t = useTranslations("teacher");
  const supabase = createClient();

  const [status, setStatus] = useState<"loading" | "success" | "error" | "expired" | "exists">("loading");
  const [className, setClassName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    async function join() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push(`/${params.locale}/auth/login?redirect=/join/${params.inviteCode}`);
          return;
        }

        const { data: cls, error: clsErr } = await supabase
          .from("classes")
          .select("id, name, invite_expires_at")
          .eq("invite_code", params.inviteCode.toUpperCase())
          .single();

        if (clsErr || !cls) {
          setStatus("error");
          setErrorMsg(t("join_invalid_code"));
          return;
        }

        if (cls.invite_expires_at && new Date(cls.invite_expires_at) < new Date()) {
          setStatus("expired");
          setClassName(cls.name);
          return;
        }

        const { data: existing } = await supabase
          .from("class_members")
          .select("id")
          .eq("class_id", cls.id)
          .eq("student_id", user.id)
          .single();

        if (existing) {
          setStatus("exists");
          setClassName(cls.name);
          return;
        }

        const { error: joinErr } = await supabase
          .from("class_members")
          .insert({ class_id: cls.id, student_id: user.id });

        if (joinErr) {
          setStatus("error");
          setErrorMsg(joinErr.message);
          return;
        }

        setStatus("success");
        setClassName(cls.name);
      } catch (err) {
        setStatus("error");
        setErrorMsg(t("join_error"));
      }
    }

    join();
  }, []);

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-[#111111] p-8 text-center">
        {status === "loading" && (
          <div>
            <Loader2 className="h-10 w-10 animate-spin text-emerald-400 mx-auto mb-4" />
            <p className="text-sm text-zinc-400">{t("join_loading")}</p>
          </div>
        )}

        {status === "success" && (
          <div>
            <CheckCircle className="h-10 w-10 text-emerald-400 mx-auto mb-4" />
            <h2 className="font-amiri text-lg font-bold text-zinc-100 mb-2">{t("join_success_title")}</h2>
            <p className="text-sm text-zinc-400 mb-6">{t("join_success_msg", { name: className })}</p>
            <button
              onClick={() => router.push(`/${params.locale}/dashboard`)}
              className="rounded-xl bg-emerald-500 px-6 py-2.5 text-sm font-medium text-white hover:bg-emerald-400 transition-all"
            >
              {t("go_to_dashboard")}
            </button>
          </div>
        )}

        {status === "exists" && (
          <div>
            <CheckCircle className="h-10 w-10 text-amber-400 mx-auto mb-4" />
            <h2 className="font-amiri text-lg font-bold text-zinc-100 mb-2">{t("join_exists_title")}</h2>
            <p className="text-sm text-zinc-400 mb-6">{t("join_exists_msg", { name: className })}</p>
            <button
              onClick={() => router.push(`/${params.locale}/dashboard`)}
              className="rounded-xl bg-emerald-500 px-6 py-2.5 text-sm font-medium text-white hover:bg-emerald-400 transition-all"
            >
              {t("go_to_dashboard")}
            </button>
          </div>
        )}

        {status === "expired" && (
          <div>
            <XCircle className="h-10 w-10 text-red-400 mx-auto mb-4" />
            <h2 className="font-amiri text-lg font-bold text-zinc-100 mb-2">{t("join_expired_title")}</h2>
            <p className="text-sm text-zinc-400">{t("join_expired_msg", { name: className })}</p>
          </div>
        )}

        {status === "error" && (
          <div>
            <XCircle className="h-10 w-10 text-red-400 mx-auto mb-4" />
            <h2 className="font-amiri text-lg font-bold text-zinc-100 mb-2">{t("join_error_title")}</h2>
            <p className="text-sm text-zinc-400">{errorMsg}</p>
          </div>
        )}
      </div>
    </div>
  );
}
