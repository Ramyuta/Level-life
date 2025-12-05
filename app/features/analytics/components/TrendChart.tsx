"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useTranslation } from "../../i18n/useTranslation";
import { TrendData } from "../../../lib/analytics/aggregator";

interface Props {
  data: TrendData[];
}

export default function TrendChart({ data }: Props) {
  const { t } = useTranslation();

  if (data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl bg-slate-900/60 p-6 text-slate-400 ring-1 ring-white/5">
        {t("analytics.noData")}
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-slate-900/60 p-6 ring-1 ring-white/5">
      <h3 className="mb-6 text-lg font-bold text-white">
        {t("analytics.xpTrend")}
      </h3>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data as any}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#334155"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              stroke="#94a3b8"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              minTickGap={30}
            />
            <YAxis
              stroke="#94a3b8"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1e293b",
                borderColor: "#334155",
                borderRadius: "8px",
                color: "#f1f5f9",
              }}
            />
            <Line
              type="monotone"
              dataKey="xp"
              stroke="#6366f1"
              strokeWidth={3}
              dot={{ fill: "#6366f1", r: 4 }}
              activeDot={{ r: 6 }}
              name="XP"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
