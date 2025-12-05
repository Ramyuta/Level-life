"use client";

import { TrendingUp, TrendingDown, Trophy, Target, Flame, Calendar } from 'lucide-react';
import { useWeeklyReport } from '../../hooks/useWeeklyReport';
import { motion } from 'framer-motion';

export default function WeeklyReport() {
    const { getWeeklyStats } = useWeeklyReport();
    const stats = getWeeklyStats();

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' });
    };

    return (
        <div className="rounded-3xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 p-6 ring-1 ring-white/10">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h3 className="text-2xl font-bold text-white">週間レポート</h3>
                    <p className="text-sm text-slate-400">
                        {formatDate(stats.weekStart)} - {formatDate(stats.weekEnd)}
                    </p>
                </div>
                <div className="rounded-full bg-indigo-500/20 p-3">
                    <Calendar className="h-6 w-6 text-indigo-400" />
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                {/* Total XP */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 p-4 ring-1 ring-white/10"
                >
                    <div className="flex items-center gap-2 mb-2">
                        <Trophy className="h-5 w-5 text-emerald-400" />
                        <p className="text-sm text-slate-300">獲得XP</p>
                    </div>
                    <p className="text-3xl font-bold text-emerald-400">{stats.totalXpGained}</p>
                    <div className="mt-2 flex items-center gap-1">
                        {stats.comparisonToPreviousWeek >= 0 ? (
                            <TrendingUp className="h-4 w-4 text-emerald-400" />
                        ) : (
                            <TrendingDown className="h-4 w-4 text-rose-400" />
                        )}
                        <span className={`text-xs font-semibold ${stats.comparisonToPreviousWeek >= 0 ? 'text-emerald-400' : 'text-rose-400'
                            }`}>
                            {stats.comparisonToPreviousWeek >= 0 ? '+' : ''}{stats.comparisonToPreviousWeek}%
                        </span>
                        <span className="text-xs text-slate-400">vs 先週</span>
                    </div>
                </motion.div>

                {/* Quests Completed */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 p-4 ring-1 ring-white/10"
                >
                    <div className="flex items-center gap-2 mb-2">
                        <Target className="h-5 w-5 text-blue-400" />
                        <p className="text-sm text-slate-300">完了クエスト</p>
                    </div>
                    <p className="text-3xl font-bold text-blue-400">{stats.questsCompleted}</p>
                    <p className="mt-2 text-xs text-slate-400">
                        平均 {Math.round(stats.questsCompleted / 7)}/日
                    </p>
                </motion.div>

                {/* Current Streak */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-500/20 p-4 ring-1 ring-white/10"
                >
                    <div className="flex items-center gap-2 mb-2">
                        <Flame className="h-5 w-5 text-orange-400" />
                        <p className="text-sm text-slate-300">ストリーク</p>
                    </div>
                    <p className="text-3xl font-bold text-orange-400">{stats.dailyStreak}</p>
                    <p className="mt-2 text-xs text-slate-400">日連続</p>
                </motion.div>

                {/* Average Daily XP */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 p-4 ring-1 ring-white/10"
                >
                    <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="h-5 w-5 text-purple-400" />
                        <p className="text-sm text-slate-300">平均XP/日</p>
                    </div>
                    <p className="text-3xl font-bold text-purple-400">{stats.averageDailyXp}</p>
                    <p className="mt-2 text-xs text-slate-400">XP/日</p>
                </motion.div>
            </div>

            {/* Top Day */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="rounded-2xl bg-gradient-to-r from-yellow-500/10 to-amber-500/10 p-4 ring-1 ring-yellow-500/30"
            >
                <p className="text-sm text-slate-400 mb-2">🌟 最も活躍した日</p>
                <div className="flex items-center justify-between">
                    <p className="text-xl font-bold text-yellow-400">{stats.topDay.day}曜日</p>
                    <p className="text-2xl font-bold text-yellow-400">{stats.topDay.xp} XP</p>
                </div>
            </motion.div>

            {/* Motivational Message */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-4 rounded-2xl bg-slate-800/50 p-4"
            >
                <p className="text-sm text-slate-300">
                    {stats.comparisonToPreviousWeek >= 0 ? (
                        <>
                            🎉 素晴らしい！先週より<span className="font-bold text-emerald-400">{stats.comparisonToPreviousWeek}%</span>も成長しています！
                        </>
                    ) : (
                        <>
                            💪 今週は少し落ち込みましたが、次週は必ず巻き返せます！
                        </>
                    )}
                </p>
            </motion.div>
        </div>
    );
}
