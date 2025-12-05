"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTimerStore } from "../../../lib/timerStore";
import { useTranslation } from "../../i18n/useTranslation";

interface TimerProps {
  questId?: string;
  questTitle?: string;
  duration?: number; // in minutes
  onComplete?: () => void;
  onCancel?: () => void;
}

export default function Timer({
  questId,
  questTitle,
  duration = 25,
  onComplete,
  onCancel,
}: TimerProps) {
  const {
    activeSession,
    startSession,
    pauseSession,
    resumeSession,
    stopSession,
  } = useTimerStore();
  const { t } = useTranslation();

  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [completed, setCompleted] = useState(false);

  // Restore active session if exists
  useEffect(() => {
    if (activeSession && activeSession.questId === questId) {
      const startTime = new Date(activeSession.startTime).getTime();
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const remaining = Math.max(0, duration * 60 - elapsed);
      setTimeLeft(remaining);
      setIsRunning(true);
      setIsPaused(false);
    }
  }, [activeSession, questId, duration]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && !isPaused && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            handleComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, isPaused, timeLeft]);

  const handleStart = () => {
    if (!questId) {
      alert(t("timer.selectQuest"));
      return;
    }
    startSession(questId, questTitle || "");
    setIsRunning(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    pauseSession();
    setIsPaused(true);
  };

  const handleResume = () => {
    resumeSession();
    setIsPaused(false);
  };

  const handleStop = () => {
    stopSession();
    setIsRunning(false);
    setIsPaused(false);
    setTimeLeft(duration * 60);
    onCancel?.();
  };

  const handleComplete = () => {
    stopSession();
    setCompleted(true);
    setIsRunning(false);
    setTimeout(() => {
      onComplete?.();
    }, 2000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const progress = ((duration * 60 - timeLeft) / (duration * 60)) * 100;
  const estimatedXp = Math.floor(duration * 2); // 2 XP per minute

  return (
    <div className="flex flex-col items-center space-y-6 text-center">
      <div className="relative">
        {/* Progress Ring */}
        <svg className="h-64 w-64 -rotate-90 transform">
          <circle
            cx="128"
            cy="128"
            r="120"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-slate-700"
          />
          <circle
            cx="128"
            cy="128"
            r="120"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={2 * Math.PI * 120}
            strokeDashoffset={
              2 * Math.PI * 120 - (progress / 100) * 2 * Math.PI * 120
            }
            className={`text-indigo-500 transition-all duration-1000 ${
              completed ? "text-emerald-500" : ""
            }`}
          />
        </svg>

        {/* Time Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {completed ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-emerald-400"
            >
              <span className="text-6xl">✓</span>
              <p className="mt-2 font-bold">{t("timer.completed")}</p>
            </motion.div>
          ) : (
            <>
              <span className="font-mono text-6xl font-bold text-white">
                {formatTime(timeLeft)}
              </span>
              <p className="mt-2 text-sm text-slate-400">
                {isRunning ? t("timer.active") : t("timer.start")}
              </p>
            </>
          )}
        </div>
      </div>

      {/* Quest Info */}
      <div className="space-y-1">
        <h3 className="text-xl font-bold text-white">
          {questTitle || t("quests.title")}
        </h3>
        <p className="text-sm text-indigo-300">
          {t("timer.estimatedXp")}: +{estimatedXp} XP
        </p>
      </div>

      {/* Controls */}
      <div className="flex gap-4">
        {!isRunning ? (
          <button
            onClick={handleStart}
            className="rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 px-8 py-3 font-bold text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
          >
            {t("timer.startButton")}
          </button>
        ) : (
          <>
            {isPaused ? (
              <button
                onClick={handleResume}
                className="rounded-full bg-emerald-500 px-8 py-3 font-bold text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
              >
                {t("timer.resume")}
              </button>
            ) : (
              <button
                onClick={handlePause}
                className="rounded-full bg-amber-500 px-8 py-3 font-bold text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
              >
                {t("timer.pause")}
              </button>
            )}
            <button
              onClick={handleStop}
              className="rounded-full bg-slate-700 px-6 py-3 font-bold text-slate-300 transition-colors hover:bg-slate-600"
            >
              {t("timer.stop")}
            </button>
          </>
        )}
      </div>

      {/* Instructions */}
      {!isRunning && !completed && (
        <div className="mt-8 max-w-sm rounded-xl bg-slate-800/50 p-4 text-left text-sm text-slate-400">
          <p className="mb-2 font-bold text-slate-300">💡 {t("timer.howTo")}</p>
          <ul className="list-inside list-disc space-y-1">
            <li>{t("timer.instruction1")}</li>
            <li>{t("timer.instruction2")}</li>
            <li>{t("timer.instruction3")}</li>
            <li>{t("timer.instruction4")}</li>
          </ul>
        </div>
      )}
    </div>
  );
}
