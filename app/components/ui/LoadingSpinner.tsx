"use client";

import { motion } from "framer-motion";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LoadingSpinner({
  size = "md",
  className = "",
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-5 w-5 border-2",
    md: "h-8 w-8 border-3",
    lg: "h-12 w-12 border-4",
  };

  return (
    <div className={`flex justify-center ${className}`}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className={`rounded-full border-slate-200 border-t-indigo-500 ${sizeClasses[size]}`}
      />
    </div>
  );
}

export function LoadingScreen() {
  return (
    <div className="flex h-[50vh] w-full flex-col items-center justify-center gap-4">
      <LoadingSpinner size="lg" />
      <p className="text-slate-400 animate-pulse">読み込み中...</p>
    </div>
  );
}
