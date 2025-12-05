"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useQuests } from "../features/quests/hooks/useQuests";
import { useToast } from "../context/ToastContext";
import { useConfirm } from "../context/ConfirmContext";
import QuestCard from "../features/quests/components/QuestCard";
import QuestForm from "../features/quests/components/QuestForm";
import CategoryManager from "../features/quests/components/CategoryManager";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import EmptyState from "../components/ui/EmptyState";
import FloatingXp from "../components/ui/FloatingXp";
import SectionHeader from "../components/ui/SectionHeader";
import PageSectionCard from "../components/ui/PageSectionCard";
import type { Quest, ScheduleType } from "../lib/types";
import { useTranslation } from "../features/i18n/useTranslation";
import dynamic from "next/dynamic";

const AIQuestGenerator = dynamic(
  () => import("../features/ai/components/AIQuestGenerator"),
  { ssr: false }
);

export default function QuestsPage() {
  const {
    quests,
    categories,
    loading,
    createQuest,
    updateQuest,
    deleteQuest,
    completeQuest,
    createCategory,
    updateCategory,
    deleteCategory,
  } = useQuests();
  const { showToast } = useToast();
  const { confirm } = useConfirm();
  const { t } = useTranslation();

  const [showQuestForm, setShowQuestForm] = useState(false);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [editingQuest, setEditingQuest] = useState<Quest | undefined>();
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterSchedule, setFilterSchedule] = useState<ScheduleType | "all">(
    "all"
  );
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [xpGained, setXpGained] = useState<number | null>(null);

  const handleCreateQuest = async (
    questData: Omit<Quest, "id" | "userId" | "createdAt" | "updatedAt">
  ) => {
    try {
      await createQuest(questData);
      setShowQuestForm(false);
      setEditingQuest(undefined);
      showToast(t("quests.created"), "success");
    } catch (error) {
      console.error("Failed to create quest:", error);
      showToast(t("errors.questCreateFailed"), "error");
    }
  };

  const handleUpdateQuest = async (
    questData: Omit<Quest, "id" | "userId" | "createdAt" | "updatedAt">
  ) => {
    if (!editingQuest) return;
    try {
      await updateQuest(editingQuest.id, questData);
      setShowQuestForm(false);
      setEditingQuest(undefined);
      showToast(t("quests.updated"), "success");
    } catch (error) {
      console.error("Failed to update quest:", error);
      showToast(t("errors.questUpdateFailed"), "error");
    }
  };

  const handleCompleteQuest = async (id: string) => {
    try {
      const {
        xpGained: gained,
        leveledUp,
        achievementsUnlocked,
      } = await completeQuest(id);
      setXpGained(gained);
      showToast(`${t("quests.completed")} +${gained} XP`, "success");

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
      showToast(t("errors.questCompleteFailed"), "error");
    }
  };

  const handleEditQuest = (quest: Quest) => {
    setEditingQuest(quest);
    setShowQuestForm(true);
  };

  const handleDeleteQuest = async (id: string) => {
    if (
      await confirm({
        title: t("quests.deleteTitle"),
        message: t("quests.deleteMessage"),
        confirmText: t("quests.delete"),
        isDangerous: true,
      })
    ) {
      try {
        await deleteQuest(id);
        showToast(t("quests.deleted"), "info");
      } catch (error) {
        console.error("Failed to delete quest:", error);
        showToast(t("errors.questDeleteFailed"), "error");
      }
    }
  };

  // Filter quests
  const filteredQuests = quests.filter((quest) => {
    if (quest.status === "archived") return false;
    if (filterCategory !== "all" && quest.category !== filterCategory)
      return false;
    if (filterSchedule !== "all" && quest.scheduleType !== filterSchedule)
      return false;
    return true;
  });

  const activeQuests = filteredQuests.filter((q) => q.status === "active");
  const completedQuests = filteredQuests.filter(
    (q) => q.status === "completed"
  );

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <SectionHeader
        title={t("quests.title")}
        subtitle={t("quests.subtitle")}
        action={
          <div className="flex gap-3">
            <AIQuestGenerator />
            <button
              onClick={() => {
                setEditingQuest(undefined);
                setShowQuestForm(true);
              }}
              className="rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-3 font-bold text-white shadow-lg ring-1 ring-white/20 transition-all hover:scale-105 hover:shadow-indigo-500/50"
            >
              ➕ {t("quests.newQuest")}
            </button>
          </div>
        }
      />

      {/* Filters & Category Manager */}
      <PageSectionCard title={t("quests.filter")}>
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Category Filter */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              {t("quests.category")}
            </label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full rounded-xl bg-slate-700/80 px-4 py-2 text-slate-50 ring-1 ring-white/20 transition-colors focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">{t("quests.all")}</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Schedule Filter */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              {t("quests.schedule")}
            </label>
            <select
              value={filterSchedule}
              onChange={(e) =>
                setFilterSchedule(e.target.value as ScheduleType | "all")
              }
              className="w-full rounded-xl bg-slate-700/80 px-4 py-2 text-slate-50 ring-1 ring-white/20 transition-colors focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">{t("quests.all")}</option>
              <option value="once">{t("common.once")}</option>
              <option value="daily">{t("common.daily")}</option>
              <option value="weekly">{t("common.weekly")}</option>
            </select>
          </div>
        </div>

        {/* Category Manager Button */}
        <button
          onClick={() => setShowCategoryManager(!showCategoryManager)}
          className="mt-4 w-full rounded-xl bg-slate-700/80 px-4 py-2 text-sm font-medium text-slate-200 ring-1 ring-white/20 transition-all hover:bg-slate-700"
        >
          {showCategoryManager
            ? t("quests.closeCategoryManager")
            : t("quests.categoryManager")}
        </button>
      </PageSectionCard>

      {/* Category Manager */}
      {showCategoryManager && (
        <CategoryManager
          categories={categories}
          onAdd={createCategory}
          onUpdate={updateCategory}
          onDelete={deleteCategory}
        />
      )}

      {/* Quest Form Modal */}
      {showQuestForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-slate-900 p-6 shadow-2xl ring-1 ring-white/10">
            <h2 className="mb-6 text-2xl font-bold text-white">
              {editingQuest ? t("quests.editQuest") : t("quests.newQuest")}
            </h2>
            <QuestForm
              categories={categories}
              onSubmit={editingQuest ? handleUpdateQuest : handleCreateQuest}
              onCancel={() => {
                setShowQuestForm(false);
                setEditingQuest(undefined);
              }}
              initialData={editingQuest}
            />
          </div>
        </div>
      )}

      {/* Active Quests */}
      <PageSectionCard
        title={`${t("quests.activeQuests")} (${activeQuests.length})`}
      >
        {activeQuests.length === 0 ? (
          <EmptyState
            icon="✨"
            title={t("quests.empty")}
            description={t("dashboard.noQuestsDesc")}
            actionLabel={t("quests.newQuest")}
            onAction={() => {
              setEditingQuest(undefined);
              setShowQuestForm(true);
            }}
          />
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {activeQuests.map((quest) => (
                <QuestCard
                  key={quest.id}
                  quest={quest}
                  category={categories.find((c) => c.id === quest.category)}
                  onComplete={handleCompleteQuest}
                  onEdit={handleEditQuest}
                  onDelete={handleDeleteQuest}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </PageSectionCard>

      {/* Completed Quests */}
      {completedQuests.length > 0 && (
        <PageSectionCard
          title={`${t("quests.completedQuests")} (${completedQuests.length})`}
        >
          <div className="space-y-3 opacity-60">
            {completedQuests.map((quest) => (
              <QuestCard
                key={quest.id}
                quest={quest}
                category={categories.find((c) => c.id === quest.category)}
                onComplete={handleCompleteQuest}
              />
            ))}
          </div>
        </PageSectionCard>
      )}

      {/* XP Gain Animation */}
      {xpGained && <FloatingXp xp={xpGained} />}

      {/* Level Up Notification */}
      {showLevelUp && (
        <div className="pointer-events-none fixed inset-x-4 top-24 z-50 mx-auto max-w-md rounded-3xl bg-gradient-to-r from-amber-400 via-rose-400 to-indigo-400 px-6 py-4 text-center text-lg font-bold text-slate-900 shadow-2xl">
          🎉 {t("dashboard.levelUp")} 🎉
        </div>
      )}
    </div>
  );
}
