import type { Monster, MonsterType, User, Task } from "./types";
import {
  MONSTER_DEFINITIONS,
  getMonsterByTaskCount,
} from "../features/battle/data/monsters";

/**
 * Generate a monster based on user's tasks
 */
export function generateMonster(tasks: Task[]): Monster {
  const activeTasks = tasks.filter((t) => t.status !== "done");
  const taskCount = activeTasks.length;
  const definition = getMonsterByTaskCount(taskCount);

  // Calculate level based on average task difficulty or just task count
  const level = Math.max(1, Math.floor(taskCount / 2));

  // Scale stats by level
  const hpMultiplier = 1 + (level - 1) * 0.2;
  const attackMultiplier = 1 + (level - 1) * 0.1;
  const rewardMultiplier = 1 + (level - 1) * 0.15;

  return {
    id: crypto.randomUUID(),
    type: definition.type,
    name: definition.name,
    maxHp: Math.round(definition.baseHp * hpMultiplier),
    currentHp: Math.round(definition.baseHp * hpMultiplier),
    level,
    attack: Math.round(definition.baseAttack * attackMultiplier),
    xpReward: Math.round(definition.baseXp * rewardMultiplier),
    goldReward: Math.round(definition.baseGold * rewardMultiplier),
    dropRate: definition.dropRate,
  };
}

/**
 * Calculate damage player deals to monster
 */
export function calculatePlayerDamage(
  user: User,
  task: Task
): { damage: number; isCritical: boolean } {
  let damage = 10; // Base damage

  // Task priority bonus (since Task doesn't have difficulty)
  switch (task.priority) {
    case "low":
      damage += 5;
      break;
    case "medium":
      damage += 15;
      break;
    case "high":
      damage += 30;
      break;
  }

  // Equipment bonuses (Weapon)
  if (user.equippedItems.weapon) {
    // Simple bonus for now, could be more complex based on weapon stats
    damage += 10;

    // Rarity bonus
    switch (user.equippedItems.weapon.rarity) {
      case "rare":
        damage += 5;
        break;
      case "epic":
        damage += 15;
        break;
      case "legendary":
        damage += 30;
        break;
    }
  }

  // Streak bonus (Critical hit chance)
  const critChance = Math.min(0.5, user.streak.current * 0.05);
  const isCritical = Math.random() < critChance;

  if (isCritical) {
    damage = Math.round(damage * 1.5);
  }

  return { damage, isCritical };
}

/**
 * Calculate damage monster deals to player (HP/Motivation)
 * Currently we don't track player HP in User type, so this might just be visual or affect XP
 */
export function calculateMonsterDamage(monster: Monster): number {
  return monster.attack;
}
