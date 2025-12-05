"use client";

import { useState } from "react";
import { useUser } from "../../user/context/UserContext";
import { useToast } from "../../../context/ToastContext";
import { useConfirm } from "../../../context/ConfirmContext";
import {
  ALL_SKILLS,
  getSkillsByCategory,
  canUnlockSkill,
} from "../data/skillDefinitions";
import SkillNode from "./SkillNode";
import type { SkillCategory } from "../../../lib/types";

const CATEGORIES: { id: SkillCategory; label: string; icon: string }[] = [
  { id: "focus", label: "集中力", icon: "🎯" },
  { id: "resilience", label: "回復力", icon: "💪" },
  { id: "efficiency", label: "効率化", icon: "⚡" },
  { id: "social", label: "ソーシャル", icon: "👥" },
];

export default function SkillTreePage() {
  const { user, unlockSkill } = useUser() as any;
  const { showToast } = useToast();
  const { confirm } = useConfirm();
  const [activeCategory, setActiveCategory] = useState<SkillCategory>("focus");

  const skills = getSkillsByCategory(activeCategory);
  const unlockedSkillIds =
    user.unlockedSkills?.map((s: any) => s.skillId) || [];
  const skillPoints = user.stats.skillPoints || 0;

  const handleUnlock = async (skill: any) => {
    const { canUnlock, reason } = canUnlockSkill(
      skill,
      unlockedSkillIds,
      skillPoints
    );

    if (!canUnlock) {
      showToast(reason || "アンロックできません", "error");
      return;
    }

    const confirmed = await confirm({
      title: "スキル習得",
      message: `${skill.name}を習得しますか？（コスト: ${skill.cost} SP）`,
      confirmText: "習得する",
    });

    if (!confirmed) return;

    const success = unlockSkill(skill.id);
    if (success) {
      showToast(`${skill.name}を習得しました！`, "success");
    } else {
      showToast("習得に失敗しました", "error");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div>
            <h1 className="mb-2 text-4xl font-black text-white">
              🌳 スキルツリー
            </h1>
            <p className="text-slate-400">
              スキルポイントを使って能力を強化しよう
            </p>
          </div>
          <div className="rounded-2xl bg-gradient-to-r from-yellow-500/20 to-orange-500/20 p-4 ring-1 ring-yellow-500/30">
            <p className="text-sm text-yellow-200">スキルポイント</p>
            <p className="text-3xl font-black text-yellow-400">
              ⭐ {skillPoints}
            </p>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 rounded-xl px-6 py-3 font-bold transition-all ${
                activeCategory === cat.id
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 ring-2 ring-indigo-400"
                  : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200"
              }`}
            >
              <span className="text-xl">{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Skill Tree Visualization */}
        <div className="relative min-h-[600px] rounded-3xl bg-slate-900/50 p-8 ring-1 ring-slate-800">
          {/* Background Grid */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: "radial-gradient(#4f46e5 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          ></div>

          <div className="relative z-10 flex flex-col items-center gap-16">
            {/* Level 1 Skills */}
            <div className="flex flex-wrap justify-center gap-16">
              {skills
                .filter((s) => s.prerequisites.length === 0)
                .map((skill) => (
                  <SkillNode
                    key={skill.id}
                    skill={skill}
                    isUnlocked={unlockedSkillIds.includes(skill.id)}
                    isUnlockable={
                      canUnlockSkill(skill, unlockedSkillIds, skillPoints)
                        .canUnlock
                    }
                    onUnlock={() => handleUnlock(skill)}
                    userSkillPoints={skillPoints}
                  />
                ))}
            </div>

            {/* Level 2 Skills */}
            <div className="flex flex-wrap justify-center gap-16">
              {skills
                .filter(
                  (s) =>
                    s.prerequisites.length > 0 &&
                    skills.find((p) => s.prerequisites.includes(p.id))
                      ?.prerequisites.length === 0
                )
                .map((skill) => (
                  <SkillNode
                    key={skill.id}
                    skill={skill}
                    isUnlocked={unlockedSkillIds.includes(skill.id)}
                    isUnlockable={
                      canUnlockSkill(skill, unlockedSkillIds, skillPoints)
                        .canUnlock
                    }
                    onUnlock={() => handleUnlock(skill)}
                    userSkillPoints={skillPoints}
                  />
                ))}
            </div>

            {/* Level 3 Skills */}
            <div className="flex flex-wrap justify-center gap-16">
              {skills
                .filter((s) => {
                  const prereq = skills.find((p) =>
                    s.prerequisites.includes(p.id)
                  );
                  return prereq && prereq.prerequisites.length > 0;
                })
                .map((skill) => (
                  <SkillNode
                    key={skill.id}
                    skill={skill}
                    isUnlocked={unlockedSkillIds.includes(skill.id)}
                    isUnlockable={
                      canUnlockSkill(skill, unlockedSkillIds, skillPoints)
                        .canUnlock
                    }
                    onUnlock={() => handleUnlock(skill)}
                    userSkillPoints={skillPoints}
                  />
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
