"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { QuestCategory } from "../../../lib/types";
import { useToast } from "../../../context/ToastContext";
import { useConfirm } from "../../../context/ConfirmContext";
import { useTranslation } from "../../i18n/useTranslation";
import { usePremium } from "../../../hooks/usePremium";
import PremiumModal from "../../premium/components/PremiumModal";

interface CategoryManagerProps {
  categories: QuestCategory[];
  onAdd: (
    category: Omit<QuestCategory, "id" | "userId">
  ) => Promise<QuestCategory>;
  onUpdate: (id: string, updates: Partial<QuestCategory>) => Promise<void>;
  onDelete: (categoryId: string) => Promise<void>;
}

export default function CategoryManager({
  categories,
  onAdd,
  onUpdate,
  onDelete,
}: CategoryManagerProps) {
  const { showToast } = useToast();
  const { confirm } = useConfirm();
  const { t } = useTranslation();
  const { canAddCategory } = usePremium();
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    color: "#6366f1",
    icon: "📝",
    defaultXp: 10,
  });

  const resetForm = () => {
    setFormData({
      name: "",
      color: "#6366f1",
      icon: "📝",
      defaultXp: 10,
    });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    try {
      if (editingId) {
        await onUpdate(editingId, formData);
        showToast(t("categoryManager.toast.updateSuccess"), "success");
      } else {
        // Check premium limit
        if (!canAddCategory(categories.length)) {
          setShowPremiumModal(true);
          return;
        }

        await onAdd({ ...formData, isCustom: true });
        showToast(t("categoryManager.toast.createSuccess"), "success");
      }
      resetForm();
    } catch (error) {
      console.error("Failed to save category:", error);
    }
  };

  const startEdit = (category: QuestCategory) => {
    setFormData({
      name: category.name,
      color: category.color,
      icon: category.icon,
      defaultXp: category.defaultXp,
    });
    setEditingId(category.id);
    setIsAdding(true);
  };

  const handleDelete = async (id: string) => {
    if (
      await confirm({
        title: t("categoryManager.confirm.deleteTitle"),
        message: t("categoryManager.confirm.deleteMessage"),
        confirmText: t("categoryManager.confirm.deleteButton"),
        isDangerous: true,
      })
    ) {
      try {
        await onDelete(id);
        showToast(t("categoryManager.toast.deleteSuccess"), "info");
      } catch (error) {
        console.error("Failed to delete category:", error);
      }
    }
  };

  const colors = [
    "#6366f1", // Indigo
    "#ec4899", // Pink
    "#8b5cf6", // Violet
    "#10b981", // Emerald
    "#f59e0b", // Amber
    "#ef4444", // Red
    "#3b82f6", // Blue
    "#14b8a6", // Teal
  ];

  const icons = ["📝", "💪", "🧠", "🎨", "💰", "🏠", "👥", "❤️", "⭐", "🎓"];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white">
          {t("categoryManager.title")}
        </h3>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="rounded-xl bg-indigo-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-indigo-600"
          >
            {t("categoryManager.add")}
          </button>
        )}
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.form
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            onSubmit={handleSubmit}
            className="overflow-hidden rounded-xl bg-slate-800 p-4 ring-1 ring-white/10"
          >
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm text-slate-400">
                  {t("categoryManager.name")}
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full rounded-lg bg-slate-900 px-3 py-2 text-white ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder={t("categoryManager.namePlaceholder")}
                  autoFocus
                />
              </div>

              <div>
                <label className="mb-1 block text-sm text-slate-400">
                  {t("categoryManager.icon")}
                </label>
                <div className="flex flex-wrap gap-2">
                  {icons.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setFormData({ ...formData, icon })}
                      className={`flex h-10 w-10 items-center justify-center rounded-lg text-xl transition ${
                        formData.icon === icon
                          ? "bg-slate-700 ring-2 ring-indigo-500"
                          : "bg-slate-900 hover:bg-slate-700"
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm text-slate-400">
                  {t("categoryManager.color")}
                </label>
                <div className="flex flex-wrap gap-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData({ ...formData, color })}
                      className={`h-8 w-8 rounded-full ring-2 ring-offset-2 ring-offset-slate-800 transition ${
                        formData.color === color
                          ? "ring-white"
                          : "ring-transparent hover:scale-110"
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-lg px-4 py-2 text-sm font-bold text-slate-400 hover:text-white"
                >
                  {t("categoryManager.cancel")}
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-bold text-white hover:bg-indigo-600"
                >
                  {editingId
                    ? t("categoryManager.update")
                    : t("categoryManager.create")}
                </button>
              </div>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="grid gap-3 sm:grid-cols-2">
        {categories.map((category) => (
          <div
            key={category.id}
            className="group flex items-center justify-between rounded-xl bg-slate-800/50 p-3 ring-1 ring-white/5 transition hover:bg-slate-800"
          >
            <div className="flex items-center gap-3">
              <span
                className="flex h-10 w-10 items-center justify-center rounded-lg text-xl"
                style={{ backgroundColor: `${category.color}20` }}
              >
                {category.icon}
              </span>
              <div>
                <h4 className="font-bold text-white">
                  {t(category.name as any)}
                </h4>
                <p className="text-xs text-slate-400">
                  {t("categoryManager.defaultXp")}: {category.defaultXp} XP
                </p>
              </div>
            </div>

            <div className="flex gap-1 opacity-0 transition group-hover:opacity-100">
              <button
                onClick={() => startEdit(category)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-700 hover:text-white"
                title={t("categoryManager.edit")}
              >
                ✎
              </button>
              <button
                onClick={() => handleDelete(category.id)}
                className="rounded-lg p-2 text-slate-400 hover:bg-rose-500/20 hover:text-rose-400"
                title={t("categoryManager.delete")}
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>
      <PremiumModal
        isOpen={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
      />
    </div>
  );
}
