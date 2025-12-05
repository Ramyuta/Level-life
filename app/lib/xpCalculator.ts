import type { Priority } from "./types";

/**
 * XP calculation utility
 * Automatically calculates XP based on difficulty and timer duration
 */

const BASE_XP: Record<Priority, number> = {
  low: 10,
  medium: 25,
  high: 50,
};

const TIMER_XP_PER_MINUTE = 2;

/**
 * Calculate XP reward for a quest
 * @param difficulty Quest difficulty (low/medium/high)
 * @param timerMinutes Timer duration in minutes (optional)
 * @returns Calculated XP reward
 */
export function calculateQuestXP(
  difficulty: Priority,
  timerMinutes?: number
): number {
  const baseXP = BASE_XP[difficulty];
  const timerBonus = timerMinutes ? timerMinutes * TIMER_XP_PER_MINUTE : 0;

  return baseXP + timerBonus;
}

/**
 * Calculate Social Points (for leaderboard display)
 * Social Points are inflated for more exciting competition
 * @param xp Base XP
 * @returns Social Points (SP)
 */
export function calculateSocialPoints(xp: number): number {
  return xp * 3;
}

/**
 * Get XP breakdown for display
 */
export function getXPBreakdown(difficulty: Priority, timerMinutes?: number) {
  const baseXP = BASE_XP[difficulty];
  const timerBonus = timerMinutes ? timerMinutes * TIMER_XP_PER_MINUTE : 0;
  const totalXP = baseXP + timerBonus;
  const socialPoints = calculateSocialPoints(totalXP);

  return {
    baseXP,
    timerBonus,
    totalXP,
    socialPoints,
  };
}
