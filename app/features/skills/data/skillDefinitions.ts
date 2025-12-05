import type { Skill } from "../../../lib/types";

/**
 * Skill Definitions
 * 全スキルのマスターデータ
 */

// ============================================================================
// Focus Skills (集中力) 🎯
// ============================================================================

export const FOCUS_SKILLS: Skill[] = [
  {
    id: "extended_focus_1",
    name: "集中力強化 I",
    description: "タイマー時間が5分延長されます",
    category: "focus",
    cost: 1,
    maxLevel: 1,
    prerequisites: [],
    effects: [{ type: "timer_extension", value: 5 }],
    icon: "⏱️",
  },
  {
    id: "extended_focus_2",
    name: "集中力強化 II",
    description: "タイマー時間がさらに10分延長されます",
    category: "focus",
    cost: 1,
    maxLevel: 1,
    prerequisites: ["extended_focus_1"],
    effects: [{ type: "timer_extension", value: 10 }],
    icon: "⏱️",
  },
  {
    id: "deep_work",
    name: "深い集中",
    description: "タイマー実行中のXP獲得量が20%増加します",
    category: "focus",
    cost: 2,
    maxLevel: 1,
    prerequisites: ["extended_focus_2"],
    effects: [{ type: "xp_boost", value: 1.2 }],
    icon: "🧠",
  },
  {
    id: "flow_state",
    name: "フロー状態",
    description: "全カテゴリのXP獲得量が15%増加します",
    category: "focus",
    cost: 2,
    maxLevel: 1,
    prerequisites: [],
    effects: [{ type: "xp_boost", value: 1.15 }],
    icon: "🌊",
  },
];

// ============================================================================
// Resilience Skills (回復力) 💪
// ============================================================================

export const RESILIENCE_SKILLS: Skill[] = [
  {
    id: "streak_shield_1",
    name: "ストリーク保護 I",
    description: "ストリーク切れを1回防ぎます",
    category: "resilience",
    cost: 1,
    maxLevel: 1,
    prerequisites: [],
    effects: [{ type: "streak_protection", value: 1 }],
    icon: "🛡️",
  },
  {
    id: "streak_shield_2",
    name: "ストリーク保護 II",
    description: "ストリーク切れを2回防ぎます",
    category: "resilience",
    cost: 1,
    maxLevel: 1,
    prerequisites: ["streak_shield_1"],
    effects: [{ type: "streak_protection", value: 2 }],
    icon: "🛡️",
  },
  {
    id: "phoenix_rising",
    name: "不死鳥の復活",
    description: "ストリーク切れ時、50%の確率で復活します",
    category: "resilience",
    cost: 2,
    maxLevel: 1,
    prerequisites: ["streak_shield_2"],
    effects: [{ type: "streak_protection", value: 3 }],
    icon: "🔥",
  },
  {
    id: "iron_will",
    name: "鋼の意志",
    description: "ストリーク保護回数が1回増加します",
    category: "resilience",
    cost: 2,
    maxLevel: 1,
    prerequisites: [],
    effects: [{ type: "streak_protection", value: 1 }],
    icon: "💎",
  },
];

// ============================================================================
// Efficiency Skills (効率化) ⚡
// ============================================================================

export const EFFICIENCY_SKILLS: Skill[] = [
  {
    id: "quick_learner",
    name: "早習得",
    description: "全カテゴリのXP獲得量が10%増加します",
    category: "efficiency",
    cost: 1,
    maxLevel: 1,
    prerequisites: [],
    effects: [{ type: "xp_boost", value: 1.1 }],
    icon: "📚",
  },
  {
    id: "master_learner",
    name: "達人",
    description: "全カテゴリのXP獲得量が20%増加します",
    category: "efficiency",
    cost: 2,
    maxLevel: 1,
    prerequisites: ["quick_learner"],
    effects: [{ type: "xp_boost", value: 1.2 }],
    icon: "🎓",
  },
  {
    id: "gold_rush",
    name: "ゴールドラッシュ",
    description: "ゴールド獲得量が30%増加します",
    category: "efficiency",
    cost: 1,
    maxLevel: 1,
    prerequisites: [],
    effects: [{ type: "gold_boost", value: 1.3 }],
    icon: "💰",
  },
  {
    id: "treasure_hunter",
    name: "トレジャーハンター",
    description: "宝箱のドロップ率が50%増加します",
    category: "efficiency",
    cost: 2,
    maxLevel: 1,
    prerequisites: ["gold_rush"],
    effects: [{ type: "drop_rate_boost", value: 1.5 }],
    icon: "🗺️",
  },
  {
    id: "double_rewards",
    name: "二倍の報酬",
    description: "XPとゴールドの獲得量が両方15%増加します",
    category: "efficiency",
    cost: 3,
    maxLevel: 1,
    prerequisites: ["master_learner", "gold_rush"],
    effects: [
      { type: "xp_boost", value: 1.15 },
      { type: "gold_boost", value: 1.15 },
    ],
    icon: "✨",
  },
];

// ============================================================================
// Social Skills (ソーシャル) 👥
// ============================================================================

export const SOCIAL_SKILLS: Skill[] = [
  {
    id: "team_player",
    name: "チームプレイヤー",
    description: "フレンドのクエスト完了時、自分もXPを5%獲得します",
    category: "social",
    cost: 1,
    maxLevel: 1,
    prerequisites: [],
    effects: [{ type: "friend_xp_share", value: 0.05 }],
    icon: "🤝",
  },
  {
    id: "mentor",
    name: "メンター",
    description:
      "自分より低レベルのフレンドがクエスト完了時、ボーナスXPを獲得します",
    category: "social",
    cost: 2,
    maxLevel: 1,
    prerequisites: ["team_player"],
    effects: [{ type: "friend_xp_share", value: 0.1 }],
    icon: "👨‍🏫",
  },
  {
    id: "guild_master",
    name: "ギルドマスター",
    description: "フレンドからのXPシェアが2倍になります",
    category: "social",
    cost: 2,
    maxLevel: 1,
    prerequisites: ["mentor"],
    effects: [{ type: "friend_xp_share", value: 0.2 }],
    icon: "👑",
  },
];

// ============================================================================
// All Skills
// ============================================================================

export const ALL_SKILLS: Skill[] = [
  ...FOCUS_SKILLS,
  ...RESILIENCE_SKILLS,
  ...EFFICIENCY_SKILLS,
  ...SOCIAL_SKILLS,
];

// ============================================================================
// Helper Functions
// ============================================================================

export function getSkillById(id: string): Skill | undefined {
  return ALL_SKILLS.find((skill) => skill.id === id);
}

export function getSkillsByCategory(category: Skill["category"]): Skill[] {
  return ALL_SKILLS.filter((skill) => skill.category === category);
}

export function canUnlockSkill(
  skill: Skill,
  unlockedSkills: string[],
  availablePoints: number
): { canUnlock: boolean; reason?: string } {
  // Check if already unlocked
  if (unlockedSkills.includes(skill.id)) {
    return { canUnlock: false, reason: "既にアンロック済みです" };
  }

  // Check skill points
  if (availablePoints < skill.cost) {
    return { canUnlock: false, reason: "スキルポイントが不足しています" };
  }

  // Check prerequisites
  for (const prereqId of skill.prerequisites) {
    if (!unlockedSkills.includes(prereqId)) {
      const prereq = getSkillById(prereqId);
      return {
        canUnlock: false,
        reason: `前提スキル「${prereq?.name}」が必要です`,
      };
    }
  }

  return { canUnlock: true };
}
