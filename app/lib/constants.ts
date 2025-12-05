import { User } from "./types";

export const XP_PER_LEVEL_BASE = 100;
export const XP_GROWTH_RATE = 1.3;

export const INITIAL_USER: User = {
  level: 1,
  xp: 0,
  nextLevelXp: XP_PER_LEVEL_BASE,
  streak: {
    current: 0,
    longest: 0,
    lastActiveDate: null,
  },
  stats: {
    tasksCompleted: 0,
    habitsCompleted: 0,
    questsCompleted: 0,
    timerMinutesTotal: 0,
    totalXpEarned: 0,
    todayXp: 0,
    gold: 0,
    totalGoldEarned: 0,
    skillPoints: 0,
    skillPointsSpent: 0,
  },
  equippedItems: {
    weapon: null,
    armor: null,
    accessory: null,
  },
  inventory: [],
  unlockedSkills: [],
  settings: {
    theme: "dark",
    language: "ja",
    storageMode: "local",
    soundEnabled: true,
    notificationsEnabled: true,
    maxDailyXp: 1000,
  },
};

export const TASK_CATEGORIES = [
  "categories.work",
  "categories.health",
  "categories.learning",
  "categories.relationships",
  "categories.money",
  "categories.hobbies",
  "categories.life",
] as const;

export const MOTIVATION_MESSAGES = [
  "dashboard.motivation.message1",
  "dashboard.motivation.message2",
  "dashboard.motivation.message3",
  "dashboard.motivation.message4",
  "dashboard.motivation.message5",
  "dashboard.motivation.message6",
  "dashboard.motivation.message7",
] as const;

export const STORAGE_KEYS = {
  USER: "level-life:user",
  TASKS: "level-life:tasks",
  HABITS: "level-life:habits",
} as const;

export function getTodayString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function isConsecutiveDay(date1: string, date2: string): boolean {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays === 1;
}

// ============================================================================
// Default Quest Categories
// ============================================================================

export const DEFAULT_CATEGORIES = [
  {
    name: "categories.work",
    icon: "💼",
    color: "#3b82f6", // blue
    defaultXp: 50,
  },
  {
    name: "categories.health",
    icon: "💪",
    color: "#10b981", // green
    defaultXp: 40,
  },
  {
    name: "categories.learning",
    icon: "📚",
    color: "#8b5cf6", // purple
    defaultXp: 60,
  },
  {
    name: "categories.relationships",
    icon: "👥",
    color: "#ec4899", // pink
    defaultXp: 30,
  },
  {
    name: "categories.money",
    icon: "💰",
    color: "#f59e0b", // amber
    defaultXp: 40,
  },
  {
    name: "categories.hobbies",
    icon: "🎨",
    color: "#06b6d4", // cyan
    defaultXp: 30,
  },
  {
    name: "categories.life",
    icon: "🏠",
    color: "#64748b", // slate
    defaultXp: 20,
  },
] as const;
