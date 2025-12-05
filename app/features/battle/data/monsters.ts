import type { MonsterType } from "../../../lib/types";

export interface MonsterDefinition {
  type: MonsterType;
  name: string;
  baseHp: number;
  baseAttack: number;
  baseXp: number;
  baseGold: number;
  dropRate: number;
  minTasks: number; // 出現に必要な最小タスク数
  description: string;
  emoji: string;
}

export const MONSTER_DEFINITIONS: Record<MonsterType, MonsterDefinition> = {
  slime: {
    type: "slime",
    name: "プロクラスティ・スライム",
    baseHp: 100,
    baseAttack: 5,
    baseXp: 50,
    baseGold: 10,
    dropRate: 0.05,
    minTasks: 1,
    description: "先延ばしの具現化。まだ弱いが、放置すると増えるかもしれない。",
    emoji: "💧",
  },
  goblin: {
    type: "goblin",
    name: "タスク・ゴブリン",
    baseHp: 300,
    baseAttack: 15,
    baseXp: 150,
    baseGold: 50,
    dropRate: 0.1,
    minTasks: 4,
    description:
      "溜まったタスクが邪悪な意思を持った姿。意地悪な攻撃をしてくる。",
    emoji: "👺",
  },
  dragon: {
    type: "dragon",
    name: "デッドライン・ドラゴン",
    baseHp: 1000,
    baseAttack: 50,
    baseXp: 500,
    baseGold: 200,
    dropRate: 0.5,
    minTasks: 8,
    description: "期限切れタスクの集合体。圧倒的な力でプレイヤーを圧迫する。",
    emoji: "🐉",
  },
  demon_king: {
    type: "demon_king",
    name: "魔王バーンアウト",
    baseHp: 5000,
    baseAttack: 100,
    baseXp: 2000,
    baseGold: 1000,
    dropRate: 1.0,
    minTasks: 15,
    description: "燃え尽き症候群の化身。全てを無に帰そうとする。",
    emoji: "😈",
  },
};

export function getMonsterByTaskCount(taskCount: number): MonsterDefinition {
  if (taskCount >= 15) return MONSTER_DEFINITIONS.demon_king;
  if (taskCount >= 8) return MONSTER_DEFINITIONS.dragon;
  if (taskCount >= 4) return MONSTER_DEFINITIONS.goblin;
  return MONSTER_DEFINITIONS.slime;
}
