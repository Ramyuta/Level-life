import React from "react";
import { cn } from "../../lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  color?: "indigo" | "emerald" | "amber" | "rose" | "slate";
  className?: string;
}

export default function StatCard({
  label,
  value,
  color = "slate",
  className,
}: StatCardProps) {
  const colorClasses = {
    indigo: "text-indigo-400",
    emerald: "text-emerald-400",
    amber: "text-amber-400",
    rose: "text-rose-400",
    slate: "text-slate-50",
  };

  return (
    <div
      className={cn(
        "rounded-2xl bg-slate-800/80 p-4 ring-1 ring-white/10 backdrop-blur-sm",
        className
      )}
    >
      <p className="text-xs font-medium text-slate-400">{label}</p>
      <p className={cn("mt-1 text-2xl font-bold", colorClasses[color])}>
        {value}
      </p>
    </div>
  );
}
