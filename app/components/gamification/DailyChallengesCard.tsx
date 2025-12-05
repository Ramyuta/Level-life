"use client";

import { Trophy, CheckCircle, Circle } from 'lucide-react';
import { useDailyChallenges } from '../../hooks/useDailyChallenges';
import { motion } from 'framer-motion';

export default function DailyChallengesCard() {
    const { challenges, claimReward } = useDailyChallenges();

    return (
        <div className="rounded-2xl bg-slate-800/50 p-6 ring-1 ring-white/10">
            <div className="flex items-center gap-2 mb-4">
                <Trophy className="h-5 w-5 text-yellow-400" />
                <h3 className="font-bold text-white">デイリーチャレンジ</h3>
            </div>

            <div className="space-y-3">
                {challenges.map((challenge) => (
                    <div
                        key={challenge.id}
                        className={`relative overflow-hidden rounded-xl p-3 transition-all ${challenge.isCompleted
                                ? 'bg-emerald-500/10 ring-1 ring-emerald-500/30'
                                : 'bg-slate-700/30 ring-1 ring-white/5'
                            }`}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                {challenge.isCompleted ? (
                                    <CheckCircle className="h-5 w-5 text-emerald-400" />
                                ) : (
                                    <Circle className="h-5 w-5 text-slate-500" />
                                )}
                                <div>
                                    <p className="font-semibold text-sm text-white">{challenge.title}</p>
                                    <p className="text-xs text-slate-400">{challenge.description}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xs font-bold text-yellow-400">+{challenge.reward.xp} XP</p>
                                <p className="text-xs font-bold text-amber-400">+{challenge.reward.gold} G</p>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-700">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min(100, (challenge.progress / challenge.target) * 100)}%` }}
                                className={`h-full ${challenge.isCompleted ? 'bg-emerald-500' : 'bg-indigo-500'
                                    }`}
                            />
                        </div>
                        <div className="mt-1 flex justify-between text-xs text-slate-400">
                            <span>{challenge.progress} / {challenge.target}</span>
                            {!challenge.isCompleted && challenge.progress >= challenge.target && (
                                <button
                                    onClick={() => claimReward(challenge.id)}
                                    className="font-bold text-emerald-400 hover:text-emerald-300"
                                >
                                    報酬を受け取る
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
