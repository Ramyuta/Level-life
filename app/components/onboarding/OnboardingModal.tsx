"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";
import { useOnboarding } from "../../hooks/useOnboarding";

const STEPS = [
  {
    title: "Level-Lifeへようこそ！",
    description: "人生をRPGのように楽しく、やる気を持続させるアプリです。",
    icon: Sparkles,
    content: (
      <div className="space-y-4 text-center">
        <div className="text-6xl">🎮</div>
        <h3 className="text-2xl font-black text-white">
          日常のタスクを
          <br />
          <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            冒険に変えよう
          </span>
        </h3>
        <p className="text-slate-400">
          タスクを完了してXPを獲得し、レベルアップ！
          <br />
          装備を集めて、フレンドと競い合おう。
        </p>
      </div>
    ),
  },
  {
    title: "クエストを作成しよう",
    description: "日常のタスクを「クエスト」として登録します。",
    icon: Target,
    content: (
      <div className="space-y-4">
        <div className="text-6xl text-center">📝</div>
        <div className="space-y-3 text-left">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-indigo-500 text-sm font-bold text-white">
              1
            </div>
            <div>
              <h4 className="font-bold text-white">タスクを登録</h4>
              <p className="text-sm text-slate-400">
                運動、勉強、仕事など、何でもOK
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-indigo-500 text-sm font-bold text-white">
              2
            </div>
            <div>
              <h4 className="font-bold text-white">難易度を選択</h4>
              <p className="text-sm text-slate-400">自動的にXPが計算されます</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-indigo-500 text-sm font-bold text-white">
              3
            </div>
            <div>
              <h4 className="font-bold text-white">完了してXP獲得！</h4>
              <p className="text-sm text-slate-400">
                レベルアップして強くなろう
              </p>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "さあ、冒険を始めよう！",
    description: "サンプルクエストを用意しました。完了してみましょう！",
    icon: TrendingUp,
    content: (
      <div className="space-y-4 text-center">
        <div className="text-6xl">🚀</div>
        <h3 className="text-2xl font-black text-white">準備完了！</h3>
        <div className="space-y-2 text-left rounded-xl bg-slate-800/50 p-4">
          <p className="text-sm font-bold text-indigo-400">💡 ヒント</p>
          <ul className="space-y-1 text-sm text-slate-300">
            <li>• タイマーを使うとボーナスXP</li>
            <li>• 毎日ログインでストリーク継続</li>
            <li>• レベルアップでスキルポイント獲得</li>
            <li>• ボスバトルで溜まったタスクを一掃</li>
          </ul>
        </div>
      </div>
    ),
  },
];

export default function OnboardingModal() {
  const {
    showOnboarding,
    currentStep,
    nextStep,
    prevStep,
    completeOnboarding,
    skipOnboarding,
    createSampleQuest,
  } = useOnboarding();

  const handleComplete = () => {
    createSampleQuest();
    completeOnboarding();
  };

  const step = STEPS[currentStep];
  const Icon = step.icon;

  return (
    <AnimatePresence>
      {showOnboarding && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 shadow-2xl ring-1 ring-white/10"
          >
            {/* Close button */}
            <button
              onClick={skipOnboarding}
              className="absolute right-4 top-4 rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Progress dots */}
            <div className="mb-8 flex justify-center gap-2">
              {STEPS.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 w-2 rounded-full transition-all ${
                    index === currentStep
                      ? "w-8 bg-indigo-500"
                      : index < currentStep
                        ? "bg-indigo-500/50"
                        : "bg-slate-700"
                  }`}
                />
              ))}
            </div>

            {/* Icon */}
            <div className="mb-6 flex justify-center">
              <div className="rounded-full bg-indigo-500/20 p-4">
                <Icon className="h-12 w-12 text-indigo-400" />
              </div>
            </div>

            {/* Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {step.content}
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="mt-8 flex items-center justify-between gap-4">
              <button
                onClick={prevStep}
                disabled={currentStep === 0}
                className="flex items-center gap-2 rounded-xl px-4 py-2 font-bold text-slate-400 transition-colors hover:text-white disabled:opacity-0"
              >
                <ChevronLeft className="h-5 w-5" />
                戻る
              </button>

              {currentStep < STEPS.length - 1 ? (
                <button
                  onClick={nextStep}
                  className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-bold text-white transition-colors hover:bg-indigo-500"
                >
                  次へ
                  <ChevronRight className="h-5 w-5" />
                </button>
              ) : (
                <button
                  onClick={handleComplete}
                  className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 font-bold text-white transition-transform hover:scale-105"
                >
                  始める！
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
