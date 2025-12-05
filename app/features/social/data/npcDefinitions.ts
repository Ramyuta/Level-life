import type { Friend } from "../../../lib/types";

export interface NPCDefinition extends Friend {
  personality: "hero" | "mage" | "merchant" | "villager";
  baseXpRate: number; // 1時間あたりの平均獲得XP
  activityFrequency: number; // アクティビティ発生頻度 (0-1)
}

export const NPC_DEFINITIONS: NPCDefinition[] = [
  {
    uid: "npc-allen",
    displayName: "勇者アレン",
    avatarId: "warrior",
    level: 45,
    friendCode: "HERO-001",
    status: "online",
    lastActive: new Date().toISOString(),
    personality: "hero",
    baseXpRate: 500,
    activityFrequency: 0.8,
  },
  {
    uid: "npc-lina",
    displayName: "魔法使いリナ",
    avatarId: "mage",
    level: 42,
    friendCode: "MAGE-001",
    status: "online",
    lastActive: new Date().toISOString(),
    personality: "mage",
    baseXpRate: 450,
    activityFrequency: 0.7,
  },
  {
    uid: "npc-tom",
    displayName: "商人トム",
    avatarId: "villager",
    level: 30,
    friendCode: "GOLD-001",
    status: "offline",
    lastActive: new Date().toISOString(),
    personality: "merchant",
    baseXpRate: 300,
    activityFrequency: 0.5,
  },
  {
    uid: "npc-sarah",
    displayName: "新人冒険者サラ",
    avatarId: "rogue",
    level: 12,
    friendCode: "NOOB-001",
    status: "online",
    lastActive: new Date().toISOString(),
    personality: "villager",
    baseXpRate: 200,
    activityFrequency: 0.9, // 頻繁に活動（レベルアップなど）
  },
];
