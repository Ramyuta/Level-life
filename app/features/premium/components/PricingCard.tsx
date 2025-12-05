"use client";

import { Check } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "../../i18n/useTranslation";

interface PricingCardProps {
  tier: "free" | "premium";
  price: string;
  features: string[];
  isCurrent?: boolean;
  onSelect?: () => void;
  recommended?: boolean;
}

export default function PricingCard({
  tier,
  price,
  features,
  isCurrent,
  onSelect,
  recommended,
}: PricingCardProps) {
  const { t } = useTranslation();
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={`relative flex flex-col rounded-3xl p-6 ring-1 transition-all ${
        recommended
          ? "bg-gradient-to-b from-indigo-500/20 to-purple-500/20 ring-indigo-500/50"
          : "bg-slate-900/60 ring-white/10"
      }`}
    >
      {recommended && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 px-3 py-1 text-xs font-bold text-white shadow-lg">
          RECOMMENDED
        </div>
      )}

      <div className="mb-4">
        <h3 className="text-lg font-bold capitalize text-white">{tier}</h3>
        <div className="mt-2 flex items-baseline gap-1">
          <span className="text-3xl font-bold text-white">{price}</span>
          {price !== "Free" && (
            <span className="text-sm text-slate-400">/month</span>
          )}
        </div>
      </div>

      <ul className="mb-8 flex-1 space-y-3">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3 text-sm">
            <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
              <Check className="h-3 w-3" />
            </div>
            <span className="text-slate-300">{feature}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={onSelect}
        disabled={isCurrent}
        className={`w-full rounded-xl py-3 font-bold transition-all active:scale-95 ${
          isCurrent
            ? "cursor-default bg-slate-800 text-slate-400"
            : recommended
              ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40"
              : "bg-white text-slate-900 hover:bg-slate-200"
        }`}
      >
        {isCurrent ? t("premium.currentPlan") : t("premium.upgradeNow")}
      </button>
    </motion.div>
  );
}
