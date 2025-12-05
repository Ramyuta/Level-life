"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "../../features/i18n/useTranslation";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDangerous?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText,
  cancelText,
  isDangerous = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const { t } = useTranslation();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-md overflow-hidden rounded-2xl bg-slate-800 p-6 shadow-2xl ring-1 ring-white/10"
          >
            <h3 className="text-xl font-bold text-white">{title}</h3>
            <p className="mt-2 text-slate-300 whitespace-pre-wrap">{message}</p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={onCancel}
                className="rounded-lg bg-slate-700 px-4 py-2 font-bold text-slate-300 hover:bg-slate-600"
              >
                {cancelText || t("common.cancel")}
              </button>
              <button
                onClick={onConfirm}
                className={`rounded-lg px-4 py-2 font-bold text-white ${
                  isDangerous
                    ? "bg-rose-500 hover:bg-rose-600"
                    : "bg-indigo-500 hover:bg-indigo-600"
                }`}
              >
                {confirmText || t("common.confirm")}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
