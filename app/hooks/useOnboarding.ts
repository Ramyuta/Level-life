"use client";

import { useState, useEffect } from "react";
import { useUser } from "../features/user/context/UserContext";
import { useStore } from "../lib/store";

const ONBOARDING_KEY = "level-life-onboarding-completed";
const SAMPLE_QUEST_KEY = "level-life-sample-quest-created";

export function useOnboarding() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const { user } = useUser() as any;
  const addTask = useStore((state) => state.addTask);

  useEffect(() => {
    // Check if onboarding has been completed
    if (typeof window !== "undefined") {
      const completed = localStorage.getItem(ONBOARDING_KEY);
      if (!completed) {
        setShowOnboarding(true);
      }
    }
  }, []);

  const createSampleQuest = () => {
    if (typeof window !== "undefined") {
      const sampleCreated = localStorage.getItem(SAMPLE_QUEST_KEY);
      if (!sampleCreated) {
        const sampleQuest = {
          id: crypto.randomUUID(),
          userId: "local-user",
          title: "初めてのクエスト：Level-Lifeを体験しよう！",
          description:
            "このクエストを完了して、XPとレベルアップを体験してみましょう。",
          category: "health",
          scheduleType: "once" as const,
          xpReward: 100,
          priority: "medium" as const,
          tags: ["チュートリアル", "初回"],
          status: "todo" as const,
          streak: { current: 0, longest: 0 },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          completedAt: null,
        };

        addTask(sampleQuest);
        localStorage.setItem(SAMPLE_QUEST_KEY, "true");
      }
    }
  };

  const completeOnboarding = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem(ONBOARDING_KEY, "true");
      setShowOnboarding(false);
    }
  };

  const skipOnboarding = () => {
    completeOnboarding();
  };

  const nextStep = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };

  const resetOnboarding = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(ONBOARDING_KEY);
      localStorage.removeItem(SAMPLE_QUEST_KEY);
      setCurrentStep(0);
      setShowOnboarding(true);
    }
  };

  return {
    showOnboarding,
    currentStep,
    nextStep,
    prevStep,
    completeOnboarding,
    skipOnboarding,
    resetOnboarding,
    createSampleQuest,
  };
}
