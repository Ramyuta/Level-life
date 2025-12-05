import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { get, set, del } from "idb-keyval";
import {
  User,
  Task,
  Habit,
  XpResult,
  Equipment,
  InventoryItem,
  BattleState,
} from "./types";
import { INITIAL_USER, XP_GROWTH_RATE } from "./constants";

interface StoreState {
  user: User;
  tasks: Task[];
  habits: Habit[];
  battle: BattleState;

  // Actions
  addXp: (amount: number) => XpResult;
  addGold: (amount: number) => void;
  updateUser: (updates: Partial<User>) => void;
  resetUser: () => void;
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  completeTask: (id: string) => number; // returns xp gained

  // Equipment actions
  equipItem: (equipment: Equipment) => boolean;
  unequipItem: (type: Equipment["type"]) => void;
  addToInventory: (equipment: Equipment) => void;
  removeFromInventory: (equipmentId: string) => void;
  purchaseEquipment: (equipment: Equipment) => boolean;

  // Skill actions
  unlockSkill: (skillId: string) => boolean;
  addSkillPoints: (amount: number) => void;

  // Battle actions
  startBattle: () => void;
  attackMonster: (taskId: string) => void;
  fleeBattle: () => void;
}

const storage = {
  getItem: async (name: string): Promise<string | null> => {
    if (typeof window === "undefined") return null;
    return (await get(name)) || null;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    if (typeof window === "undefined") return;
    await set(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    if (typeof window === "undefined") return;
    await del(name);
  },
};

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      user: INITIAL_USER,
      tasks: [],
      habits: [],
      battle: {
        isActive: false,
        monster: null,
        turn: "player",
        logs: [],
        lastActionAt: new Date().toISOString(),
      },

      addXp: (amount) => {
        const { user } = get();
        let { xp, level, nextLevelXp, stats } = user;
        let newXp = xp + amount;
        let leveledUp = false;

        while (newXp >= nextLevelXp) {
          newXp -= nextLevelXp;
          level += 1;
          nextLevelXp = Math.round(nextLevelXp * XP_GROWTH_RATE);
          leveledUp = true;
        }

        // Calculate gold reward (50% of XP)
        const goldReward = Math.round(amount * 0.5);

        // Calculate skill points earned from level ups
        const levelsGained = leveledUp ? 1 : 0;

        const updatedUser = {
          ...user,
          level,
          xp: newXp,
          nextLevelXp,
          stats: {
            ...stats,
            totalXpEarned: (stats?.totalXpEarned || 0) + amount,
            gold: (stats?.gold || 0) + goldReward,
            totalGoldEarned: (stats?.totalGoldEarned || 0) + goldReward,
            skillPoints: (stats?.skillPoints || 0) + levelsGained,
          },
        };

        set({ user: updatedUser });
        return { user: updatedUser, leveledUp, xpGained: amount };
      },

      updateUser: (updates) =>
        set((state) => ({ user: { ...state.user, ...updates } })),

      resetUser: () => set({ user: INITIAL_USER, tasks: [], habits: [] }),

      addTask: (task) => set((state) => ({ tasks: [task, ...state.tasks] })),

      updateTask: (id, updates) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, ...updates } : t
          ),
        })),

      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
        })),

      completeTask: (id) => {
        const state = get();
        const task = state.tasks.find((t) => t.id === id);
        if (!task || task.status === "done") return 0;

        const xpReward = task.xpReward;
        const today = new Date().toISOString().split("T")[0];

        // Update streak
        const { streak } = state.user;
        let newStreak = { ...streak };

        if (!streak.lastActiveDate) {
          // First activity
          newStreak.current = 1;
          newStreak.longest = 1;
          newStreak.lastActiveDate = today;
        } else if (streak.lastActiveDate === today) {
          // Already active today, no change
        } else {
          const lastDate = new Date(streak.lastActiveDate);
          const currentDate = new Date(today);
          const diffTime = currentDate.getTime() - lastDate.getTime();
          const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

          if (diffDays === 1) {
            // Consecutive day
            newStreak.current += 1;
            newStreak.longest = Math.max(newStreak.longest, newStreak.current);
            newStreak.lastActiveDate = today;
          } else if (diffDays > 1) {
            // Streak broken
            newStreak.current = 1;
            newStreak.lastActiveDate = today;
          }
        }

        // Update task
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id
              ? { ...t, status: "done", completedAt: new Date().toISOString() }
              : t
          ),
          user: {
            ...state.user,
            streak: newStreak,
            stats: {
              ...state.user.stats,
              tasksCompleted: (state.user.stats?.tasksCompleted || 0) + 1,
            },
          },
        }));

        // Add XP
        state.addXp(xpReward);

        // Check for battle attack
        const { battle, attackMonster } = get();
        if (battle.isActive) {
          attackMonster(id);
        }

        return xpReward;
      },

      addGold: (amount) =>
        set((state) => ({
          user: {
            ...state.user,
            stats: {
              ...state.user.stats,
              gold: (state.user.stats.gold || 0) + amount,
              totalGoldEarned: (state.user.stats.totalGoldEarned || 0) + amount,
            },
          },
        })),

      equipItem: (equipment) => {
        const { user } = get();

        // Check level requirement
        if (equipment.requiredLevel && user.level < equipment.requiredLevel) {
          return false;
        }

        // Equip the item
        set((state) => ({
          user: {
            ...state.user,
            equippedItems: {
              ...state.user.equippedItems,
              [equipment.type]: equipment,
            },
          },
        }));

        return true;
      },

      unequipItem: (type) =>
        set((state) => ({
          user: {
            ...state.user,
            equippedItems: {
              ...state.user.equippedItems,
              [type]: null,
            },
          },
        })),

      addToInventory: (equipment) =>
        set((state) => ({
          user: {
            ...state.user,
            inventory: [
              ...state.user.inventory,
              {
                equipment,
                acquiredAt: new Date().toISOString(),
              },
            ],
          },
        })),

      removeFromInventory: (equipmentId) =>
        set((state) => ({
          user: {
            ...state.user,
            inventory: state.user.inventory.filter(
              (item) => item.equipment.id !== equipmentId
            ),
          },
        })),

      purchaseEquipment: (equipment) => {
        const { user } = get();

        // Check if user has enough gold
        if ((user.stats.gold || 0) < equipment.price) {
          return false;
        }

        // Check level requirement
        if (equipment.requiredLevel && user.level < equipment.requiredLevel) {
          return false;
        }

        // Deduct gold and add to inventory
        set((state) => ({
          user: {
            ...state.user,
            stats: {
              ...state.user.stats,
              gold: (state.user.stats.gold || 0) - equipment.price,
            },
            inventory: [
              ...state.user.inventory,
              {
                equipment,
                acquiredAt: new Date().toISOString(),
              },
            ],
          },
        }));

        return true;
      },

      unlockSkill: (skillId) => {
        const { user } = get();
        // Dynamic import to avoid circular dependencies if possible, or just use the data
        // For now, we assume we can import or find the skill data.
        // In a real app, we might fetch from a catalog or pass the skill object.
        // Let's try to import the catalog.
        const {
          getSkillById,
        } = require("../features/skills/data/skillDefinitions");
        const skill = getSkillById(skillId);

        if (!skill) return false;

        // Check if already unlocked
        if (user.unlockedSkills?.some((s) => s.skillId === skillId)) {
          return false;
        }

        // Check skill points
        if ((user.stats.skillPoints || 0) < skill.cost) {
          return false;
        }

        // Deduct skill points and add to unlocked skills
        set((state) => ({
          user: {
            ...state.user,
            stats: {
              ...state.user.stats,
              skillPoints: (state.user.stats.skillPoints || 0) - skill.cost,
              skillPointsSpent:
                (state.user.stats.skillPointsSpent || 0) + skill.cost,
            },
            unlockedSkills: [
              ...(state.user.unlockedSkills || []),
              {
                skillId,
                level: 1,
                unlockedAt: new Date().toISOString(),
              },
            ],
          },
        }));

        return true;
      },

      addSkillPoints: (amount) =>
        set((state) => ({
          user: {
            ...state.user,
            stats: {
              ...state.user.stats,
              skillPoints: (state.user.stats.skillPoints || 0) + amount,
            },
          },
        })),

      startBattle: () => {
        const { tasks } = get();
        const { generateMonster } = require("./battleSystem");
        const monster = generateMonster(tasks);

        set({
          battle: {
            isActive: true,
            monster,
            turn: "player",
            logs: [
              {
                id: crypto.randomUUID(),
                message: `${monster.name}が現れた！`,
                type: "info",
                timestamp: new Date().toISOString(),
              },
            ],
            lastActionAt: new Date().toISOString(),
          },
        });
      },

      attackMonster: (taskId) => {
        const { battle, user, tasks } = get();
        if (!battle.isActive || !battle.monster) return;

        const task = tasks.find((t) => t.id === taskId);
        if (!task) return;

        const { calculatePlayerDamage } = require("./battleSystem");
        const { damage, isCritical } = calculatePlayerDamage(user, task);

        const newHp = Math.max(0, battle.monster.currentHp - damage);
        const isDefeated = newHp === 0;

        const logs: import("./types").BattleLog[] = [
          ...battle.logs,
          {
            id: crypto.randomUUID(),
            message: `${isCritical ? "クリティカル！" : ""}プレイヤーの攻撃！${damage}のダメージを与えた！`,
            type: isCritical ? "critical" : "damage",
            value: damage,
            timestamp: new Date().toISOString(),
          },
        ];

        if (isDefeated) {
          logs.push({
            id: crypto.randomUUID(),
            message: `${battle.monster.name}を倒した！`,
            type: "info",
            timestamp: new Date().toISOString(),
          });

          // Grant rewards
          const { addXp, addGold, addToInventory } = get();
          addXp(battle.monster.xpReward);
          addGold(battle.monster.goldReward);

          // Drop item check
          if (Math.random() < battle.monster.dropRate) {
            const { getDroppedEquipment } = require("./lootSystem");
            const dropped = getDroppedEquipment(1.5); // Bonus for boss drop
            if (dropped) {
              addToInventory(dropped);
              logs.push({
                id: crypto.randomUUID(),
                message: `宝箱から${dropped.name}を見つけた！`,
                type: "info" as const,
                timestamp: new Date().toISOString(),
              });
            }
          }
        }

        set((state) => ({
          battle: {
            ...state.battle,
            monster: state.battle.monster
              ? {
                  ...state.battle.monster,
                  currentHp: newHp,
                }
              : null,
            isActive: !isDefeated,
            logs,
            turn: isDefeated ? "player" : "monster",
            lastActionAt: new Date().toISOString(),
          },
        }));
      },

      fleeBattle: () => {
        set((state) => ({
          battle: {
            ...state.battle,
            isActive: false,
            monster: null,
            logs: [],
          },
        }));
      },
    }),
    {
      name: "level-life-storage",
      storage: createJSONStorage(() => storage),
      skipHydration: true, // We will hydrate manually or let it happen client-side
    }
  )
);
