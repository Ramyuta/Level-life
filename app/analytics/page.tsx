"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "../features/i18n/useTranslation";
import { useQuests } from "../features/quests/hooks/useQuests";
import { useUser } from "../features/user/context/UserContext";
import { useLanguage } from "../features/i18n/LanguageContext";
import {
  AnalyticsAggregator,
  CategoryDistribution,
  HeatmapData,
  TrendData,
  StatSummary,
} from "../lib/analytics/aggregator";
import SectionHeader from "../components/ui/SectionHeader";
import CategoryDistributionChart from "../features/analytics/components/CategoryDistributionChart";
import ProductivityHeatmap from "../features/analytics/components/ProductivityHeatmap";
import TrendChart from "../features/analytics/components/TrendChart";
import StatSummaryCard from "../features/analytics/components/StatSummaryCard";
import { Loader2, Lock } from "lucide-react";
import { usePremium } from "../hooks/usePremium";
import PremiumModal from "../features/premium/components/PremiumModal";

export default function AnalyticsPage() {
  const { t } = useTranslation();
  const { quests, completions, categories, isLoading } = useQuests();
  const { user } = useUser();
  const { language } = useLanguage();
  const { canViewAdvancedAnalytics } = usePremium();
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  const [categoryData, setCategoryData] = useState<CategoryDistribution[]>([]);
  const [heatmapData, setHeatmapData] = useState<HeatmapData[]>([]);
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [summary, setSummary] = useState<StatSummary | null>(null);

  useEffect(() => {
    if (!isLoading && completions.length > 0) {
      // Aggregate Data
      const catDist = AnalyticsAggregator.getCategoryDistribution(
        completions,
        quests,
        categories
      );
      const heatmap = AnalyticsAggregator.getProductivityHeatmap(completions);
      const trends = AnalyticsAggregator.getTrends(completions, 30, language);
      const stats = AnalyticsAggregator.getSummary(
        completions,
        quests,
        user.streak.current
      );

      setCategoryData(catDist);
      setHeatmapData(heatmap);
      setTrendData(trends);
      setSummary(stats);
    }
  }, [isLoading, completions, quests, categories, user.streak, language]);

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 sm:px-6 lg:px-8 pb-20">
      <SectionHeader
        title={t("analytics.title")}
        subtitle={t("analytics.subtitle")}
      />

      {summary && <StatSummaryCard summary={summary} />}

      <div className="grid gap-8 md:grid-cols-2">
        {/* Category Distribution */}
        <CategoryDistributionChart data={categoryData} />

        {/* XP Trend - Locked for Free Users */}
        <div className="relative">
          {!canViewAdvancedAnalytics() && (
            <div
              className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-3xl bg-slate-900/60 backdrop-blur-sm transition-all hover:bg-slate-900/50 cursor-pointer"
              onClick={() => setShowPremiumModal(true)}
            >
              <div className="rounded-full bg-indigo-500/20 p-4 ring-1 ring-indigo-500/50 mb-4">
                <Lock className="h-8 w-8 text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                {t("analytics.premiumFeature")}
              </h3>
              <p className="text-sm text-slate-300 mb-4 text-center px-4">
                {t("analytics.unlockTrends")}
              </p>
              <button className="rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-indigo-500/25">
                {t("settings.upgrade")}
              </button>
            </div>
          )}
          <div
            className={
              !canViewAdvancedAnalytics() ? "blur-sm pointer-events-none" : ""
            }
          >
            <TrendChart data={trendData} />
          </div>
        </div>
      </div>

      {/* Productivity Heatmap - Locked for Free Users */}
      <div className="relative">
        {!canViewAdvancedAnalytics() && (
          <div
            className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-3xl bg-slate-900/60 backdrop-blur-sm transition-all hover:bg-slate-900/50 cursor-pointer"
            onClick={() => setShowPremiumModal(true)}
          >
            <div className="rounded-full bg-indigo-500/20 p-4 ring-1 ring-indigo-500/50 mb-4">
              <Lock className="h-8 w-8 text-indigo-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              {t("analytics.premiumFeature")}
            </h3>
            <p className="text-sm text-slate-300 mb-4 text-center px-4">
              {t("analytics.unlockHeatmap")}
            </p>
            <button className="rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-indigo-500/25">
              {t("settings.upgrade")}
            </button>
          </div>
        )}
        <div
          className={
            !canViewAdvancedAnalytics() ? "blur-sm pointer-events-none" : ""
          }
        >
          <ProductivityHeatmap data={heatmapData} />
        </div>
      </div>

      <PremiumModal
        isOpen={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
      />
    </div>
  );
}
