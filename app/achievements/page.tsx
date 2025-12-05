"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "../features/user/context/UserContext";
import { useQuests } from "../features/quests/hooks/useQuests";
import { useAuth } from "../features/auth/context/AuthContext";
import { getAllAchievementProgress } from "../features/achievements/achievementEngine";
import type { AchievementType } from "../features/achievements/achievementDefinitions";
import PageSectionCard from "../components/ui/PageSectionCard";
import SectionHeader from "../components/ui/SectionHeader";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { useTranslation } from "../features/i18n/useTranslation";

export default function AchievementsPage() {
    const { user } = useUser();
    const { categories, loading } = useQuests();
    const { user: firebaseUser } = useAuth();
    const router = useRouter();
    const { t } = useTranslation();
    const [filterType, setFilterType] = useState<AchievementType | "all">("all");

    // Calculate custom categories count
    const customCategoriesCount = useMemo(
        () => categories.filter((c) => c.isCustom).length,
        [categories]
    );

    // Get achievement progress
    const achievementProgress = useMemo(() => {
        if (loading) return [];
        return getAllAchievementProgress(user, customCategoriesCount, []);
    }, [user, customCategoriesCount, loading]);

    // Filter achievements
    const filteredAchievements = useMemo(() => {
        if (filterType === "all") return achievementProgress;
        return achievementProgress.filter(
            (ap) => ap.achievement.type === filterType
        );
    }, [achievementProgress, filterType]);

    // Separate unlocked and locked achievements
    const unlockedAchievements = filteredAchievements.filter((ap) => ap.isUnlocked);
    const lockedAchievements = filteredAchievements.filter((ap) => !ap.isUnlocked);

    const filterOptions: { value: AchievementType | "all"; label: string; icon: string }[] = [
        { value: "all", label: "すべて", icon: "🏆" },
        { value: "streak", label: "ストリーク", icon: "🔥" },
        { value: "xp", label: "XP", icon: "⭐" },
        { value: "quests", label: "クエスト", icon: "📝" },
        { value: "categories", label: "カテゴリ", icon: "🎨" },
    ];

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return (
        <div className="min-h-screen pb-24 pt-20">
            <div className="mx-auto max-w-5xl space-y-8 px-4">
                {/* Header */}
                <SectionHeader
                    title="🏆 実績"
                    subtitle={`${unlockedAchievements.length} / ${achievementProgress.length} 達成`}
                />

                {/* Stats */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 p-6 ring-1 ring-amber-500/30">
                        <div className="text-sm font-medium text-amber-300">アンロック済み</div>
                        <div className="mt-2 text-3xl font-bold text-white">
                            {unlockedAchievements.length}
                        </div>
                    </div>
                    <div className="rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 p-6 ring-1 ring-blue-500/30">
                        <div className="text-sm font-medium text-blue-300">未アンロック</div>
                        <div className="mt-2 text-3xl font-bold text-white">
                            {lockedAchievements.length}
                        </div>
                    </div>
                    <div className="rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 p-6 ring-1 ring-purple-500/30">
                        <div className="text-sm font-medium text-purple-300">達成率</div>
                        <div className="mt-2 text-3xl font-bold text-white">
                            {Math.round((unlockedAchievements.length / achievementProgress.length) * 100)}%
                        </div>
                    </div>
                    <div className="rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 p-6 ring-1 ring-emerald-500/30">
                        <div className="text-sm font-medium text-emerald-300">総実績数</div>
                        <div className="mt-2 text-3xl font-bold text-white">
                            {achievementProgress.length}
                        </div>
                    </div>
                </div>

                {/* Filter */}
                <div className="flex flex-wrap gap-2">
                    {filterOptions.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => setFilterType(option.value)}
                            className={`rounded-xl px-4 py-2 text-sm font-bold transition-all ${filterType === option.value
                                    ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/25"
                                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                                }`}
                        >
                            {option.icon} {option.label}
                        </button>
                    ))}
                </div>

                {/* Unlocked Achievements */}
                {unlockedAchievements.length > 0 && (
                    <PageSectionCard title="🎉 アンロック済み">
                        <div className="grid gap-4 sm:grid-cols-2">
                            {unlockedAchievements.map((ap) => (
                                <div
                                    key={ap.achievement.id}
                                    className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 p-6 ring-1 ring-amber-500/30 transition-all hover:scale-[1.02] hover:shadow-xl"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-4xl ring-1 ring-amber-500/30">
                                            {ap.achievement.icon}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-bold text-white">
                                                {ap.achievement.name}
                                            </h3>
                                            <p className="mt-1 text-sm text-slate-400">
                                                {ap.achievement.description}
                                            </p>
                                            {ap.unlockedAt && (
                                                <p className="mt-2 text-xs text-amber-400">
                                                    {new Date(ap.unlockedAt).toLocaleDateString("ja-JP")} にアンロック
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="absolute right-4 top-4 text-2xl">✨</div>
                                </div>
                            ))}
                        </div>
                    </PageSectionCard>
                )}

                {/* Locked Achievements */}
                {lockedAchievements.length > 0 && (
                    <PageSectionCard title="🔒 未アンロック">
                        <div className="grid gap-4 sm:grid-cols-2">
                            {lockedAchievements.map((ap) => (
                                <div
                                    key={ap.achievement.id}
                                    className="group relative overflow-hidden rounded-2xl bg-slate-800/50 p-6 ring-1 ring-white/5 transition-all hover:bg-slate-800"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-slate-700 text-4xl opacity-50">
                                            {ap.achievement.icon}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-bold text-slate-300">
                                                {ap.achievement.name}
                                            </h3>
                                            <p className="mt-1 text-sm text-slate-500">
                                                {ap.achievement.description}
                                            </p>
                                            <div className="mt-3">
                                                <div className="flex items-center justify-between text-xs text-slate-400">
                                                    <span>
                                                        {ap.currentValue} / {ap.requiredValue}
                                                    </span>
                                                    <span>{Math.round(ap.progress)}%</span>
                                                </div>
                                                <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-700">
                                                    <div
                                                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all"
                                                        style={{ width: `${ap.progress}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </PageSectionCard>
                )}

                {/* Empty State */}
                {filteredAchievements.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="text-6xl">🏆</div>
                        <h3 className="mt-4 text-xl font-bold text-white">
                            実績が見つかりません
                        </h3>
                        <p className="mt-2 text-slate-400">
                            別のフィルターを試してみてください
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
