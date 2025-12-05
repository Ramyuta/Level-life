import type { Equipment, EquipmentRarity } from "./types";
import { ALL_EQUIPMENT } from "../features/shop/data/equipmentCatalog";

/**
 * Drop rates for each rarity
 */
const DROP_RATES: Record<EquipmentRarity, number> = {
  common: 0.1, // 10%
  rare: 0.03, // 3%
  epic: 0.01, // 1%
  legendary: 0.005, // 0.5%
};

/**
 * Calculate if a treasure chest should drop
 */
export function shouldDropTreasure(multiplier: number = 1): boolean {
  const totalDropRate = Object.values(DROP_RATES).reduce((a, b) => a + b, 0);
  return Math.random() < totalDropRate * multiplier;
}

/**
 * Determine which rarity to drop based on weighted probabilities
 */
export function getDropRarity(): EquipmentRarity {
  const rand = Math.random();
  let cumulative = 0;

  const rarities: EquipmentRarity[] = ["legendary", "epic", "rare", "common"];

  for (const rarity of rarities) {
    cumulative += DROP_RATES[rarity];
    if (rand < cumulative) {
      return rarity;
    }
  }

  return "common";
}

/**
 * Get a random equipment of the specified rarity
 */
export function getRandomEquipment(rarity: EquipmentRarity): Equipment | null {
  const equipmentOfRarity = ALL_EQUIPMENT.filter((eq) => eq.rarity === rarity);

  if (equipmentOfRarity.length === 0) {
    return null;
  }

  const randomIndex = Math.floor(Math.random() * equipmentOfRarity.length);
  return equipmentOfRarity[randomIndex];
}

/**
 * Main function to get a dropped equipment
 */
export function getDroppedEquipment(multiplier: number = 1): Equipment | null {
  if (!shouldDropTreasure(multiplier)) {
    return null;
  }

  const rarity = getDropRarity();
  return getRandomEquipment(rarity);
}

/**
 * Calculate equipment effect bonuses
 */
export function calculateEquipmentBonus(
  equippedItems: {
    weapon: Equipment | null;
    armor: Equipment | null;
    accessory: Equipment | null;
  },
  type: "xp_boost" | "gold_boost" | "timer_extension" | "streak_protection",
  category?: string
): number {
  let bonus = type.includes("boost") ? 1 : 0;

  Object.values(equippedItems).forEach((equipment) => {
    if (!equipment) return;

    equipment.effects.forEach((effect) => {
      if (effect.type !== type) return;
      if (effect.category && effect.category !== category) return;

      if (type.includes("boost")) {
        // Multiplicative for boosts
        bonus *= effect.value;
      } else {
        // Additive for others
        bonus += effect.value;
      }
    });
  });

  return bonus;
}
