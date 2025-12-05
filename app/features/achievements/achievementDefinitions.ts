export type AchievementType = "streak" | "xp" | "quests" | "categories";

export interface Achievement {
  id: string;
  name: string;
  description: string;
  type: AchievementType;
  icon: string;
  condition: {
    type: "streak" | "totalXp" | "questsCompleted" | "categoriesCreated";
    value: number;
  };
  xpReward?: number; // Future enhancement
}

export interface UnlockedAchievement {
  achievementId: string;
  unlockedAt: string; // ISO timestamp
}

export const ACHIEVEMENTS: Achievement[] = [
  // Streak achievements
  {
    id: "streak_3",
    name: "3日連続クリア",
    description: "3日連続でクエストを完了しました",
    type: "streak",
    icon: "🔥",
    condition: { type: "streak", value: 3 },
  },
  {
    id: "streak_7",
    name: "7日連続クリア",
    description: "1週間連続でクエストを完了しました",
    type: "streak",
    icon: "⚡",
    condition: { type: "streak", value: 7 },
  },
  {
    id: "streak_30",
    name: "30日連続クリア",
    description: "1ヶ月連続でクエストを完了しました！",
    type: "streak",
    icon: "💎",
    condition: { type: "streak", value: 30 },
  },

  // XP achievements
  {
    id: "xp_1000",
    name: "累計1,000XP達成",
    description: "累計1,000XPを獲得しました",
    type: "xp",
    icon: "⭐",
    condition: { type: "totalXp", value: 1000 },
  },
  {
    id: "xp_5000",
    name: "累計5,000XP達成",
    description: "累計5,000XPを獲得しました",
    type: "xp",
    icon: "🌟",
    condition: { type: "totalXp", value: 5000 },
  },
  {
    id: "xp_10000",
    name: "累計10,000XP達成",
    description: "累計10,000XPを獲得しました！",
    type: "xp",
    icon: "✨",
    condition: { type: "totalXp", value: 10000 },
  },

  // Quest completion achievements
  {
    id: "quests_10",
    name: "クエスト10個完了",
    description: "クエストを10個完了しました",
    type: "quests",
    icon: "📝",
    condition: { type: "questsCompleted", value: 10 },
  },
  {
    id: "quests_50",
    name: "クエスト50個完了",
    description: "クエストを50個完了しました",
    type: "quests",
    icon: "📋",
    condition: { type: "questsCompleted", value: 50 },
  },
  {
    id: "quests_100",
    name: "クエスト100個完了",
    description: "クエストを100個完了しました！",
    type: "quests",
    icon: "🏆",
    condition: { type: "questsCompleted", value: 100 },
  },

  // Category achievements
  {
    id: "categories_3",
    name: "カテゴリ3つ作成",
    description: "カスタムカテゴリを3つ作成しました",
    type: "categories",
    icon: "🎨",
    condition: { type: "categoriesCreated", value: 3 },
  },
  {
    id: "categories_5",
    name: "カテゴリ5つ作成",
    description: "カスタムカテゴリを5つ作成しました",
    type: "categories",
    icon: "🎭",
    condition: { type: "categoriesCreated", value: 5 },
  },
];
