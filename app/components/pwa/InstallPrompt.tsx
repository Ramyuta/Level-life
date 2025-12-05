"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "../../features/i18n/useTranslation";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallPrompt() {
  const { t } = useTranslation();
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      return;
    }

    // Check if user has dismissed before
    const dismissed = localStorage.getItem("pwa-install-dismissed");
    if (dismissed) {
      const dismissedDate = new Date(dismissed);
      const daysSinceDismissed =
        (Date.now() - dismissedDate.getTime()) / (1000 * 60 * 60 * 24);
      // Show again after 7 days
      if (daysSinceDismissed < 7) {
        return;
      }
    }

    // Listen for beforeinstallprompt event
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);

      // Show prompt after user has visited 3 times
      const visitCount = parseInt(
        localStorage.getItem("visit-count") || "0",
        10
      );
      if (visitCount >= 3) {
        setShowPrompt(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handler);

    // Increment visit count
    const visitCount = parseInt(localStorage.getItem("visit-count") || "0", 10);
    localStorage.setItem("visit-count", (visitCount + 1).toString());

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      console.log("User accepted the install prompt");
    }

    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    localStorage.setItem("pwa-install-dismissed", new Date().toISOString());
    setShowPrompt(false);
  };

  if (!showPrompt || !deferredPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md animate-in slide-in-from-bottom-5 md:left-auto md:right-4">
      <div className="rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 p-1 shadow-2xl">
        <div className="rounded-xl bg-slate-900 p-4">
          <div className="mb-3 flex items-start gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-2xl">
              📱
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-100">
                {t("pwa.install.title")}
              </h3>
              <p className="mt-1 text-sm text-slate-300">
                {t("pwa.install.description")}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleInstall}
              className="flex-1 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2 font-semibold text-white transition hover:from-emerald-600 hover:to-teal-600"
            >
              {t("pwa.install.button")}
            </button>
            <button
              onClick={handleDismiss}
              className="rounded-lg bg-slate-700/50 px-4 py-2 font-semibold text-slate-300 transition hover:bg-slate-700"
            >
              {t("pwa.install.later")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
