"use client";

import { useState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "../features/auth/context/AuthContext";
import ProgressBar from "../components/ui/ProgressBar";
import { useUser } from "../features/user/context/UserContext";
import { useQuests } from "../features/quests/hooks/useQuests";
import { useTimerStore } from "../lib/timerStore";
import { MOTIVATION_MESSAGES } from "../lib/constants";
import QuestCard from "../features/quests/components/QuestCard";
import Timer from "../features/timer/components/Timer";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import EmptyState from "../components/ui/EmptyState";
import FloatingXp from "../components/ui/FloatingXp";
import { useToast } from "../context/ToastContext";
import SectionHeader from "../components/ui/SectionHeader";
import StatCard from "../components/ui/StatCard";
import PageSectionCard from "../components/ui/PageSectionCard";
import { useTranslation } from "../features/i18n/useTranslation";
import WeeklyStatsCard from "../features/analytics/components/WeeklyStatsCard";
import FloatingActionButton from "../components/mobile/FloatingActionButton";
import Avatar from "../components/ui/Avatar";
import OnboardingModal from "../components/onboarding/OnboardingModal";
import AdBanner from "../components/ads/AdBanner";
import WeeklyReport from "../components/reports/WeeklyReport";
import dynamic from "next/dynamic";

const AIAdvisor = dynamic(() => import("../features/ai/components/AIAdvisor"), {
  ssr: false,
});

export default function DashboardPage() {
  const { userProfile } = useAuth();
  const { user, addXp } = useUser();
  const { getTodaysQuests, completeQuest, categories, loading } = useQuests();
  const { activeSession } = useTimerStore();
  const router = useRouter();
  const { showToast } = useToast();
  const { t } = useTranslation();
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [selectedQuest, setSelectedQuest] = useState<any>(null);
  const [xpGained, setXpGained] = useState<number | null>(null);

  const today = new Date().toISOString().slice(0, 10);

  const motivation = useMemo(() => {
    const base = new Date(`${today}T00:00:00`);
    const i =
      Math.abs(Math.floor(base.getTime() / 86400000)) %
      MOTIVATION_MESSAGES.length;
    return t(MOTIVATION_MESSAGES[i] as any);
  }, [today, t]);

  const progress = user.nextLevelXp ? (user.xp / user.nextLevelXp) * 100 : 0;
  const remaining = Math.max(0, Math.round(user.nextLevelXp - user.xp));

  const todaysQuests = getTodaysQuests();

  const handleCompleteQuest = async (id: string) => {
    try {
      const {
        leveledUp,
        xpGained: gained,
        achievementsUnlocked,
      } = await completeQuest(id);
      setXpGained(gained);

      if (leveledUp) {
        setShowLevelUp(true);
        setTimeout(() => setShowLevelUp(false), 2000);
      }

      // Show achievement unlock notifications
      if (achievementsUnlocked && achievementsUnlocked.length > 0) {
        for (const achievementName of achievementsUnlocked) {
          showToast(
            `🏆 ${t("dashboard.newAchievement")}：${achievementName}！`,
            "success"
          );
        }
      }

      setTimeout(() => setXpGained(null), 2000);
    } catch (error) {
      console.error("Failed to complete quest:", error);
    }
  };

  const handleStartTimer = (quest: any) => {
    setSelectedQuest(quest);
    setShowTimer(true);
  };

  return (
    <div className="min-h-screen pb-24 pt-20">
      <div className="mx-auto max-w-5xl space-y-8 px-4">
        {/* Welcome Header */}
        <SectionHeader
          title={t("dashboard.title")}
          subtitle={
            userProfile
              ? `${t("dashboard.subtitle")}, ${userProfile.displayName || t("settings.guest")}さん`
              : t("dashboard.subtitle")
          }
          action={
            userProfile && (
              <button
                onClick={() => router.push("/settings")}
                className="transition-transform hover:scale-105"
              >
                <Avatar
                  customAvatar={userProfile.customAvatar}
                  avatarId={userProfile.avatarId}
                  photoURL={userProfile.photoURL}
                  name={userProfile.displayName}
                  size="lg"
                />
              </button>
            )
          }
        />

        {/* Level & XP Card */}
        <PageSectionCard className="shadow-2xl">
          <div className="mb-4 flex items-baseline justify-between">
            <div className="flex items-baseline gap-3">
              <p className="text-4xl font-bold text-white md:text-5xl">
                {t("dashboard.level")} {user.level}
              </p>
              <div className="rounded-full bg-indigo-500/20 px-3 py-1 ring-1 ring-indigo-500/30">
                <p className="text-sm font-semibold text-indigo-300">
                  {user.xp} / {user.nextLevelXp} XP
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs font-medium text-slate-400">
                {t("dashboard.nextLevel")}
              </p>
              <p className="text-lg font-bold text-emerald-400">
                {remaining} XP
              </p>
            </div>
          </div>
          <ProgressBar progress={progress} />
        </PageSectionCard>

        {/* Today's Progress */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label={t("dashboard.todayXp")}
            value={user.stats.todayXp}
            color="indigo"
          />
          <StatCard
            label={t("dashboard.streak")}
            value={`${user.streak.current}${t("dashboard.streakUnit")}`}
            color="emerald"
          />
          <StatCard
            label={t("dashboard.totalXp")}
            value={user.stats.totalXpEarned}
            color="amber"
          />
          <StatCard
            label={t("dashboard.completedQuests")}
            value={user.stats.questsCompleted}
            color="rose"
          />
        </div>

        {/* Weekly Stats */}
        <WeeklyStatsCard />

        {/* AI Advisor */}
        <AIAdvisor />

        {/* Motivation Message */}
        <div className="rounded-2xl bg-gradient-to-r from-indigo-500/20 to-purple-500/20 p-6 ring-1 ring-indigo-500/30 backdrop-blur-sm">
          <p className="text-center text-lg font-medium text-slate-200">
            {motivation}
          </p>
        </div>

        {/* Today's Quests */}
        <PageSectionCard title={t("dashboard.todaysQuests")}>
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <LoadingSpinner />
            </div>
          ) : todaysQuests.length === 0 ? (
            <EmptyState
              icon="🎯"
              title={t("dashboard.noQuestsTitle")}
              description={t("dashboard.noQuestsDesc")}
              actionLabel={t("dashboard.createQuest")}
              onAction={() => router.push("/quests")}
            />
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {todaysQuests.map((quest) => (
                  <QuestCard
                    key={quest.id}
                    quest={quest}
                    category={categories.find((c) => c.id === quest.category)}
                    onComplete={handleCompleteQuest}
                    onStartTimer={handleStartTimer}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </PageSectionCard>

        {/* Active Timer Indicator */}
        {activeSession && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-6 right-6 z-40 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 p-4 shadow-2xl ring-1 ring-white/20"
          >
            <p className="text-sm font-semibold text-white">
              Timer Active: {activeSession.questTitle}
            </p>
          </motion.div>
        )}

        {/* XP Gain Animation */}
        <AnimatePresence>
          {xpGained && <FloatingXp xp={xpGained} />}
        </AnimatePresence>

        {/* Level Up Modal */}
        {showLevelUp && (
          <div className="pointer-events-none fixed inset-x-4 top-24 z-50 mx-auto max-w-md rounded-3xl bg-gradient-to-r from-amber-400 via-rose-400 to-indigo-400 px-6 py-4 text-center text-lg font-bold text-slate-900 shadow-2xl">
            🎉 {t("dashboard.levelUp")} 🎉
          </div>
        )}

        {/* Ad Banner */}
        <AdBanner adSlot="1234567890" className="mt-8" />
      </div>

      {/* Onboarding Modal */}
      <OnboardingModal />

      {/* Floating Action Button for Mobile */}
      <FloatingActionButton
        onClick={() => router.push("/quests")}
        label="Add Quest"
      />
    </div>
  );
}