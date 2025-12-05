"use client";

import { useTranslation } from "../../i18n/useTranslation";
import { StatSummary } from "../../../lib/analytics/aggregator";
import { Trophy, CheckCircle, TrendingUp, Target } from "lucide-react";

interface Props {
  summary: StatSummary;
}

export default function StatSummaryCard({ summary }: Props) {
  const { t } = useTranslation();

  const items = [
    {
      label: t("analytics.totalXp"),
      value: summary.totalXp.toLocaleString(),
      icon: Trophy,
      color: "text-yellow-400",
      bg: "bg-yellow-400/10",
    },
    {
      label: t("analytics.completedQuests"),
      value: summary.completedQuests.toLocaleString(),
      icon: CheckCircle,
      color: "text-emerald-400",
      bg: "bg-emerald-400/10",
    },
    {
      label: t("analytics.currentStreak"),
      value: `${summary.currentStreak} ${t("dashboard.streakUnit")}`,
      icon: TrendingUp,
      color: "text-indigo-400",
      bg: "bg-indigo-400/10",
    },
    // Placeholder for future metric
    {
      label: t("analytics.completionRate"),
      value: "--%", // Not implemented yet
      icon: Target,
      color: "text-rose-400",
      bg: "bg-rose-400/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {items.map((item, index) => (
        <div
          key={index}
          className="flex flex-col items-center justify-center rounded-2xl bg-slate-900/60 p-4 text-center ring-1 ring-white/5 transition-all hover:bg-slate-800/60"
        >
          <div className={`mb-3 rounded-full p-3 ${item.bg}`}>
            <item.icon className={`h-6 w-6 ${item.color}`} />
          </div>
          <div className="text-2xl font-bold text-white">{item.value}</div>
          <div className="text-xs text-slate-400">{item.label}</div>
        </div>
      ))}
    </div>
  );
}
