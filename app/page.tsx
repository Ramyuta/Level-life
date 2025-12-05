"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "./features/i18n/useTranslation";

export default function HomePage() {
  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    router.push("/dashboard");
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-slate-100">Level-Life</h1>
        <p className="mt-2 text-slate-400">{t("common.loading")}</p>
      </div>
    </div>
  );
}
