"use client";

import { Swords, Skull, Trophy } from 'lucide-react';
import { useWeeklyBoss } from '../../hooks/useWeeklyBoss';
import { motion } from 'framer-motion';

export default function WeeklyBossCard() {
    const { boss } = useWeeklyBoss();

    if (!boss) return null;

    const hpPercentage = (boss.hp / boss.maxHp) * 100;
    const isDefeated = boss.hp === 0;

    return (
        <div className="relative overflow-hidden rounded-2xl bg-slate-900 p-6 ring-1 ring-red-500/30">
            {/* Background Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 to-purple-900/20" />

            <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <div className="rounded-lg bg-red-500/20 p-2">
                            <Swords className="h-6 w-6 text-red-400" />
                        </div>
                        <div>
                            <h3 className="font-bold text-red-100">ウィークリーボス</h3>
                            <p className="text-xs text-red-300">今週の強敵を倒せ！</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <span className="text-xs font-bold text-slate-400">Lv.{boss.level}</span>
                    </div>
                </div>

                <div className="flex gap-4">
                    {/* Boss Image */}
                    <div className="flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-xl bg-slate-800 text-6xl shadow-lg ring-1 ring-white/10">
                        {isDefeated ? '💀' : boss.image}
                    </div>

                    {/* Boss Stats */}
                    <div className="flex-1 space-y-3">
                        <div>
                            <h4 className="font-bold text-white">{boss.name}</h4>
                            <p className="text-xs text-slate-400">{boss.description}</p>
                        </div>

                        {/* HP Bar */}
                        <div>
                            <div className="flex justify-between text-xs mb-1">
                                <span className="font-bold text-red-400">HP</span>
                                <span className="text-slate-400">{boss.hp} / {boss.maxHp}</span>
                            </div>
                            <div className="h-3 w-full overflow-hidden rounded-full bg-slate-800 ring-1 ring-white/10">
                                <motion.div
                                    initial={{ width: '100%' }}
                                    animate={{ width: `${hpPercentage}%` }}
                                    className="h-full bg-gradient-to-r from-red-600 to-red-500"
                                />
                            </div>
                        </div>

                        {/* Rewards */}
                        <div className="flex gap-3 text-xs">
                            <div className="flex items-center gap-1 text-yellow-400">
                                <Trophy className="h-3 w-3" />
                                <span>{boss.rewards.xp} XP</span>
                            </div>
                            <div className="flex items-center gap-1 text-amber-400">
                                <span>💰 {boss.rewards.gold} G</span>
                            </div>
                        </div>
                    </div>
                </div>

                {isDefeated && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm"
                    >
                        <div className="text-center">
                            <Trophy className="mx-auto h-12 w-12 text-yellow-400 mb-2" />
                            <h3 className="text-2xl font-bold text-white">討伐成功！</h3>
                            <p className="text-slate-300">報酬を獲得しました</p>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
