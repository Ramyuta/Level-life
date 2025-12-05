"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "../../user/context/UserContext";
import { useQuests } from "../../quests/hooks/useQuests";
import MonsterDisplay from "./MonsterDisplay";
import { Sword, Shield, Skull, LogOut } from "lucide-react";

export default function BattlePage() {
  const { battle, startBattle, fleeBattle } = useUser() as any;
  const { quests, completeQuest } = useQuests();
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of logs
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [battle?.logs]);

  if (!battle?.isActive) {
    return (
      <div className="flex min-h-[80vh] flex-col items-center justify-center p-6 text-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md rounded-3xl bg-slate-900/50 p-8 ring-1 ring-slate-800 backdrop-blur-sm"
        >
          <div className="mb-6 text-6xl">🏰</div>
          <h1 className="mb-4 text-3xl font-black text-white">ボスバトル</h1>
          <p className="mb-8 text-slate-400">
            溜まったタスクがモンスターとなって襲いかかってきます。
            <br />
            タスクを完了してモンスターを倒し、報酬を獲得しましょう！
          </p>
          <button
            onClick={startBattle}
            className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-red-600 px-8 py-4 font-bold text-white transition-all hover:bg-red-500 hover:shadow-lg hover:shadow-red-500/30"
          >
            <Sword className="h-5 w-5" />
            <span>バトル開始</span>
          </button>
        </motion.div>
      </div>
    );
  }

  const activeQuests = quests.filter((q) => q.status === "active");

  return (
    <div className="min-h-screen bg-slate-950 p-4 pb-24 lg:p-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2 rounded-full bg-red-900/30 px-4 py-1 text-red-400 ring-1 ring-red-900/50">
            <Skull className="h-4 w-4" />
            <span className="text-sm font-bold">BOSS BATTLE</span>
          </div>
          <button
            onClick={fleeBattle}
            className="flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2 text-sm font-bold text-slate-400 hover:bg-slate-700 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            逃げる
          </button>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left Column: Monster & Logs */}
          <div className="space-y-6">
            {/* Monster Display */}
            <div className="relative overflow-hidden rounded-3xl bg-slate-900 ring-1 ring-slate-800">
              <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
              <div className="relative z-10">
                {battle.monster && (
                  <MonsterDisplay
                    monster={battle.monster}
                    isDamaged={
                      battle.logs[battle.logs.length - 1]?.type === "damage"
                    }
                  />
                )}
              </div>
            </div>

            {/* Battle Logs */}
            <div className="h-64 overflow-y-auto rounded-2xl bg-black/50 p-4 font-mono text-sm ring-1 ring-white/10">
              <div className="space-y-2">
                {battle.logs.map((log: any) => (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`flex items-start gap-2 ${
                      log.type === "damage"
                        ? "text-red-400"
                        : log.type === "critical"
                          ? "font-bold text-yellow-400"
                          : log.type === "heal"
                            ? "text-green-400"
                            : "text-slate-400"
                    }`}
                  >
                    <span className="opacity-50">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                    <span>{log.message}</span>
                  </motion.div>
                ))}
                <div ref={logsEndRef} />
              </div>
            </div>
          </div>

          {/* Right Column: Task Actions */}
          <div className="space-y-6">
            <div className="rounded-3xl bg-slate-900/50 p-6 ring-1 ring-slate-800">
              <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-white">
                <Sword className="h-5 w-5 text-red-500" />
                攻撃コマンド (タスク)
              </h3>

              <div className="space-y-3">
                {activeQuests.length === 0 ? (
                  <div className="text-center text-slate-500 py-8">
                    攻撃できるタスクがありません。
                    <br />
                    新しいクエストを作成してください。
                  </div>
                ) : (
                  activeQuests.map((quest) => (
                    <motion.button
                      key={quest.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => completeQuest(quest.id)}
                      className="group flex w-full items-center justify-between rounded-xl bg-slate-800 p-4 text-left transition-all hover:bg-slate-700 hover:ring-2 hover:ring-red-500/50"
                    >
                      <div>
                        <div className="font-bold text-white group-hover:text-red-400">
                          {quest.title}
                        </div>
                        <div className="text-xs text-slate-400">
                          {quest.xpReward} XP ダメージ
                        </div>
                      </div>
                      <div className="rounded-lg bg-slate-900 px-3 py-1 text-xs font-bold text-slate-500 group-hover:bg-red-500/20 group-hover:text-red-400">
                        ATTACK
                      </div>
                    </motion.button>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
