"use client";

import type { Equipment, EquipmentRarity } from "../../../lib/types";

const RARITY_COLORS: Record<
  EquipmentRarity,
  { bg: string; ring: string; text: string }
> = {
  common: {
    bg: "from-gray-700/50 to-gray-800/50",
    ring: "ring-gray-500/30",
    text: "text-gray-300",
  },
  rare: {
    bg: "from-blue-700/50 to-blue-800/50",
    ring: "ring-blue-500/30",
    text: "text-blue-300",
  },
  epic: {
    bg: "from-purple-700/50 to-purple-800/50",
    ring: "ring-purple-500/30",
    text: "text-purple-300",
  },
  legendary: {
    bg: "from-yellow-700/50 to-yellow-800/50",
    ring: "ring-yellow-500/30",
    text: "text-yellow-300",
  },
};

const EFFECT_LABELS: Record<string, string> = {
  xp_boost: "XP獲得量",
  gold_boost: "ゴールド獲得量",
  streak_protection: "ストリーク保護",
  timer_extension: "タイマー延長",
};

interface EquipmentCardProps {
  equipment: Equipment;
  userGold: number;
  userLevel: number;
  onPurchase: () => void;
}

export default function EquipmentCard({
  equipment,
  userGold,
  userLevel,
  onPurchase,
}: EquipmentCardProps) {
  const colors = RARITY_COLORS[equipment.rarity];
  const canAfford = userGold >= equipment.price;
  const meetsLevel =
    !equipment.requiredLevel || userLevel >= equipment.requiredLevel;
  const canPurchase = canAfford && meetsLevel;

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${colors.bg} p-6 ring-1 ${colors.ring} transition-all hover:scale-105 hover:shadow-xl`}
    >
      {/* Icon */}
      <div className="mb-4 text-center text-6xl">{equipment.icon}</div>

      {/* Name */}
      <h3 className={`mb-2 text-center text-xl font-bold ${colors.text}`}>
        {equipment.name}
      </h3>

      {/* Description */}
      <p className="mb-4 text-center text-sm text-slate-300">
        {equipment.description}
      </p>

      {/* Effects */}
      <div className="mb-4 space-y-1">
        {equipment.effects.map((effect, index) => (
          <div
            key={index}
            className="flex items-center justify-between text-sm"
          >
            <span className="text-slate-400">
              {EFFECT_LABELS[effect.type]}
              {effect.category && ` (${effect.category})`}
            </span>
            <span className="font-semibold text-green-400">
              {effect.type.includes("boost")
                ? `+${Math.round((effect.value - 1) * 100)}%`
                : effect.type === "timer_extension"
                  ? `+${effect.value}分`
                  : `×${effect.value}`}
            </span>
          </div>
        ))}
      </div>

      {/* Level Requirement */}
      {equipment.requiredLevel && (
        <div className="mb-3 text-center">
          <span
            className={`text-sm ${
              meetsLevel ? "text-green-400" : "text-red-400"
            }`}
          >
            必要レベル: {equipment.requiredLevel}
          </span>
        </div>
      )}

      {/* Price & Purchase Button */}
      <div className="space-y-2">
        <div className="flex items-center justify-center gap-2">
          <span className="text-2xl">💰</span>
          <span
            className={`text-2xl font-black ${
              canAfford ? "text-yellow-400" : "text-red-400"
            }`}
          >
            {equipment.price}
          </span>
        </div>

        <button
          onClick={onPurchase}
          disabled={!canPurchase}
          className={`w-full rounded-xl py-3 font-bold transition-all ${
            canPurchase
              ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-500 hover:to-purple-500 active:scale-95"
              : "cursor-not-allowed bg-slate-700 text-slate-500"
          }`}
        >
          {!meetsLevel ? "レベル不足" : !canAfford ? "ゴールド不足" : "購入"}
        </button>
      </div>
    </div>
  );
}
