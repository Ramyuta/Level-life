"use client";

import { useState } from "react";
import { useTranslation } from "../../i18n/useTranslation";

type TaskInputProps = {
  categories: string[];
  onAddTask: (title: string, xp: number, category: string) => void;
};

export default function TaskInput({ categories, onAddTask }: TaskInputProps) {
  const { t } = useTranslation();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(categories[0] || "");
  const [xp, setXp] = useState(10);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddTask(title.trim(), xp, category);
    setTitle("");
    setXp(10);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 space-y-4 rounded-2xl bg-slate-900/60 p-6 ring-1 ring-white/5"
    >
      <div>
        <label
          htmlFor="task-title"
          className="mb-2 block text-sm font-semibold text-slate-300"
        >
          {t("tasks.title")}
        </label>
        <input
          id="task-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={t("tasks.inputPlaceholder")}
          className="w-full rounded-lg bg-slate-800 px-4 py-2 text-slate-100 placeholder-slate-500 ring-1 ring-white/10 transition focus:outline-none focus:ring-2 focus:ring-emerald-400"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="task-category"
            className="mb-2 block text-sm font-semibold text-slate-300"
          >
            {t("tasks.category")}
          </label>
          <select
            id="task-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-lg bg-slate-800 px-4 py-2 text-slate-100 ring-1 ring-white/10 transition focus:outline-none focus:ring-2 focus:ring-emerald-400"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="task-xp"
            className="mb-2 block text-sm font-semibold text-slate-300"
          >
            {t("tasks.xpReward")}
          </label>
          <input
            id="task-xp"
            type="number"
            min="1"
            max="1000"
            value={xp}
            onChange={(e) => setXp(Number(e.target.value))}
            className="w-full rounded-lg bg-slate-800 px-4 py-2 text-slate-100 ring-1 ring-white/10 transition focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-3 font-bold text-white transition hover:from-emerald-600 hover:to-teal-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300"
      >
        ➕ {t("tasks.addTask")}
      </button>
    </form>
  );
}
