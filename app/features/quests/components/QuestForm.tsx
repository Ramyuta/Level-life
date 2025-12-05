"use client";

import { useState, useEffect } from "react";
import type { Quest, QuestCategory, ScheduleType } from "../../../lib/types";
import { useTranslation } from "../../i18n/useTranslation";
import { calculateQuestXP, getXPBreakdown } from "../../../lib/xpCalculator";

interface QuestFormProps {
  categories: QuestCategory[];
  onSubmit: (
    data: Omit<Quest, "id" | "userId" | "createdAt" | "updatedAt">
  ) => void;
  onCancel: () => void;
  initialData?: Quest;
}

export default function QuestForm({
  categories,
  onSubmit,
  onCancel,
  initialData,
}: QuestFormProps) {
  const { t } = useTranslation();
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(
    initialData?.description || ""
  );
  const [category, setCategory] = useState(
    initialData?.category || categories[0]?.id || "health"
  );
  const [priority, setPriority] = useState<"low" | "medium" | "high">(
    initialData?.priority || "medium"
  );
  const [scheduleType, setScheduleType] = useState<ScheduleType>(
    initialData?.scheduleType || "daily"
  );
  const [selectedDays, setSelectedDays] = useState<number[]>(
    initialData?.scheduleDays || [0, 1, 2, 3, 4, 5, 6]
  );
  const [timerDuration, setTimerDuration] = useState(
    initialData?.timerDurationMinutes || 0
  );
  const [tags, setTags] = useState<string[]>(initialData?.tags || []);
  const [tagInput, setTagInput] = useState("");
  const [note, setNote] = useState(initialData?.note || "");

  // Calculate XP automatically based on difficulty and timer
  const calculatedXP = calculateQuestXP(
    priority,
    timerDuration > 0 ? timerDuration : undefined
  );
  const xpBreakdown = getXPBreakdown(
    priority,
    timerDuration > 0 ? timerDuration : undefined
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSubmit({
      title,
      description,
      category,
      priority,
      scheduleType,
      scheduleDays: scheduleType === "weekly" ? selectedDays : undefined,
      xpReward: calculatedXP,
      timerDurationMinutes: timerDuration > 0 ? timerDuration : undefined,
      tags,
      note,
      status: initialData?.status || "active",
      streak: initialData?.streak || { current: 0, longest: 0 },
    });
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const toggleDay = (day: number) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day].sort());
    }
  };

  const weekDays = [
    { label: t("common.days.sun"), value: 0 },
    { label: t("common.days.mon"), value: 1 },
    { label: t("common.days.tue"), value: 2 },
    { label: t("common.days.wed"), value: 3 },
    { label: t("common.days.thu"), value: 4 },
    { label: t("common.days.fri"), value: 5 },
    { label: t("common.days.sat"), value: 6 },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-300">
          {t("questForm.title")} <span className="text-rose-500">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-xl bg-slate-800 px-4 py-3 text-white ring-1 ring-white/10 transition focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder={t("questForm.titlePlaceholder")}
          required
        />
      </div>

      {/* Description */}
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-300">
          {t("questForm.description")}
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="h-24 w-full resize-none rounded-xl bg-slate-800 px-4 py-3 text-white ring-1 ring-white/10 transition focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder={t("questForm.descriptionPlaceholder")}
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {/* Category */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            {t("questForm.category")}
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-xl bg-slate-800 px-4 py-3 text-white ring-1 ring-white/10 transition focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.icon} {t(cat.name as any)}
              </option>
            ))}
          </select>
        </div>

        {/* Priority */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            {t("questForm.priority")}
          </label>
          <select
            value={priority}
            onChange={(e) =>
              setPriority(e.target.value as "low" | "medium" | "high")
            }
            className="w-full rounded-xl bg-slate-800 px-4 py-3 text-white ring-1 ring-white/10 transition focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="low">{t("common.low")}</option>
            <option value="medium">{t("common.medium")}</option>
            <option value="high">{t("common.high")}</option>
          </select>
        </div>
      </div>

      {/* Schedule */}
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-300">
          {t("questForm.schedule")}
        </label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={scheduleType === "daily"}
              onChange={() => setScheduleType("daily")}
              className="h-4 w-4 text-indigo-500 focus:ring-indigo-500"
            />
            <span className="text-slate-300">{t("common.daily")}</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={scheduleType === "weekly"}
              onChange={() => setScheduleType("weekly")}
              className="h-4 w-4 text-indigo-500 focus:ring-indigo-500"
            />
            <span className="text-slate-300">{t("common.weekly")}</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={scheduleType === "once"}
              onChange={() => setScheduleType("once")}
              className="h-4 w-4 text-indigo-500 focus:ring-indigo-500"
            />
            <span className="text-slate-300">{t("common.once")}</span>
          </label>
        </div>

        {scheduleType === "weekly" && (
          <div className="mt-4 flex flex-wrap gap-2">
            {weekDays.map((day) => (
              <button
                key={day.value}
                type="button"
                onClick={() => toggleDay(day.value)}
                className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold transition-all ${
                  selectedDays.includes(day.value)
                    ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/25"
                    : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                }`}
              >
                {day.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {/* Calculated XP Display */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            獲得XP（自動計算）
          </label>
          <div className="rounded-xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 p-4 ring-1 ring-indigo-500/30">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-white">
                {calculatedXP}
              </span>
              <span className="text-sm text-slate-400">XP</span>
            </div>
            <div className="mt-2 space-y-1 text-xs text-slate-400">
              <div className="flex justify-between">
                <span>
                  基本XP (
                  {priority === "low"
                    ? "低"
                    : priority === "medium"
                      ? "中"
                      : "高"}
                  )
                </span>
                <span className="font-bold text-slate-300">
                  {xpBreakdown.baseXP}
                </span>
              </div>
              {xpBreakdown.timerBonus > 0 && (
                <div className="flex justify-between">
                  <span>タイマーボーナス ({timerDuration}分)</span>
                  <span className="font-bold text-green-400">
                    +{xpBreakdown.timerBonus}
                  </span>
                </div>
              )}
              <div className="mt-2 border-t border-white/10 pt-2 flex justify-between">
                <span>ソーシャルポイント</span>
                <span className="font-bold text-purple-400">
                  {xpBreakdown.socialPoints} SP
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Timer Duration */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            {t("questForm.timerDuration")}
          </label>
          <input
            type="number"
            min="0"
            value={timerDuration}
            onChange={(e) => setTimerDuration(parseInt(e.target.value) || 0)}
            className="w-full rounded-xl bg-slate-800 px-4 py-3 text-white ring-1 ring-white/10 transition focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder={t("questForm.timerPlaceholder")}
          />
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-300">
          {t("questForm.tags")}
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && (e.preventDefault(), handleAddTag())
            }
            className="flex-1 rounded-xl bg-slate-800 px-4 py-3 text-white ring-1 ring-white/10 transition focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder={t("questForm.tagsPlaceholder")}
          />
          <button
            type="button"
            onClick={handleAddTag}
            className="rounded-xl bg-slate-700 px-6 py-3 font-bold text-white transition hover:bg-slate-600"
          >
            {t("questForm.add")}
          </button>
        </div>
        {tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-2 rounded-lg bg-indigo-500/20 px-3 py-1 text-sm text-indigo-300"
              >
                #{tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="text-indigo-400 hover:text-indigo-200"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Notes */}
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-300">
          {t("questForm.note")}
        </label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="h-20 w-full resize-none rounded-xl bg-slate-800 px-4 py-3 text-white ring-1 ring-white/10 transition focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder={t("questForm.notePlaceholder")}
        />
      </div>

      {/* Actions */}
      <div className="flex gap-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 rounded-xl bg-slate-800 px-4 py-3 font-bold text-slate-300 transition hover:bg-slate-700"
        >
          {t("questForm.cancel")}
        </button>
        <button
          type="submit"
          className="flex-1 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-3 font-bold text-white shadow-lg shadow-indigo-500/25 transition hover:scale-[1.02] hover:shadow-indigo-500/50"
        >
          {t("questForm.save")}
        </button>
      </div>
    </form>
  );
}
