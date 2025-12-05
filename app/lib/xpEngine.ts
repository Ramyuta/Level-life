import type { User, Quest, Priority } from "./types";
import { XP_PER_LEVEL_BASE, XP_GROWTH_RATE } from "./constants";

/**
 * XP計算エンジン
 * すべてのXP関連の計算ロジックを集約
 */

// ============================================================================
// XP Calculation Functions
// ============================================================================

/**
 * クエストの基本XPを計算
 * 優先度に基づいてXPを調整
 */
export function calculateQuestXp(
  baseXp: number,
  priority: Priority,
  multiplier: number = 1.0
): number {
  const priorityMultipliers: Record<Priority, number> = {
    low: 0.8,
    medium: 1.0,
    high: 1.3,
  };

  const finalXp = Math.round(
    baseXp * priorityMultipliers[priority] * multiplier
  );
  return Math.max(1, finalXp); // 最低1XP
}

/**
 * タイマーセッションのXPを計算
 * 時間に基づいてXPを付与（1分 = 2XP）
 */
export function calculateTimerXp(
  durationMinutes: number,
  questXpPerCompletion?: number
): number {
  const baseTimerXp = Math.round(durationMinutes * 2);

  // クエストに紐づいている場合は、クエストXPも加算
  if (questXpPerCompletion) {
    return baseTimerXp + questXpPerCompletion;
  }

  return baseTimerXp;
}

/**
 * 距離ベースのXPを計算（将来の実装用）
 * 1km = 10XP
 */
export function calculateDistanceXp(distanceKm: number): number {
  return Math.round(distanceKm * 10);
}

// ============================================================================
// Level Calculation Functions
// ============================================================================

/**
 * 指定レベルに必要な総XPを計算
 */
export function getTotalXpForLevel(level: number): number {
  let totalXp = 0;
  for (let i = 1; i < level; i++) {
    totalXp += getXpForLevel(i);
  }
  return totalXp;
}

/**
 * 指定レベルから次のレベルに必要なXPを計算
 */
export function getXpForLevel(level: number): number {
  return Math.round(XP_PER_LEVEL_BASE * Math.pow(XP_GROWTH_RATE, level - 1));
}

/**
 * XPを追加してレベルアップを計算
 * 複数レベルアップにも対応
 */
export function addXpAndCalculateLevel(
  user: User,
  xpToAdd: number
): {
  newUser: User;
  leveledUp: boolean;
  levelsGained: number;
  xpGained: number;
} {
  let { xp, level, nextLevelXp, stats } = user;
  let newXp = xp + xpToAdd;
  let leveledUp = false;
  let levelsGained = 0;

  // レベルアップ処理（複数レベルアップ対応）
  while (newXp >= nextLevelXp) {
    newXp -= nextLevelXp;
    level += 1;
    levelsGained += 1;
    nextLevelXp = getXpForLevel(level);
    leveledUp = true;
  }

  const newUser: User = {
    ...user,
    level,
    xp: newXp,
    nextLevelXp,
    stats: {
      ...stats,
      totalXpEarned: stats.totalXpEarned + xpToAdd,
    },
  };

  return {
    newUser,
    leveledUp,
    levelsGained,
    xpGained: xpToAdd,
  };
}

// ============================================================================
// Streak Calculation Functions
// ============================================================================

/**
 * ストリークを更新
 * 連続日数の計算とストリーク切れの判定
 */
export function updateStreak(
  currentStreak: User["streak"],
  activityDate: string
): User["streak"] {
  const newStreak = { ...currentStreak };

  if (!currentStreak.lastActiveDate) {
    // 初回アクティビティ
    newStreak.current = 1;
    newStreak.longest = 1;
    newStreak.lastActiveDate = activityDate;
  } else if (currentStreak.lastActiveDate === activityDate) {
    // 同日の場合は変更なし
    return newStreak;
  } else {
    const lastDate = new Date(currentStreak.lastActiveDate);
    const currentDate = new Date(activityDate);
    const diffTime = currentDate.getTime() - lastDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      // 連続日
      newStreak.current += 1;
      newStreak.longest = Math.max(newStreak.longest, newStreak.current);
      newStreak.lastActiveDate = activityDate;
    } else if (diffDays > 1) {
      // ストリーク切れ
      newStreak.current = 1;
      newStreak.lastActiveDate = activityDate;
    }
  }

  return newStreak;
}

// ============================================================================
// Daily XP Cap Functions
// ============================================================================

/**
 * 1日のXP上限をチェック
 * 上限を超えた場合は制限されたXPを返す
 */
export function applyDailyXpCap(
  currentDailyXp: number,
  xpToAdd: number,
  maxDailyXp: number
): {
  allowedXp: number;
  cappedXp: number;
  reachedCap: boolean;
} {
  const totalXp = currentDailyXp + xpToAdd;

  if (totalXp > maxDailyXp) {
    const allowedXp = Math.max(0, maxDailyXp - currentDailyXp);
    return {
      allowedXp,
      cappedXp: xpToAdd - allowedXp,
      reachedCap: true,
    };
  }

  return {
    allowedXp: xpToAdd,
    cappedXp: 0,
    reachedCap: false,
  };
}
