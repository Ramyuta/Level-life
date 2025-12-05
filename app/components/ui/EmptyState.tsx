"use client";

import { motion } from "framer-motion";

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center rounded-2xl bg-slate-800/60 p-8 text-center ring-1 ring-white/5"
    >
      <div className="mb-4 text-4xl">{icon}</div>
      <h3 className="mb-2 text-lg font-bold text-slate-200">{title}</h3>
      <p className="mb-6 text-sm text-slate-400">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="rounded-xl bg-indigo-500/20 px-6 py-2 text-sm font-medium text-indigo-300 transition-all hover:bg-indigo-500/30 hover:text-indigo-200"
        >
          {actionLabel}
        </button>
      )}
    </motion.div>
  );
}
