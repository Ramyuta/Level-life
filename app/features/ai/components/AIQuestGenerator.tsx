"use client";

import { useState } from "react";
import { Sparkles, Loader2, X } from "lucide-react";
import { getGeminiService } from "../../../lib/services/gemini";
import { useAuth } from "../../auth/context/AuthContext";
import { useQuests } from "../../quests/hooks/useQuests";
import { useToast } from "../../../context/ToastContext";
import { useTranslation } from "../../i18n/useTranslation";
import type { Quest } from "../../../lib/types";

export default function AIQuestGenerator() {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const { user } = useAuth();
  const { createQuest } = useQuests();

  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [goal, setGoal] = useState("");
  const [duration, setDuration] = useState("1 month");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">(
    "medium"
  );
  const [generatedQuests, setGeneratedQuests] = useState<Quest[]>([]);
  const [selectedQuests, setSelectedQuests] = useState<Set<string>>(new Set());

  const handleGenerate = async () => {
    if (!goal.trim()) {
      showToast("Please enter a goal", "error");
      return;
    }

    setIsGenerating(true);
    try {
      const gemini = getGeminiService();
      const quests = await gemini.generateQuests({
        goal,
        duration,
        difficulty,
      });

      setGeneratedQuests(quests);
      setSelectedQuests(new Set(quests.map((q) => q.id)));
      showToast(`Generated ${quests.length} quests!`, "success");
    } catch (error: any) {
      console.error("Failed to generate quests:", error);
      showToast(error.message || "Failed to generate quests", "error");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    const questsToSave = generatedQuests.filter((q) =>
      selectedQuests.has(q.id)
    );

    if (questsToSave.length === 0) {
      showToast("Please select at least one quest", "error");
      return;
    }

    try {
      for (const quest of questsToSave) {
        // eslint-disable-next-line
        const { id, userId, createdAt, updatedAt, ...questData } = quest;
        await createQuest(questData);
      }

      showToast(`Added ${questsToSave.length} quests!`, "success");
      setIsOpen(false);
      setGoal("");
      setGeneratedQuests([]);
      setSelectedQuests(new Set());
    } catch (error) {
      console.error("Failed to save quests:", error);
      showToast("Failed to save quests", "error");
    }
  };

  const toggleQuest = (questId: string) => {
    const newSelected = new Set(selectedQuests);
    if (newSelected.has(questId)) {
      newSelected.delete(questId);
    } else {
      newSelected.add(questId);
    }
    setSelectedQuests(newSelected);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 text-sm font-medium text-white transition-all hover:from-purple-600 hover:to-pink-600"
      >
        <Sparkles className="h-4 w-4" />
        AI Quest Generator
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-3xl bg-slate-900 p-6 shadow-2xl ring-1 ring-white/10">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-gradient-to-r from-purple-500 to-pink-500 p-2">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">
              AI Quest Generator
            </h2>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {generatedQuests.length === 0 ? (
          /* Input Form */
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                What&apos;s your goal?
              </label>
              <textarea
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="e.g., Run a marathon in 3 months, Learn Japanese, Build a side project..."
                className="w-full rounded-xl bg-slate-800 px-4 py-3 text-white placeholder-slate-500 ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Duration
                </label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full rounded-xl bg-slate-800 px-4 py-3 text-white ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="1 week">1 Week</option>
                  <option value="2 weeks">2 Weeks</option>
                  <option value="1 month">1 Month</option>
                  <option value="3 months">3 Months</option>
                  <option value="6 months">6 Months</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Difficulty
                </label>
                <select
                  value={difficulty}
                  onChange={(e) =>
                    setDifficulty(e.target.value as "easy" | "medium" | "hard")
                  }
                  className="w-full rounded-xl bg-slate-800 px-4 py-3 text-white ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating || !goal.trim()}
              className="w-full rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 font-semibold text-white transition-all hover:from-purple-600 hover:to-pink-600 disabled:opacity-50"
            >
              {isGenerating ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Generating...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Generate Quests
                </span>
              )}
            </button>
          </div>
        ) : (
          /* Generated Quests List */
          <div className="space-y-4">
            <p className="text-sm text-slate-400">
              Select the quests you want to add ({selectedQuests.size}/
              {generatedQuests.length} selected)
            </p>

            <div className="max-h-96 space-y-3 overflow-y-auto">
              {generatedQuests.map((quest) => (
                <div
                  key={quest.id}
                  onClick={() => toggleQuest(quest.id)}
                  className={`cursor-pointer rounded-xl p-4 ring-1 transition-all ${
                    selectedQuests.has(quest.id)
                      ? "bg-purple-500/10 ring-purple-500/50"
                      : "bg-slate-800 ring-white/10 hover:bg-slate-700"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={selectedQuests.has(quest.id)}
                      onChange={() => toggleQuest(quest.id)}
                      className="mt-1 h-5 w-5 rounded border-slate-600 bg-slate-700 text-purple-500 focus:ring-2 focus:ring-purple-500"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-white">
                        {quest.title}
                      </h3>
                      {quest.description && (
                        <p className="mt-1 text-sm text-slate-400">
                          {quest.description}
                        </p>
                      )}
                      <div className="mt-2 flex items-center gap-3 text-xs text-slate-500">
                        <span className="rounded-full bg-slate-700 px-2 py-1">
                          {quest.category}
                        </span>
                        <span>{quest.xpReward} XP</span>
                        <span className="capitalize">{quest.priority}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setGeneratedQuests([]);
                  setSelectedQuests(new Set());
                }}
                className="flex-1 rounded-xl bg-slate-800 px-6 py-3 font-semibold text-white transition-all hover:bg-slate-700"
              >
                Regenerate
              </button>
              <button
                onClick={handleSave}
                disabled={selectedQuests.size === 0}
                className="flex-1 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 font-semibold text-white transition-all hover:from-purple-600 hover:to-pink-600 disabled:opacity-50"
              >
                Add {selectedQuests.size} Quest
                {selectedQuests.size !== 1 ? "s" : ""}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
