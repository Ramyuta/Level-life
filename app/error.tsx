"use client";

import { useEffect } from "react";
import { useTranslation } from "./features/i18n/useTranslation";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useTranslation();

  useEffect(() => {
    console.error("Error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 px-4">
      <div className="max-w-md text-center">
        <div className="mb-6 text-6xl">⚠️</div>
        <h1 className="mb-4 text-3xl font-bold text-slate-100">
          {t("errors.generic") || "エラーが発生しました"}
        </h1>
        <p className="mb-6 text-slate-400">
          {t("errors.unexpected") ||
            "申し訳ございません。予期しないエラーが発生しました。"}
        </p>
        <button
          onClick={reset}
          className="rounded-lg bg-emerald-500 px-6 py-3 font-semibold text-white transition hover:bg-emerald-600"
        >
          {t("common.retry") || "再試行"}
        </button>
      </div>
    </div>
  );
}
