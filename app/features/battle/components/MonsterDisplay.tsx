"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import type { Monster } from "../../../lib/types";
import { MONSTER_DEFINITIONS } from "../data/monsters";

interface MonsterDisplayProps {
  monster: Monster;
  isDamaged?: boolean;
}

export default function MonsterDisplay({
  monster,
  isDamaged,
}: MonsterDisplayProps) {
  const definition = MONSTER_DEFINITIONS[monster.type];
  const hpPercentage = (monster.currentHp / monster.maxHp) * 100;

  return (
    <div className="flex flex-col items-center justify-center p-8">
      {/* Monster Name & Level */}
      <div className="mb-4 text-center">
        <h2 className="text-2xl font-black text-white drop-shadow-lg">
          Lv.{monster.level} {monster.name}
        </h2>
      </div>

      {/* Monster Image/Emoji */}
      <motion.div
        animate={
          isDamaged
            ? { x: [0, -10, 10, -10, 10, 0], color: ["#fff", "#f00", "#fff"] }
            : { y: [0, -10, 0] }
        }
        transition={
          isDamaged
            ? { duration: 0.5 }
            : { duration: 2, repeat: Infinity, ease: "easeInOut" }
        }
        className="relative mb-8 text-9xl drop-shadow-2xl filter"
      >
        {definition.emoji}
      </motion.div>

      {/* HP Bar */}
      <div className="w-full max-w-md">
        <div className="mb-1 flex justify-between text-sm font-bold text-white">
          <span>HP</span>
          <span>
            {monster.currentHp} / {monster.maxHp}
          </span>
        </div>
        <div className="h-6 w-full overflow-hidden rounded-full bg-slate-800 ring-2 ring-slate-700">
          <motion.div
            initial={{ width: "100%" }}
            animate={{ width: `${hpPercentage}%` }}
            transition={{ duration: 0.5 }}
            className={`h-full ${
              hpPercentage > 50
                ? "bg-gradient-to-r from-green-500 to-emerald-600"
                : hpPercentage > 20
                  ? "bg-gradient-to-r from-yellow-500 to-orange-600"
                  : "bg-gradient-to-r from-red-500 to-rose-600"
            }`}
          />
        </div>
      </div>

      {/* Rewards Info */}
      <div className="mt-4 flex gap-4 text-sm font-bold text-slate-400">
        <div className="flex items-center gap-1">
          <span className="text-yellow-400">XP</span> {monster.xpReward}
        </div>
        <div className="flex items-center gap-1">
          <span className="text-yellow-400">💰</span> {monster.goldReward}
        </div>
      </div>
    </div>
  );
}
