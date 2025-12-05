import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { TimerSession } from "./types";

interface TimerState {
  activeSession: TimerSession | null;
  sessions: TimerSession[];
  isRunning: boolean;
  elapsedSeconds: number;

  // Actions
  startSession: (questId: string, questTitle: string) => void;
  pauseSession: () => void;
  resumeSession: () => void;
  stopSession: () => TimerSession | null;
  tick: () => void;
  clearActiveSession: () => void;
}

export const useTimerStore = create<TimerState>()(
  persist(
    (set, get) => ({
      activeSession: null,
      sessions: [],
      isRunning: false,
      elapsedSeconds: 0,

      startSession: (questId: string, questTitle: string) => {
        const now = new Date().toISOString();
        const newSession: TimerSession = {
          id: `timer-${Date.now()}`,
          questId,
          questTitle,
          startTime: now,
          durationMinutes: 0,
          xpGained: 0,
          status: "running",
        };

        set({
          activeSession: newSession,
          isRunning: true,
          elapsedSeconds: 0,
        });
      },

      pauseSession: () => {
        set({ isRunning: false });
      },

      resumeSession: () => {
        const { activeSession } = get();
        if (activeSession) {
          set({ isRunning: true });
        }
      },

      stopSession: () => {
        const { activeSession, elapsedSeconds } = get();
        if (!activeSession) return null;

        const durationMinutes = Math.floor(elapsedSeconds / 60);
        const xpGained = Math.round(durationMinutes * 2); // 1分 = 2XP

        const completedSession: TimerSession = {
          ...activeSession,
          endTime: new Date().toISOString(),
          durationMinutes,
          xpGained,
          status: "completed",
        };

        set((state) => ({
          activeSession: null,
          isRunning: false,
          elapsedSeconds: 0,
          sessions: [completedSession, ...state.sessions],
        }));

        return completedSession;
      },

      tick: () => {
        const { isRunning } = get();
        if (isRunning) {
          set((state) => ({
            elapsedSeconds: state.elapsedSeconds + 1,
          }));
        }
      },

      clearActiveSession: () => {
        set({
          activeSession: null,
          isRunning: false,
          elapsedSeconds: 0,
        });
      },
    }),
    {
      name: "level-life-timer",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        sessions: state.sessions,
        // Don't persist active session to avoid stale timers
      }),
    }
  )
);
