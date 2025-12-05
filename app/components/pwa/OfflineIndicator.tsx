"use client";

import { useOnlineStatus } from "../../lib/pwa/usePWA";
import { useTranslation } from "../../features/i18n/useTranslation";

export function OfflineIndicator() {
  const isOnline = useOnlineStatus();
  const { t } = useTranslation();

  if (isOnline) {
    return null;
  }

  return (
    <div className="fixed left-0 right-0 top-0 z-50 bg-amber-500 px-4 py-2 text-center text-sm font-semibold text-white shadow-lg">
      <div className="flex items-center justify-center gap-2">
        <span>📡</span>
        <span>{t("pwa.offline.title")}</span>
      </div>
      <p className="mt-1 text-xs opacity-90">{t("pwa.offline.description")}</p>
    </div>
  );
}
