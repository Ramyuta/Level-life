import { Quest, Completion, Category } from "../types";
import {
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  getDay,
  getHours,
  subDays,
  isSameDay,
} from "date-fns";
import { ja, enUS } from "date-fns/locale";

export interface CategoryDistribution {
  name: string;
  value: number; // XP or Count
  color: string;
}

export interface HeatmapData {
  day: number; // 0-6 (Sun-Sat)
  hour: number; // 0-23
  value: number; // Count
}

export interface TrendData {
  date: string;
  xp: number;
  quests: number;
}

export interface StatSummary {
  totalXp: number;
  completedQuests: number;
  completionRate: number;
  currentStreak: number;
}

// Helper to get locale object
const getLocale = (lang: "ja" | "en") => (lang === "ja" ? ja : enUS);

export const AnalyticsAggregator = {
  // Calculate Category Distribution (Pie Chart)
  getCategoryDistribution: (
    completions: Completion[],
    quests: Quest[],
    categories: Category[],
    metric: "xp" | "count" = "xp"
  ): CategoryDistribution[] => {
    const distribution: Record<string, number> = {};

    completions.forEach((completion) => {
      const quest = quests.find((q) => q.id === completion.questId);
      // If quest is deleted, we might not find it.
      // In a real app, we should store categorySnapshot in Completion.
      // For now, we skip or use "Unknown".
      const categoryName = quest?.category || "Unknown";

      if (metric === "xp") {
        distribution[categoryName] =
          (distribution[categoryName] || 0) + completion.xpEarned;
      } else {
        distribution[categoryName] = (distribution[categoryName] || 0) + 1;
      }
    });

    return Object.entries(distribution)
      .map(([name, value]) => {
        const category = categories.find((c) => c.name === name);
        return {
          name,
          value,
          color: category?.color || "#94a3b8", // Default slate-400
        };
      })
      .sort((a, b) => b.value - a.value); // Sort by value desc
  },

  // Calculate Productivity Heatmap (Scatter Chart)
  getProductivityHeatmap: (completions: Completion[]): HeatmapData[] => {
    const heatmap: Record<string, number> = {};

    completions.forEach((completion) => {
      const date = new Date(completion.completedAt);
      const day = getDay(date);
      const hour = getHours(date);
      const key = `${day}-${hour}`;
      heatmap[key] = (heatmap[key] || 0) + 1;
    });

    const result: HeatmapData[] = [];
    for (let d = 0; d < 7; d++) {
      for (let h = 0; h < 24; h++) {
        const key = `${d}-${h}`;
        if (heatmap[key]) {
          result.push({
            day: d,
            hour: h,
            value: heatmap[key],
          });
        }
      }
    }
    return result;
  },

  // Calculate Trends (Line/Bar Chart)
  getTrends: (
    completions: Completion[],
    days: number = 30,
    lang: "ja" | "en" = "ja"
  ): TrendData[] => {
    const today = new Date();
    const startDate = subDays(today, days - 1);
    const interval = eachDayOfInterval({ start: startDate, end: today });

    return interval.map((date) => {
      const dayCompletions = completions.filter((c) =>
        isSameDay(new Date(c.completedAt), date)
      );

      return {
        date: format(date, "MM/dd", { locale: getLocale(lang) }),
        xp: dayCompletions.reduce((sum, c) => sum + c.xpEarned, 0),
        quests: dayCompletions.length,
      };
    });
  },

  // Calculate Summary Stats
  getSummary: (
    completions: Completion[],
    quests: Quest[],
    userStreak: number
  ): StatSummary => {
    const totalXp = completions.reduce((sum, c) => sum + c.xpEarned, 0);
    const completedQuests = completions.length;

    // Completion Rate (Simple approximation: completed / (active + completed))
    // Note: This is tricky because recurring quests skew "active" count.
    // Better metric: Completion rate of "due" quests.
    // For simplicity, let's use: completed / (completed + active non-recurring)
    // Or just skip completion rate for now if it's too complex to be accurate.
    // Let's use a simple "Quests Completed" metric instead.

    return {
      totalXp,
      completedQuests,
      completionRate: 0, // Placeholder
      currentStreak: userStreak,
    };
  },
};
