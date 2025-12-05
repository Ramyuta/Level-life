"use client";

import { motion } from "framer-motion";
import type { Skill } from "../../../lib/types";

interface SkillNodeProps {
  skill: Skill;
  isUnlocked: boolean;
  isUnlockable: boolean;
  onUnlock: () => void;
  userSkillPoints: number;
}

export default function SkillNode({
  skill,
  isUnlocked,
  isUnlockable,
  onUnlock,
  userSkillPoints,
}: SkillNodeProps) {
  return (
    <div className="relative flex flex-col items-center">
      {/* Node Circle */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={onUnlock}
        disabled={isUnlocked || !isUnlockable}
        className={`relative z-10 flex h-20 w-20 items-center justify-center rounded-full border-4 shadow-lg transition-all ${
          isUnlocked
            ? "border-yellow-400 bg-gradient-to-br from-yellow-500 to-orange-600 text-white shadow-yellow-500/50"
            : isUnlockable
              ? "border-blue-400 bg-slate-800 text-blue-400 hover:border-blue-300 hover:text-blue-300 hover:shadow-blue-500/30"
              : "cursor-not-allowed border-slate-700 bg-slate-900 text-slate-700"
        }`}
      >
        <span className="text-3xl">{skill.icon}</span>
        {isUnlocked && (
          <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-xs font-bold text-white ring-2 ring-slate-900">
            ✓
          </div>
        )}
      </motion.button>

      {/* Info Card */}
      <div className="mt-4 w-48 rounded-xl bg-slate-800/90 p-3 text-center backdrop-blur-sm ring-1 ring-slate-700">
        <h3
          className={`font-bold ${
            isUnlocked
              ? "text-yellow-400"
              : isUnlockable
                ? "text-blue-400"
                : "text-slate-500"
          }`}
        >
          {skill.name}
        </h3>
        <p className="mt-1 text-xs text-slate-400">{skill.description}</p>
        {!isUnlocked && (
          <div className="mt-2 text-xs font-semibold text-slate-300">
            コスト: <span className="text-yellow-400">{skill.cost} SP</span>
          </div>
        )}
      </div>
    </div>
  );
}
