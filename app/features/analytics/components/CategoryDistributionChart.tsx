"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { useTranslation } from "../../i18n/useTranslation";
import { CategoryDistribution } from "../../../lib/analytics/aggregator";

interface Props {
  data: CategoryDistribution[];
}

export default function CategoryDistributionChart({ data }: Props) {
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
        {t("analytics.categoryDistribution")}
      </h3>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data as any}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#1e293b",
                borderColor: "#334155",
                borderRadius: "8px",
                color: "#f1f5f9",
              }}
              itemStyle={{ color: "#f1f5f9" }}
              formatter={(value: number) => [`${value} XP`, ""]}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value) => (
                <span className="text-slate-300 ml-1">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
