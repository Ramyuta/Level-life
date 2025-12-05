import type { Equipment } from "../../../lib/types";

/**
 * Equipment Catalog
 * マスターデータとして装備アイテムを定義
 */

// ============================================================================
// Weapons (武器) - XP Boost
// ============================================================================

export const WEAPONS: Equipment[] = [
  {
    id: "sword_beginner",
    name: "初心者の剣",
    description: "全カテゴリのXP獲得量+10%",
    type: "weapon",
    rarity: "common",
    price: 100,
    effects: [{ type: "xp_boost", value: 1.1 }],
    icon: "⚔️",
  },
  {
    id: "sword_iron",
    name: "鉄の剣",
    description: "全カテゴリのXP獲得量+20%",
    type: "weapon",
    rarity: "common",
    price: 300,
    effects: [{ type: "xp_boost", value: 1.2 }],
    icon: "🗡️",
  },
  {
    id: "sword_steel",
    name: "鋼の剣",
    description: "全カテゴリのXP獲得量+30%",
    type: "weapon",
    rarity: "rare",
    price: 800,
    effects: [{ type: "xp_boost", value: 1.3 }],
    icon: "⚔️",
    requiredLevel: 5,
  },
  {
    id: "sword_mithril",
    name: "ミスリルの剣",
    description: "全カテゴリのXP獲得量+50%",
    type: "weapon",
    rarity: "epic",
    price: 2000,
    effects: [{ type: "xp_boost", value: 1.5 }],
    icon: "🗡️",
    requiredLevel: 10,
  },
  {
    id: "sword_excalibur",
    name: "エクスカリバー",
    description: "全カテゴリのXP獲得量+100%",
    type: "weapon",
    rarity: "legendary",
    price: 10000,
    effects: [{ type: "xp_boost", value: 2.0 }],
    icon: "⚔️",
    requiredLevel: 20,
  },
  {
    id: "staff_wisdom",
    name: "知恵の杖",
    description: "学習カテゴリのXP獲得量+50%",
    type: "weapon",
    rarity: "rare",
    price: 600,
    effects: [{ type: "xp_boost", value: 1.5, category: "learning" }],
    icon: "🪄",
    requiredLevel: 5,
  },
  {
    id: "dumbbell_power",
    name: "パワーダンベル",
    description: "健康カテゴリのXP獲得量+50%",
    type: "weapon",
    rarity: "rare",
    price: 600,
    effects: [{ type: "xp_boost", value: 1.5, category: "health" }],
    icon: "🏋️",
    requiredLevel: 5,
  },
  {
    id: "briefcase_executive",
    name: "エグゼクティブブリーフケース",
    description: "仕事カテゴリのXP獲得量+50%",
    type: "weapon",
    rarity: "rare",
    price: 600,
    effects: [{ type: "xp_boost", value: 1.5, category: "work" }],
    icon: "💼",
    requiredLevel: 5,
  },
];

// ============================================================================
// Armor (防具) - Streak Protection & Gold Boost
// ============================================================================

export const ARMORS: Equipment[] = [
  {
    id: "armor_leather",
    name: "革の鎧",
    description: "ゴールド獲得量+10%",
    type: "armor",
    rarity: "common",
    price: 150,
    effects: [{ type: "gold_boost", value: 1.1 }],
    icon: "🛡️",
  },
  {
    id: "armor_chainmail",
    name: "チェインメイル",
    description: "ゴールド獲得量+20%",
    type: "armor",
    rarity: "common",
    price: 400,
    effects: [{ type: "gold_boost", value: 1.2 }],
    icon: "🛡️",
  },
  {
    id: "armor_plate",
    name: "プレートアーマー",
    description: "ゴールド獲得量+30%、ストリーク保護1回",
    type: "armor",
    rarity: "rare",
    price: 1000,
    effects: [
      { type: "gold_boost", value: 1.3 },
      { type: "streak_protection", value: 1 },
    ],
    icon: "🛡️",
    requiredLevel: 5,
  },
  {
    id: "armor_dragon",
    name: "ドラゴンアーマー",
    description: "ゴールド獲得量+50%、ストリーク保護2回",
    type: "armor",
    rarity: "epic",
    price: 3000,
    effects: [
      { type: "gold_boost", value: 1.5 },
      { type: "streak_protection", value: 2 },
    ],
    icon: "🛡️",
    requiredLevel: 10,
  },
  {
    id: "armor_divine",
    name: "神聖なる鎧",
    description: "ゴールド獲得量+100%、ストリーク保護5回",
    type: "armor",
    rarity: "legendary",
    price: 15000,
    effects: [
      { type: "gold_boost", value: 2.0 },
      { type: "streak_protection", value: 5 },
    ],
    icon: "🛡️",
    requiredLevel: 20,
  },
];

// ============================================================================
// Accessories (アクセサリー) - Special Effects
// ============================================================================

export const ACCESSORIES: Equipment[] = [
  {
    id: "ring_focus",
    name: "集中のリング",
    description: "タイマー時間+5分",
    type: "accessory",
    rarity: "common",
    price: 200,
    effects: [{ type: "timer_extension", value: 5 }],
    icon: "💍",
  },
  {
    id: "amulet_fortune",
    name: "幸運のアミュレット",
    description: "ゴールド獲得量+15%",
    type: "accessory",
    rarity: "common",
    price: 250,
    effects: [{ type: "gold_boost", value: 1.15 }],
    icon: "📿",
  },
  {
    id: "necklace_wisdom",
    name: "知恵のネックレス",
    description: "XP獲得量+15%",
    type: "accessory",
    rarity: "common",
    price: 250,
    effects: [{ type: "xp_boost", value: 1.15 }],
    icon: "📿",
  },
  {
    id: "ring_time",
    name: "時の指輪",
    description: "タイマー時間+10分",
    type: "accessory",
    rarity: "rare",
    price: 700,
    effects: [{ type: "timer_extension", value: 10 }],
    icon: "💍",
    requiredLevel: 5,
  },
  {
    id: "crown_king",
    name: "王の冠",
    description: "XP獲得量+25%、ゴールド獲得量+25%",
    type: "accessory",
    rarity: "epic",
    price: 2500,
    effects: [
      { type: "xp_boost", value: 1.25 },
      { type: "gold_boost", value: 1.25 },
    ],
    icon: "👑",
    requiredLevel: 10,
  },
  {
    id: "amulet_phoenix",
    name: "不死鳥のアミュレット",
    description: "ストリーク保護3回、XP獲得量+30%",
    type: "accessory",
    rarity: "legendary",
    price: 12000,
    effects: [
      { type: "streak_protection", value: 3 },
      { type: "xp_boost", value: 1.3 },
    ],
    icon: "🔥",
    requiredLevel: 15,
  },
  {
    id: "watch_eternal",
    name: "永遠の懐中時計",
    description: "タイマー時間+30分、XP獲得量+20%",
    type: "accessory",
    rarity: "legendary",
    price: 10000,
    effects: [
      { type: "timer_extension", value: 30 },
      { type: "xp_boost", value: 1.2 },
    ],
    icon: "⌚",
    requiredLevel: 15,
  },
];

// ============================================================================
// All Equipment
// ============================================================================

export const ALL_EQUIPMENT: Equipment[] = [
  ...WEAPONS,
  ...ARMORS,
  ...ACCESSORIES,
];

// ============================================================================
// Helper Functions
// ============================================================================

export function getEquipmentById(id: string): Equipment | undefined {
  return ALL_EQUIPMENT.find((eq) => eq.id === id);
}

export function getEquipmentByType(type: Equipment["type"]): Equipment[] {
  return ALL_EQUIPMENT.filter((eq) => eq.type === type);
}

export function getEquipmentByRarity(rarity: Equipment["rarity"]): Equipment[] {
  return ALL_EQUIPMENT.filter((eq) => eq.rarity === rarity);
}

export function getAffordableEquipment(gold: number): Equipment[] {
  return ALL_EQUIPMENT.filter((eq) => eq.price <= gold);
}

export function getEquipmentForLevel(level: number): Equipment[] {
  return ALL_EQUIPMENT.filter(
    (eq) => !eq.requiredLevel || eq.requiredLevel <= level
  );
}
