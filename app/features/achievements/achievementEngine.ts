import {
  ACHIEVEMENTS,
  Achievement,
  UnlockedAchievement,
} from "./achievementDefinitions";
import type { User, Category } from "../../lib/types";

export interface AchievementProgress {
  achievement: Achievement;
  isUnlocked: boolean;
  unlockedAt?: string;
  currentValue: number;
  requiredValue: number;
  progress: number; // 0-100
}

/**
 * Check if an achievement should be unlocked based on user stats
 */
export function checkAchievementUnlock(
  achievement: Achievement,
  user: User,
  customCategoriesCount: number
): boolean {
  const { condition } = achievement;

  switch (condition.type) {
    case "streak":
      return user.streak.current >= condition.value;

    case "totalXp":
      return user.stats.totalXpEarned >= condition.value;

    case "questsCompleted":
      return user.stats.questsCompleted >= condition.value;

    case "categoriesCreated":
      return customCategoriesCount >= condition.value;

    default:
      return false;
  }
}

/**
 * Get current progress value for an achievement
 */
export function getAchievementCurrentValue(
  achievement: Achievement,
  user: User,
  customCategoriesCount: number
): number {
  const { condition } = achievement;

  switch (condition.type) {
    case "streak":
      return user.streak.current;

    case "totalXp":
      return user.stats.totalXpEarned;

    case "questsCompleted":
      return user.stats.questsCompleted;

    case "categoriesCreated":
      return customCategoriesCount;

    default:
      return 0;
  }
}

/**
 * Calculate progress for an achievement
 */
export function getAchievementProgress(
  achievement: Achievement,
  user: User,
  customCategoriesCount: number,
  unlockedAchievements: UnlockedAchievement[]
): AchievementProgress {
  const isUnlocked = unlockedAchievements.some(
    (ua) => ua.achievementId === achievement.id
  );

  const unlockedAchievement = unlockedAchievements.find(
    (ua) => ua.achievementId === achievement.id
  );

  const currentValue = getAchievementCurrentValue(
    achievement,
    user,
    customCategoriesCount
  );

  const requiredValue = achievement.condition.value;
  const progress = Math.min(100, (currentValue / requiredValue) * 100);

  return {
    achievement,
    isUnlocked,
    unlockedAt: unlockedAchievement?.unlockedAt,
    currentValue,
    requiredValue,
    progress,
  };
}

/**
 * Evaluate all achievements and return newly unlocked ones
 */
export function evaluateAchievements(
  user: User,
  customCategoriesCount: number,
  unlockedAchievements: UnlockedAchievement[]
): Achievement[] {
  const newlyUnlocked: Achievement[] = [];

  for (const achievement of ACHIEVEMENTS) {
    // Skip if already unlocked
    const alreadyUnlocked = unlockedAchievements.some(
      (ua) => ua.achievementId === achievement.id
    );

    if (alreadyUnlocked) {
      continue;
    }

    // Check if should be unlocked
    if (checkAchievementUnlock(achievement, user, customCategoriesCount)) {
      newlyUnlocked.push(achievement);
    }
  }

  return newlyUnlocked;
}

/**
 * Get all achievement progress for display
 */
export function getAllAchievementProgress(
  user: User,
  customCategoriesCount: number,
  unlockedAchievements: UnlockedAchievement[]
): AchievementProgress[] {
  return ACHIEVEMENTS.map((achievement) =>
    getAchievementProgress(
      achievement,
      user,
      customCategoriesCount,
      unlockedAchievements
    )
  );
}
