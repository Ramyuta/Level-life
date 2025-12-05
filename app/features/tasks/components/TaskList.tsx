"use client";

import { useState } from "react";
import type { Task } from "../../../lib/types";
import { useTranslation } from "../../i18n/useTranslation";

type TaskListProps = {
  tasks: Task[];
  onToggle: (taskId: string) => void;
  onDelete: (taskId: string) => void;
};

export default function TaskList({ tasks, onToggle, onDelete }: TaskListProps) {
  const { t } = useTranslation();
  const [editingId, setEditingId] = useState<string | null>(null);

  if (!tasks.length) {
    return (
      <p className="rounded-2xl bg-slate-900/60 p-6 text-center text-sm text-slate-400 ring-1 ring-white/5">
        {t("tasks.emptyState")}
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {tasks.map((task) => {
        const isCompleted = task.status === "done";
        const isEditing = editingId === task.id;

        return (
          <li
            key={task.id}
            className="flex flex-col gap-2 rounded-2xl bg-slate-900/70 p-4 ring-1 ring-white/5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex-1">
              <p
                className={`font-semibold text-slate-100 ${isCompleted ? "line-through text-slate-500" : ""}`}
              >
                {task.title}
              </p>
              <p className="text-xs text-slate-400">
                {task.category} ・ {task.xpReward} XP
                {task.priority &&
                  ` ・ ${task.priority === "high" ? "🔴" : task.priority === "medium" ? "🟡" : "🟢"}`}
              </p>
            </div>

            <div className="flex gap-2 text-sm">
              {!isCompleted ? (
                <button
                  onClick={() => onToggle(task.id)}
                  className="rounded-lg bg-emerald-500 px-3 py-1 font-semibold text-white transition hover:bg-emerald-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300"
                >
                  ✅ {t("tasks.complete")}
                </button>
              ) : null}

              <button
                onClick={() => onDelete(task.id)}
                className="rounded-lg bg-rose-500 px-3 py-1 font-semibold text-white transition hover:bg-rose-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-300"
              >
                ❌ {t("tasks.delete")}
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
