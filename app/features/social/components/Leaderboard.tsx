"use client";

import { motion } from "framer-motion";
import { Trophy, TrendingUp, Zap } from "lucide-react";
import Avatar from "../../../components/ui/Avatar";
import type { LeaderboardEntry } from "../../../lib/types";

interface LeaderboardProps {
  entries: LeaderboardEntry[];
}

export default function Leaderboard({ entries }: LeaderboardProps) {
  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl bg-slate-900/60 p-12 text-center ring-1 ring-white/5">
        <div className="mb-4 rounded-full bg-slate-800/50 p-4">
          <Trophy className="h-8 w-8 text-slate-500" />
        </div>
        <h3 className="mb-2 text-lg font-bold text-white">
          ランキングデータがありません
        </h3>
        <p className="text-sm text-slate-400">
          クエストを完了してランキングに参加しましょう
        </p>
      </div>
    );
  }

  const getRankColor = (rank: number) => {
    if (rank === 1) return "from-yellow-500 to-amber-500";
    if (rank === 2) return "from-slate-400 to-slate-500";
    if (rank === 3) return "from-orange-600 to-orange-700";
    return "from-slate-700 to-slate-800";
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-5 w-5" />;
    if (rank === 2) return <TrendingUp className="h-5 w-5" />;
    if (rank === 3) return <Zap className="h-5 w-5" />;
    return <span className="text-sm font-bold">#{rank}</span>;
  };

  return (
    <div className="space-y-3">
      <div className="mb-4 text-center">
        <h3 className="text-lg font-bold text-white">週間ランキング</h3>
        <p className="text-sm text-slate-400">今週獲得したXPで競争！</p>
      </div>

      {entries.map((entry, index) => (
        <motion.div
          key={entry.uid}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          className={`flex items-center gap-4 rounded-xl p-4 ring-1 transition-all ${
            entry.rank <= 3
              ? "bg-gradient-to-r " +
                getRankColor(entry.rank) +
                " ring-white/20"
              : "bg-slate-900/60 ring-white/5 hover:bg-slate-800/60"
          } ${entry.uid === "player" ? "ring-2 ring-indigo-500" : ""}`}
        >
          {/* Rank Badge */}
          <div
            className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${
              entry.rank <= 3
                ? "bg-white/20 text-white"
                : "bg-slate-800 text-slate-400"
            }`}
          >
            {getRankIcon(entry.rank)}
          </div>

          {/* Avatar */}
          <Avatar
            avatarId={entry.avatarId}
            name={entry.displayName}
            size="md"
          />

          {/* User Info */}
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-white">{entry.displayName}</h4>
              {entry.uid === "player" && (
                <span className="rounded-full bg-indigo-500/20 px-2 py-0.5 text-xs font-bold text-indigo-400">
                  YOU
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-300">
              <span>Lv {entry.level}</span>
            </div>
          </div>

          {/* Weekly XP Display */}
          <div className="text-right">
            <div className="text-2xl font-bold text-white">
              {entry.weeklyXp.toLocaleString()}
            </div>
            <div className="text-xs text-slate-400">週間XP</div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
