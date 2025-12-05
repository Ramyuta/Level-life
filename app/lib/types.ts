// ============================================================================
// Basic Types
// ============================================================================

export type Priority = "low" | "medium" | "high";
export type TaskStatus = "todo" | "in-progress" | "done";
export type Frequency = "daily" | "weekly" | "custom";
export type ScheduleType = "once" | "daily" | "weekly";
export type StorageMode = "local" | "cloud";
export type Theme = "light" | "dark" | "system";
export type Language = "ja" | "en";
export type UserTier = "free" | "premium";

// ============================================================================
// User Types
// ============================================================================

export interface UserSettings {
  theme: Theme;
  language: Language;
  storageMode: StorageMode;
  soundEnabled: boolean;
  notificationsEnabled: boolean;
  maxDailyXp: number;
}

export interface UserStats {
  totalXpEarned: number;
  todayXp: number;
  tasksCompleted: number;
  habitsCompleted: number;
  questsCompleted: number;
  timerMinutesTotal: number;
  gold: number;
  totalGoldEarned: number;
  skillPoints: number;
  skillPointsSpent: number;
}

// ============================================================================
// Equipment & Shop Types
// ============================================================================

export type EquipmentType = "weapon" | "armor" | "accessory";
export type EquipmentRarity = "common" | "rare" | "epic" | "legendary";
export type EffectType =
  | "xp_boost"
  | "streak_protection"
  | "gold_boost"
  | "timer_extension";

export interface EquipmentEffect {
  type: EffectType;
  value: number;
  category?: string;
}

export interface Equipment {
  id: string;
  name: string;
  description: string;
  type: EquipmentType;
  rarity: EquipmentRarity;
  price: number;
  effects: EquipmentEffect[];
  icon: string;
  requiredLevel?: number;
}

export interface UserEquipment {
  weapon: Equipment | null;
  armor: Equipment | null;
  accessory: Equipment | null;
}

export interface InventoryItem {
  equipment: Equipment;
  acquiredAt: string;
}

// ============================================================================
// Skill System Types
// ============================================================================

export type SkillCategory = "focus" | "resilience" | "efficiency" | "social";
export type SkillEffectType =
  | "timer_extension"
  | "xp_boost"
  | "gold_boost"
  | "streak_protection"
  | "drop_rate_boost"
  | "friend_xp_share";

export interface SkillEffect {
  type: SkillEffectType;
  value: number;
  category?: string;
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  category: SkillCategory;
  cost: number;
  maxLevel: number;
  prerequisites: string[];
  effects: SkillEffect[];
  icon: string;
}

export interface UserSkill {
  skillId: string;
  level: number;
  unlockedAt: string;
}

// ============================================================================
// Battle System Types
// ============================================================================

export type MonsterType = "slime" | "goblin" | "dragon" | "demon_king";

export interface Monster {
  id: string;
  type: MonsterType;
  name: string;
  maxHp: number;
  currentHp: number;
  level: number;
  attack: number;
  xpReward: number;
  goldReward: number;
  dropRate: number; // 0-1
}

export interface BattleLog {
  id: string;
  message: string;
  type: "damage" | "heal" | "info" | "critical";
  value?: number;
  timestamp: string;
}

export interface BattleState {
  isActive: boolean;
  monster: Monster | null;
  turn: "player" | "monster";
  logs: BattleLog[];
  lastActionAt: string;
}

export interface UserStreak {
  current: number;
  longest: number;
  lastActiveDate: string | null;
}

export interface User {
  level: number;
  xp: number;
  nextLevelXp: number;
  streak: UserStreak;
  stats: UserStats;
  settings: UserSettings;
  equippedItems: UserEquipment;
  inventory: InventoryItem[];
  unlockedSkills: UserSkill[];
  subscription?: {
    tier: UserTier;
    status: "active" | "canceled" | "expired" | "none";
    validUntil?: string;
  };
}

export interface UserProfile {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  friendCode: string;
  avatarId?: string;
  createdAt: string;
}

export const AVATARS = {
  male_1: "/avatars/male_1.png",
  female_1: "/avatars/female_1.png",
  male_2: "/avatars/male_2.png",
  female_2: "/avatars/female_2.png",
  neutral_1: "/avatars/neutral_1.png",
  neutral_2: "/avatars/neutral_2.png",
} as const;

export type AvatarId = keyof typeof AVATARS;

// ============================================================================
// Social Support Types (Reactions & Comments)
// ============================================================================

export interface Friend {
  uid: string;
  displayName: string;
  avatarId: string;
  level: number;
  friendCode: string;
  status: "online" | "offline";
  lastActive: string;
}

export interface LeaderboardEntry {
  uid: string;
  displayName: string;
  avatarId: string;
  level: number;
  weeklyXp: number;
  rank: number;
}

export type FriendActivityType =
  | "levelup"
  | "quest_complete"
  | "boss_defeat"
  | "item_get"
  | "achievement"
  | "streak_milestone";

export interface FriendActivity {
  id: string;
  userId: string;
  userDisplayName: string;
  userAvatarId: string;
  type: FriendActivityType;
  detail: string;
  timestamp: string;
  likes: number;
}

export interface Activity {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  type: "quest_completed";
  questId: string;
  questTitle: string;
  xpEarned: number;
  categoryIcon?: string;
  createdAt: string;
}

export interface Reaction {
  id: string;
  activityId: string;
  userId: string;
  userName: string;
  type: "like";
  createdAt: string;
}

export interface Comment {
  id: string;
  activityId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: string;
}

// ============================================================================
// Quest Types (Enhanced Task)
// ============================================================================

export type QuestCategory = Category;

export interface Quest {
  id: string;
  userId: string;
  title: string;
  description?: string;
  category: string;
  scheduleType: ScheduleType;
  scheduleDays?: number[]; // 0=Sunday, 1=Monday, etc.
  xpReward: number; // Renamed from xpPerCompletion to match usage
  priority: Priority;
  tags: string[];
  note?: string;
  timerDurationMinutes?: number; // For timer-based quests
  status: "active" | "completed" | "archived";
  streak?: {
    current: number;
    longest: number;
  };
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// Completion Types
// ============================================================================

export interface Completion {
  id: string;
  userId: string;
  questId: string;
  completedAt: string; // ISO timestamp
  xpEarned: number;
  notes?: string;
}

// ============================================================================
// Achievement Types
// ============================================================================

export interface Achievement {
  id: string;
  userId: string;
  unlockedAt: string;
  progress: number;
}

export interface UnlockedAchievement {
  achievementId: string;
  unlockedAt: string;
}
export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  category: string;
  deadline?: string;
  xpReward: number;
  tags: string[];
  createdAt: string;
  completedAt: string | null;
}

export interface Habit {
  id: string;
  title: string;
  description?: string;
  frequency: Frequency;
  targetDays: number[]; // 0=Sun, 1=Mon...
  streak: number;
  completedDates: string[];
  xpReward: number;
  createdAt: string;
}

// ============================================================================
// Utility Types
// ============================================================================

export type XpResult = {
  user: User;
  leveledUp: boolean;
  xpGained: number;
};

export interface TimerSession {
  id: string;
  questId: string;
  questTitle?: string; // Optional for backward compatibility
  startTime: string;
  endTime?: string;
  durationMinutes: number;
  xpGained: number;
  status: "running" | "completed" | "cancelled";
}

// ============================================================================
// Category Types
// ============================================================================

export interface Category {
  id: string;
  userId: string;
  name: string;
  icon: string;
  color: string;
  defaultXp: number;
  isCustom: boolean;
}

// ============================================================================
// Daily Stats Types
// ============================================================================

export interface DailyStats {
  userId: string;
  date: string; // YYYY-MM-DD format
  questsCompleted: number;
  habitsCompleted: number;
  timerMinutes: number;
  totalXpEarned: number;
  streak: number;
}
