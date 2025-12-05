"use client";

import { useState } from "react";

import { useAuth } from "../../auth/context/AuthContext";
import { useTranslation } from "../../i18n/useTranslation";
import { Copy, Check, Share2 } from "lucide-react";

export default function FriendCodeCard() {
  const { userProfile } = useAuth();
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const friendCodeValue = userProfile?.friendCode || "---";

  const handleCopy = async () => {
    if (friendCodeValue === "---") return;

    try {
      await navigator.clipboard.writeText(friendCodeValue);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleShare = async () => {
    if (friendCodeValue === "---") return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Level-Life Friend Code",
          text: `Let's level up together on Level-Life! My friend code is: ${friendCodeValue}`,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 p-6 ring-1 ring-white/10">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-bold text-white">
          {t("social.yourFriendCode")}
        </h3>
        <Share2
          className="h-5 w-5 text-indigo-400 cursor-pointer hover:text-indigo-300 transition-colors"
          onClick={handleShare}
        />
      </div>

      <div className="flex items-center gap-3">
        <div className="flex-1 rounded-xl bg-slate-950/50 px-4 py-3 text-center text-2xl font-mono font-bold tracking-wider text-white ring-1 ring-white/10">
          {friendCodeValue}
        </div>
        <button
          onClick={handleCopy}
          className="flex h-14 w-14 items-center justify-center rounded-xl bg-indigo-500 text-white transition-all hover:bg-indigo-400 active:scale-95"
          aria-label="Copy friend code"
        >
          {copied ? (
            <Check className="h-6 w-6" />
          ) : (
            <Copy className="h-6 w-6" />
          )}
        </button>
      </div>

      <p className="mt-4 text-sm text-slate-400">{t("social.shareCodeDesc")}</p>
    </div>
  );
}
