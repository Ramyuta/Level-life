"use client";

import { useTranslation } from "../../i18n/useTranslation";
import { HeatmapData } from "../../../lib/analytics/aggregator";

interface Props {
  data: HeatmapData[];
}

export default function ProductivityHeatmap({ data }: Props) {
  const { t } = useTranslation();

  const days = [0, 1, 2, 3, 4, 5, 6]; // Sun to Sat
  const hours = Array.from({ length: 24 }, (_, i) => i);

  // Helper to get opacity based on value
  const getOpacity = (day: number, hour: number) => {
    const entry = data.find((d) => d.day === day && d.hour === hour);
    if (!entry) return 0.05;
    const max = Math.max(...data.map((d) => d.value));
    // Normalize to 0.2 - 1.0 range
    return 0.2 + (entry.value / max) * 0.8;
  };

  const getValue = (day: number, hour: number) => {
    const entry = data.find((d) => d.day === day && d.hour === hour);
    return entry ? entry.value : 0;
  };

  const dayLabels = [
    t("common.days.sun"),
    t("common.days.mon"),
    t("common.days.tue"),
    t("common.days.wed"),
    t("common.days.thu"),
    t("common.days.fri"),
    t("common.days.sat"),
  ];

  return (
    <div className="rounded-2xl bg-slate-900/60 p-6 ring-1 ring-white/5">
      <h3 className="mb-6 text-lg font-bold text-white">
        {t("analytics.productivityHeatmap")}
      </h3>

      <div className="overflow-x-auto">
        <div className="min-w-[600px]">
          {/* Header Row (Hours) */}
          <div className="flex mb-2">
            <div className="w-12"></div>
            {hours.map((h) => (
              <div
                key={h}
                className="flex-1 text-center text-xs text-slate-500"
              >
                {h % 3 === 0 ? h : ""}
              </div>
            ))}
          </div>

          {/* Grid */}
          <div className="space-y-1">
            {days.map((day, i) => (
              <div key={day} className="flex items-center">
                <div className="w-12 text-xs text-slate-400 font-medium">
                  {dayLabels[i]}
                </div>
                <div className="flex-1 flex gap-1">
                  {hours.map((hour) => {
                    const value = getValue(day, hour);
                    const opacity = getOpacity(day, hour);
                    return (
                      <div
                        key={`${day}-${hour}`}
                        className="flex-1 aspect-square rounded-sm transition-all hover:ring-1 hover:ring-white/50 relative group"
                        style={{
                          backgroundColor: `rgba(16, 185, 129, ${value > 0 ? opacity : 0.05})`,
                        }}
                      >
                        {value > 0 && (
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10 bg-slate-800 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap">
                            {value} {t("analytics.quests")}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-end gap-2 text-xs text-slate-400">
        <span>Less</span>
        <div className="flex gap-1">
          <div className="w-3 h-3 rounded-sm bg-emerald-500/10"></div>
          <div className="w-3 h-3 rounded-sm bg-emerald-500/40"></div>
          <div className="w-3 h-3 rounded-sm bg-emerald-500/70"></div>
          <div className="w-3 h-3 rounded-sm bg-emerald-500"></div>
        </div>
        <span>More</span>
      </div>
    </div>
  );
}
