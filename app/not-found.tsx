"use client";

import Link from "next/link";
import { useTranslation } from "./features/i18n/useTranslation";

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 px-4">
      <div className="max-w-md text-center">
        <div className="mb-6 text-6xl">🔍</div>
        <h1 className="mb-4 text-3xl font-bold text-slate-100">
          {t("errors.notFound") || "ページが見つかりません"}
        </h1>
        <p className="mb-6 text-slate-400">
          {t("errors.notFoundDesc") ||
            "お探しのページは存在しないか、移動した可能性があります。"}
        </p>
        <Link
          href="/dashboard"
          className="inline-block rounded-lg bg-emerald-500 px-6 py-3 font-semibold text-white transition hover:bg-emerald-600"
        >
          {t("errors.backToDashboard") || "ダッシュボードに戻る"}
        </Link>
      </div>
    </div>
  );
}
