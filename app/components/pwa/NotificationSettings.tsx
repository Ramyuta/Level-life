"use client";

import { useTranslation } from "../../features/i18n/useTranslation";
import { useNotifications } from "../../lib/notifications/useNotifications";

export function NotificationSettings() {
  const { t } = useTranslation();
  const {
    isSupported,
    permission,
    config,
    requestPermission,
    updateConfig,
    sendTestNotification,
  } = useNotifications();

  if (!isSupported) {
    return (
      <div className="rounded-xl bg-slate-800 p-4 text-center text-slate-400">
        <p>⚠️ {t("pwa.notifications.permission")}</p>
        <p className="text-xs mt-1">
          (Your browser does not support notifications)
        </p>
      </div>
    );
  }

  if (permission !== "granted") {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-xl bg-slate-800 p-6 text-center">
        <div className="text-4xl">🔔</div>
        <div>
          <h3 className="font-bold text-slate-100">
            {t("pwa.notifications.enable")}
          </h3>
          <p className="mt-1 text-sm text-slate-400">
            {t("pwa.notifications.permission")}
          </p>
        </div>
        <button
          onClick={requestPermission}
          className="rounded-lg bg-indigo-600 px-6 py-2 font-bold text-white transition hover:bg-indigo-700"
        >
          {t("pwa.notifications.grant")}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Master Toggle */}
      <div className="flex items-center justify-between rounded-xl bg-slate-800 p-4">
        <div>
          <p className="font-semibold text-slate-100">
            {t("pwa.notifications.enable")}
          </p>
        </div>
        <label className="relative inline-flex cursor-pointer items-center">
          <input
            type="checkbox"
            checked={config.enabled}
            onChange={(e) => updateConfig({ enabled: e.target.checked })}
            className="peer sr-only"
          />
          <div className="peer h-6 w-11 rounded-full bg-slate-700 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-emerald-500 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-800"></div>
        </label>
      </div>

      {config.enabled && (
        <div className="space-y-3 pl-2">
          {/* Daily Reminder */}
          <div className="flex items-center justify-between rounded-xl bg-slate-800/50 p-3">
            <span className="text-sm text-slate-300">
              {t("pwa.notifications.dailyReminder")}
            </span>
            <input
              type="time"
              value={config.dailyReminderTime}
              onChange={(e) =>
                updateConfig({ dailyReminderTime: e.target.value })
              }
              className="rounded bg-slate-700 px-2 py-1 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Streak Alert */}
          <div className="flex items-center justify-between rounded-xl bg-slate-800/50 p-3">
            <span className="text-sm text-slate-300">
              {t("pwa.notifications.streakAlert")}
            </span>
            <input
              type="checkbox"
              checked={config.streakAlertEnabled}
              onChange={(e) =>
                updateConfig({ streakAlertEnabled: e.target.checked })
              }
              className="h-4 w-4 rounded border-slate-600 bg-slate-700 text-indigo-600 focus:ring-indigo-500"
            />
          </div>

          {/* Quest Reminders */}
          <div className="flex items-center justify-between rounded-xl bg-slate-800/50 p-3">
            <span className="text-sm text-slate-300">
              {t("pwa.notifications.questReminders")}
            </span>
            <input
              type="checkbox"
              checked={config.questRemindersEnabled}
              onChange={(e) =>
                updateConfig({ questRemindersEnabled: e.target.checked })
              }
              className="h-4 w-4 rounded border-slate-600 bg-slate-700 text-indigo-600 focus:ring-indigo-500"
            />
          </div>

          {/* Achievements */}
          <div className="flex items-center justify-between rounded-xl bg-slate-800/50 p-3">
            <span className="text-sm text-slate-300">
              {t("pwa.notifications.achievements")}
            </span>
            <input
              type="checkbox"
              checked={config.achievementNotificationsEnabled}
              onChange={(e) =>
                updateConfig({
                  achievementNotificationsEnabled: e.target.checked,
                })
              }
              className="h-4 w-4 rounded border-slate-600 bg-slate-700 text-indigo-600 focus:ring-indigo-500"
            />
          </div>

          {/* Test Button */}
          <button
            onClick={sendTestNotification}
            className="mt-2 w-full rounded-lg bg-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:bg-slate-600"
          >
            🔔 Test Notification
          </button>
        </div>
      )}
    </div>
  );
}
