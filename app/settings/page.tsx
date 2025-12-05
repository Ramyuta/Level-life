"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "../features/auth/context/AuthContext";
import { useUser } from "../features/user/context/UserContext";
import { useToast } from "../context/ToastContext";
import { useConfirm } from "../context/ConfirmContext";
import {
  exportData,
  importData,
  migrateLocalToFirestore,
} from "../lib/data/migration";
import type { StorageMode } from "../lib/types";
import SectionHeader from "../components/ui/SectionHeader";
import PageSectionCard from "../components/ui/PageSectionCard";
import { useTranslation } from "../features/i18n/useTranslation";
import { useLanguage } from "../features/i18n/LanguageContext";
import { useTheme } from "next-themes";
import { NotificationSettings } from "../components/pwa/NotificationSettings";
import { usePremium } from "../hooks/usePremium";
import PremiumModal from "../features/premium/components/PremiumModal";
import { Sparkles } from "lucide-react";
import AvatarSelector from "../features/user/components/AvatarSelector";
import type { AvatarId } from "../lib/types";

export default function SettingsPage() {
  const {
    userProfile,
    logout,
    firebaseAvailable,
    user: firebaseUser,
    updateUserProfile,
  } = useAuth();
  const { user, updateUser } = useUser();
  const { showToast } = useToast();
  const { confirm } = useConfirm();
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();
  const { isPremium } = usePremium();
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [isChangingMode, setIsChangingMode] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [mounted, setMounted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSignOut = async () => {
    try {
      await logout();
      showToast(t("settings.loggedOut"), "info");
    } catch (error) {
      console.error("Sign out error:", error);
      showToast(t("settings.logoutFailed"), "error");
    }
  };

  const handleStorageModeChange = async (newMode: StorageMode) => {
    if (newMode === user.settings.storageMode) return;

    if (newMode === "cloud" && !firebaseAvailable) {
      showToast(t("settings.cloudWarning"), "error");
      return;
    }

    if (newMode === "cloud" && !firebaseUser) {
      showToast(t("settings.loginWarning"), "error");
      return;
    }

    const confirmMessage =
      newMode === "cloud"
        ? t("settings.confirmLocalToCloud")
        : t("settings.confirmCloudToLocal");

    if (
      !(await confirm({
        title: t("settings.confirmChange"),
        message: confirmMessage,
        confirmText: t("settings.change"),
      }))
    )
      return;

    setIsChangingMode(true);
    try {
      if (newMode === "cloud" && firebaseUser) {
        await migrateLocalToFirestore(firebaseUser.uid);
      }

      updateUser({
        settings: {
          ...user.settings,
          storageMode: newMode,
        },
      });

      showToast(
        `${newMode === "cloud" ? t("settings.cloudMode") : t("settings.localMode")}${t("settings.changed")}`,
        "success"
      );
    } catch (error) {
      console.error("Failed to change storage mode:", error);
      showToast(t("settings.changeFailed"), "error");
    } finally {
      setIsChangingMode(false);
    }
  };

  const handleExport = () => {
    setIsExporting(true);
    try {
      const jsonData = exportData();
      const blob = new Blob([jsonData], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `level-life-backup-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast(t("settings.exportSuccess"), "success");
    } catch (error) {
      console.error("Export failed:", error);
      showToast(t("settings.exportFailed"), "error");
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImportFile = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (
      !(await confirm({
        title: t("settings.importConfirmTitle"),
        message: t("settings.importConfirmMessage"),
        confirmText: t("settings.importAction"),
        isDangerous: true,
      }))
    ) {
      event.target.value = "";
      return;
    }

    setIsImporting(true);
    try {
      const text = await file.text();
      await importData(text);
      showToast(t("settings.importSuccess"), "success");
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      console.error("Import failed:", error);
      showToast(t("settings.importFailed"), "error");
    } finally {
      setIsImporting(false);
      event.target.value = "";
    }
  };

  if (!mounted) return null;

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 sm:px-6 lg:px-8 pb-24">
      <SectionHeader
        title={t("settings.title")}
        subtitle={t("settings.subtitle")}
      />

      {!firebaseAvailable && (
        <div className="rounded-2xl bg-amber-500/20 p-4 ring-1 ring-amber-500/30 backdrop-blur-sm">
          <p className="text-sm text-amber-300">⚠️ {t("login.cloudWarning")}</p>
        </div>
      )}

      {/* Subscription Status */}
      {/* Subscription Status */}
      <PageSectionCard title={t("settings.subscription")}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-bold text-white">
              {isPremium ? t("settings.premiumPlan") : t("settings.freePlan")}
            </p>
            <p className="text-sm text-slate-400">
              {isPremium ? t("settings.premiumDesc") : t("settings.freeDesc")}
            </p>
          </div>
          {!isPremium && (
            <button
              onClick={() => setShowPremiumModal(true)}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-2 font-bold text-white shadow-lg shadow-indigo-500/25 transition-all hover:scale-105 active:scale-95"
            >
              <Sparkles className="h-4 w-4" />
              {t("settings.upgrade")}
            </button>
          )}
        </div>
      </PageSectionCard>

      {/* Customize Profile */}
      {/* Customize Profile */}
      <PageSectionCard title={t("settings.customizeProfile")}>
        <div className="space-y-4">
          <p className="text-sm text-slate-400">{t("settings.chooseAvatar")}</p>
          <AvatarSelector
            selectedId={userProfile?.avatarId}
            onSelect={async (id: AvatarId) => {
              await updateUserProfile({ avatarId: id });
              showToast(t("settings.profileUpdated"), "success");
            }}
          />
        </div>
      </PageSectionCard>

      {/* Account Info */}
      <PageSectionCard title={t("settings.accountInfo")}>
        <div className="space-y-3">
          <div>
            <p className="text-sm text-slate-400">
              {t("settings.displayName")}
            </p>
            <p className="text-white">
              {userProfile?.displayName || t("settings.guest")}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-400">{t("settings.email")}</p>
            <p className="text-white">
              {userProfile?.email || t("settings.notSet")}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-400">{t("settings.friendCode")}</p>
            <p className="font-mono text-lg font-bold text-emerald-400">
              {userProfile?.friendCode || "------"}
            </p>
          </div>
        </div>
      </PageSectionCard>

      {/* Language Selection */}
      <PageSectionCard
        title={t("settings.languageTitle")}
        subtitle={t("settings.languageDescription")}
      >
        <div className="flex gap-3">
          <button
            onClick={() => setLanguage("ja")}
            className={`flex-1 rounded-xl px-4 py-3 font-semibold transition-all ${
              language === "ja"
                ? "bg-indigo-600 text-white ring-2 ring-indigo-500"
                : "bg-slate-700/80 text-slate-300 hover:bg-slate-700"
            }`}
          >
            🇯🇵 日本語
          </button>
          <button
            onClick={() => setLanguage("en")}
            className={`flex-1 rounded-xl px-4 py-3 font-semibold transition-all ${
              language === "en"
                ? "bg-indigo-600 text-white ring-2 ring-indigo-500"
                : "bg-slate-700/80 text-slate-300 hover:bg-slate-700"
            }`}
          >
            🇬🇧 English
          </button>
        </div>
      </PageSectionCard>

      {/* Gemini API Key */}
      <PageSectionCard
        title="Gemini API Key"
        subtitle="Set your Google Gemini API key to enable AI features (Quest Generator & AI Advisor)"
      >
        <div className="space-y-3">
          <input
            type="password"
            placeholder="Enter your Gemini API key"
            defaultValue={
              typeof window !== "undefined"
                ? localStorage.getItem("level-life:gemini-api-key") || ""
                : ""
            }
            onChange={(e) => {
              if (typeof window !== "undefined") {
                if (e.target.value) {
                  localStorage.setItem(
                    "level-life:gemini-api-key",
                    e.target.value
                  );
                  showToast("API key saved", "success");
                } else {
                  localStorage.removeItem("level-life:gemini-api-key");
                  showToast("API key cleared", "info");
                }
              }
            }}
            className="w-full rounded-xl bg-slate-700/50 px-4 py-3 text-white placeholder-slate-400 ring-1 ring-slate-600 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <p className="text-xs text-slate-400">
            Get your API key from{" "}
            <a
              href="https://makersuite.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 hover:underline"
            >
              Google AI Studio
            </a>
          </p>
        </div>
      </PageSectionCard>

      {/* Storage Mode */}
      <PageSectionCard title={t("settings.storageMode")}>
        <div className="space-y-3">
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="radio"
              name="storage"
              value="local"
              checked={user.settings.storageMode === "local"}
              onChange={() => handleStorageModeChange("local")}
              disabled={isChangingMode}
              className="h-4 w-4 cursor-pointer"
            />
            <div>
              <p className="font-semibold text-white">
                {t("settings.localMode")}
              </p>
              <p className="text-sm text-slate-400">
                {t("settings.localDesc")}
              </p>
            </div>
          </label>
          <label
            className={`flex items-center gap-3 ${
              firebaseAvailable && firebaseUser
                ? "cursor-pointer"
                : "cursor-not-allowed opacity-50"
            }`}
          >
            <input
              type="radio"
              name="storage"
              value="cloud"
              checked={user.settings.storageMode === "cloud"}
              onChange={() => handleStorageModeChange("cloud")}
              disabled={isChangingMode || !firebaseAvailable || !firebaseUser}
              className="h-4 w-4"
            />
            <div>
              <p className="font-semibold text-white">
                {t("settings.cloudMode")}
              </p>
              <p className="text-sm text-slate-400">
                {t("settings.cloudDesc")}
              </p>
            </div>
          </label>
          {isChangingMode && (
            <p className="text-sm text-indigo-400">
              ⏳ {t("settings.changing")}
            </p>
          )}
          {!firebaseAvailable && (
            <p className="text-xs text-amber-400">
              ⚠️ {t("settings.cloudWarning")}
            </p>
          )}
          {firebaseAvailable && !firebaseUser && (
            <p className="text-xs text-amber-400">
              ⚠️ {t("settings.loginWarning")}
            </p>
          )}
        </div>
      </PageSectionCard>

      {/* Notification Settings */}
      <PageSectionCard title={t("pwa.notifications.title")}>
        <NotificationSettings />
      </PageSectionCard>

      {/* Theme */}
      <PageSectionCard title={t("settings.theme")}>
        <div className="flex gap-3">
          <button
            onClick={() => setTheme("light")}
            className={`flex-1 rounded-xl px-4 py-3 font-semibold transition-all ${
              theme === "light"
                ? "bg-indigo-600 text-white ring-2 ring-indigo-500"
                : "bg-slate-700/80 text-slate-300 hover:bg-slate-700"
            }`}
          >
            ☀️ {t("settings.themeLight")}
          </button>
          <button
            onClick={() => setTheme("dark")}
            className={`flex-1 rounded-xl px-4 py-3 font-semibold transition-all ${
              theme === "dark"
                ? "bg-indigo-600 text-white ring-2 ring-indigo-500"
                : "bg-slate-700/80 text-slate-300 hover:bg-slate-700"
            }`}
          >
            🌙 {t("settings.themeDark")}
          </button>
          <button
            onClick={() => setTheme("system")}
            className={`flex-1 rounded-xl px-4 py-3 font-semibold transition-all ${
              theme === "system"
                ? "bg-indigo-600 text-white ring-2 ring-indigo-500"
                : "bg-slate-700/80 text-slate-300 hover:bg-slate-700"
            }`}
          >
            💻 {t("settings.themeSystem")}
          </button>
        </div>
      </PageSectionCard>

      {/* Data Management */}
      <PageSectionCard title={t("settings.dataManagement")}>
        <div className="space-y-3">
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="w-full rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50"
          >
            {isExporting
              ? t("settings.exporting")
              : `📥 ${t("settings.export")}`}
          </button>
          <button
            onClick={handleImportClick}
            disabled={isImporting}
            className="w-full rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
          >
            {isImporting
              ? t("settings.importing")
              : `📤 ${t("settings.import")}`}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImportFile}
            className="hidden"
          />
          <p className="text-xs text-slate-400">{t("settings.backupNote")}</p>
        </div>
      </PageSectionCard>

      {/* Sign Out */}
      {userProfile && (
        <PageSectionCard>
          <button
            onClick={handleSignOut}
            className="w-full rounded-xl bg-rose-500 px-4 py-3 font-bold text-white transition hover:bg-rose-600"
          >
            {t("settings.logout")}
          </button>
        </PageSectionCard>
      )}
      <PremiumModal
        isOpen={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
      />
    </div>
  );
}
