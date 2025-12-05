"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useTranslation } from "../../i18n/useTranslation";

const data = [
  { name: "Mon", xp: 120 },
  { name: "Tue", xp: 200 },
  { name: "Wed", xp: 150 },
  { name: "Thu", xp: 300 },
  { name: "Fri", xp: 250 },
  { name: "Sat", xp: 180 },
  { name: "Sun", xp: 100 },
];

export default function WeeklyStatsCard() {
  const { t } = useTranslation();

  return (
    <div className="rounded-2xl bg-slate-900/60 p-6 ring-1 ring-white/5">
      <h3 className="mb-6 text-lg font-bold text-white">
        {t("dashboard.analytics.weeklyProgress")}
      </h3>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#334155"
              vertical={false}
            />
            <XAxis
              dataKey="name"
              stroke="#94a3b8"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#94a3b8"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1e293b",
                borderColor: "#334155",
                borderRadius: "8px",
                color: "#f1f5f9",
              }}
              cursor={{ fill: "#334155", opacity: 0.4 }}
            />
            <Bar
              dataKey="xp"
              fill="#6366f1"
              radius={[4, 4, 0, 0]}
              name={t("dashboard.analytics.xpEarned")}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
