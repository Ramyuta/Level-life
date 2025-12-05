export function calculateLevel(totalXP: number) {
  const level = Math.floor(Math.sqrt(totalXP / 50)) + 1;
  const nextLevelXP = level ** 2 * 50;
  const prevLevelXP = (level - 1) ** 2 * 50;
  const progress = ((totalXP - prevLevelXP) / (nextLevelXP - prevLevelXP)) * 100;
  return {
    level,
    progress: Math.max(0, Math.min(100, progress)),
    nextLevelXP,
    xpToNext: Math.max(0, nextLevelXP - totalXP),
  };
}
