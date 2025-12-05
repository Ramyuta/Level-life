"use client";

import { useMemo } from "react";

type ProgressBarProps = {
  progress: number;
  label?: string;
};

export default function ProgressBar({ progress, label }: ProgressBarProps) {
  const clamped = useMemo(() => {
    if (!Number.isFinite(progress)) {
      return 0;
    }
    return Math.min(100, Math.max(0, progress));
  }, [progress]);

  const displayWidth = clamped === 0 ? 3 : Math.max(clamped, 6);

  return (
    <div className="space-y-2">
      {label ? (
        <div className="flex items-center justify-between text-xs uppercase tracking-[0.35em] text-indigo-200">
          <span>{label}</span>
          <span>{Math.round(clamped)}%</span>
        </div>
      ) : null}
      <div className="h-2 w-full overflow-hidden rounded-full bg-indigo-950/50">
        <div
          className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-purple-500 transition-all duration-500 ease-out"
          style={{ width: `${displayWidth}%` }}
        />
      </div>
    </div>
  );
}
