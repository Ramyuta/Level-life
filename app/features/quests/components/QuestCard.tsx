"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import type { Quest, Category } from "../../../lib/types";
import { useTranslation } from "../../i18n/useTranslation";
import SwipeableCard, {
  SwipeActions,
} from "../../../components/mobile/SwipeableCard";
import { useHaptic } from "../../../hooks/useHaptic";

interface QuestCardProps {
  quest: Quest;
  category?: Category;
  onComplete: (id: string) => void;
  onEdit?: (quest: Quest) => void;
  onDelete?: (questId: string) => void;
  onStartTimer?: (quest: Quest) => void;
}

function QuestCard({
  quest,
  onComplete,
  onEdit,
  onDelete,
  onStartTimer,
}: QuestCardProps) {
  const { t } = useTranslation();
  const { success, error: errorVibrate } = useHaptic();

  const priorityColors = {
    low: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    medium: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    high: "bg-rose-500/20 text-rose-300 border-rose-500/30",
  };

  const priorityLabels = {
    low: t("common.low"),
    medium: t("common.medium"),
    high: t("common.high"),
  };

  const scheduleLabels: Record<string, string> = {
    daily: t("common.daily"),
    weekly: t("common.weekly"),
    once: t("common.once"),
  };

  const handleComplete = () => {
    success();
    onComplete(quest.id);
  };

  const handleDelete = () => {
    if (onDelete) {
      errorVibrate();
      onDelete(quest.id);
    }
  };

  const cardContent = (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="group relative overflow-hidden rounded-2xl bg-slate-800/50 p-5 ring-1 ring-white/5 transition-all hover:bg-slate-800 hover:shadow-xl hover:ring-indigo-500/30"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <span
              className={`rounded-lg border px-2 py-0.5 text-xs font-bold ${
                priorityColors[quest.priority]
              }`}
            >
              {priorityLabels[quest.priority]}
            </span>
            <span className="rounded-lg border border-slate-700 bg-slate-800 px-2 py-0.5 text-xs text-slate-400">
              {scheduleLabels[quest.scheduleType]}
            </span>
            {quest.timerDurationMinutes && (
              <span className="flex items-center gap-1 text-xs text-slate-400">
                ⏱️ {quest.timerDurationMinutes}m
              </span>
            )}
          </div>

          <h3 className="text-lg font-bold text-white group-hover:text-indigo-300">
            {quest.title}
          </h3>

          {quest.description && (
            <p className="line-clamp-2 text-sm text-slate-400">
              {quest.description}
            </p>
          )}

          <div className="flex flex-wrap gap-2 pt-2">
            <span className="flex items-center gap-1 text-xs font-bold text-amber-400">
              ⚡ {quest.xpReward} XP
            </span>
            {quest.streak && quest.streak.current > 0 && (
              <span className="flex items-center gap-1 text-xs font-bold text-orange-400">
                🔥 {quest.streak.current} {t("questCard.streak")}
              </span>
            )}
            {quest.tags?.map((tag) => (
              <span key={tag} className="text-xs text-slate-500">
                #{tag}
              </span>
            ))}
          </div>
        </div>

        <button
          onClick={() => onComplete(quest.id)}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-700 text-2xl transition-all hover:scale-110 hover:bg-emerald-500 hover:shadow-lg hover:shadow-emerald-500/25 active:scale-90"
          title={t("questCard.complete")}
        >
          ✓
        </button>
      </div>

      {/* Hover Actions */}
      <div className="absolute right-4 top-4 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
        {onStartTimer && quest.timerDurationMinutes && (
          <button
            onClick={() => onStartTimer(quest)}
            className="rounded-lg bg-indigo-500/20 p-2 text-indigo-300 hover:bg-indigo-500 hover:text-white"
            title={t("questCard.startTimer")}
          >
            ⏱️
          </button>
        )}
        {onEdit && (
          <button
            onClick={() => onEdit(quest)}
            className="rounded-lg bg-slate-700 p-2 text-slate-400 hover:bg-slate-600 hover:text-white"
            title={t("questCard.edit")}
          >
            ✎
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(quest.id)}
            className="rounded-lg bg-rose-500/20 p-2 text-rose-300 hover:bg-rose-500 hover:text-white"
            title={t("questCard.delete")}
          >
            🗑️
          </button>
        )}
      </div>
    </motion.div>
  );

  return (
    <SwipeableCard
      leftAction={SwipeActions.complete(handleComplete)}
      rightAction={onDelete ? SwipeActions.delete(handleDelete) : undefined}
    >
      {cardContent}
    </SwipeableCard>
  );
}

export default memo(QuestCard);
