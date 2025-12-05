"use client";

import { useUser } from "../../features/user/context/UserContext";
import AdSense from "./AdSense";

interface AdBannerProps {
  adSlot: string;
  className?: string;
}

export default function AdBanner({ adSlot, className = "" }: AdBannerProps) {
  const { user } = useUser() as any;

  // Don't show ads for premium users
  const isPremium = user?.subscription?.tier === "premium";

  if (isPremium) {
    return null;
  }

  return (
    <div
      className={`rounded-xl bg-slate-900/30 p-4 ring-1 ring-white/5 ${className}`}
    >
      <div className="mb-2 text-center text-xs text-slate-500">広告</div>
      <AdSense adSlot={adSlot} />
    </div>
  );
}
