"use client";

import { useState, useEffect, useCallback } from "react";
import { NPC_DEFINITIONS } from "../data/npcDefinitions";
import type {
  Friend,
  FriendActivity,
  LeaderboardEntry,
} from "../../../lib/types";

const ACTIVITY_TEMPLATES = {
  levelup: (name: string, level: number) => `レベル${level}に到達しました！`,
  quest_complete: (name: string) => `難関クエストを完了しました！`,
  boss_defeat: (name: string, boss: string) => `${boss}を撃破しました！`,
  item_get: (name: string, item: string) => `${item}を入手しました！`,
  achievement: (name: string, achievement: string) =>
    `実績「${achievement}」を解除しました！`,
  streak_milestone: (name: string, days: number) =>
    `${days}日連続ログインを達成！`,
};

const BOSS_NAMES = ["スライム", "ゴブリン", "ドラゴン", "魔王バーンアウト"];
const ITEM_NAMES = ["伝説の剣", "魔法の杖", "黄金の鎧", "幸運のお守り"];
const ACHIEVEMENT_NAMES = ["百戦錬磨", "不屈の意志", "知識の探求者", "富豪"];

/**
 * NPC friends simulation hook
 * Generates activities and updates NPC stats over time
 */
export function useSocialSimulation() {
  const [npcFriends, setNpcFriends] = useState<Friend[]>([]);
  const [activities, setActivities] = useState<FriendActivity[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  // Initialize NPCs
  useEffect(() => {
    const initialNpcs = NPC_DEFINITIONS.map((npc) => ({
      uid: npc.uid,
      displayName: npc.displayName,
      avatarId: npc.avatarId,
      level: npc.level,
      friendCode: npc.friendCode,
      status: npc.status,
      lastActive: npc.lastActive,
    }));
    setNpcFriends(initialNpcs);

    // Generate initial activities
    const initialActivities = generateInitialActivities();
    setActivities(initialActivities);
  }, []);

  const generateInitialActivities = (): FriendActivity[] => {
    const activities: FriendActivity[] = [];
    const now = Date.now();

    NPC_DEFINITIONS.forEach((npc, index) => {
      // Generate 2-3 activities per NPC
      const activityCount = Math.floor(Math.random() * 2) + 2;

      for (let i = 0; i < activityCount; i++) {
        const timestamp = new Date(
          now - index * 3600000 - i * 1800000
        ).toISOString();
        activities.push(generateRandomActivity(npc, timestamp));
      }
    });

    return activities.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  };

  const generateRandomActivity = (
    npc: (typeof NPC_DEFINITIONS)[0],
    timestamp: string
  ): FriendActivity => {
    const types: Array<keyof typeof ACTIVITY_TEMPLATES> = [
      "quest_complete",
      "boss_defeat",
      "item_get",
      "achievement",
      "streak_milestone",
    ];

    const type = types[Math.floor(Math.random() * types.length)];
    let detail = "";

    switch (type) {
      case "levelup":
        detail = ACTIVITY_TEMPLATES.levelup(npc.displayName, npc.level);
        break;
      case "quest_complete":
        detail = ACTIVITY_TEMPLATES.quest_complete(npc.displayName);
        break;
      case "boss_defeat":
        const boss = BOSS_NAMES[Math.floor(Math.random() * BOSS_NAMES.length)];
        detail = ACTIVITY_TEMPLATES.boss_defeat(npc.displayName, boss);
        break;
      case "item_get":
        const item = ITEM_NAMES[Math.floor(Math.random() * ITEM_NAMES.length)];
        detail = ACTIVITY_TEMPLATES.item_get(npc.displayName, item);
        break;
      case "achievement":
        const achievement =
          ACHIEVEMENT_NAMES[
          Math.floor(Math.random() * ACHIEVEMENT_NAMES.length)
          ];
        detail = ACTIVITY_TEMPLATES.achievement(npc.displayName, achievement);
        break;
      case "streak_milestone":
        const days = [7, 14, 30, 50, 100][Math.floor(Math.random() * 5)];
        detail = ACTIVITY_TEMPLATES.streak_milestone(npc.displayName, days);
        break;
    }

    return {
      id: `${npc.uid}-${timestamp}-${type}`,
      userId: npc.uid,
      userDisplayName: npc.displayName,
      userAvatarId: npc.avatarId,
      type,
      detail,
      timestamp,
      likes: Math.floor(Math.random() * 10),
    };
  };

  // Simulate NPC activity periodically
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly generate new activity from one NPC
      const npc =
        NPC_DEFINITIONS[Math.floor(Math.random() * NPC_DEFINITIONS.length)];

      if (Math.random() < npc.activityFrequency / 10) {
        // Reduced frequency
        const newActivity = generateRandomActivity(
          npc,
          new Date().toISOString()
        );

        setActivities((prev) => {
          const updated = [newActivity, ...prev];
          // Keep only last 50 activities
          return updated.slice(0, 50);
        });
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  // Update leaderboard
  const updateLeaderboard = useCallback(
    (
      userXp: number,
      userLevel: number,
      userName: string,
      userAvatar: string
    ) => {
      const entries: LeaderboardEntry[] = [
        {
          uid: "player",
          displayName: userName,
          avatarId: userAvatar,
          level: userLevel,
          weeklyXp: userXp,
          rank: 0,
        },
        ...NPC_DEFINITIONS.map((npc) => ({
          uid: npc.uid,
          displayName: npc.displayName,
          avatarId: npc.avatarId,
          level: npc.level,
          weeklyXp: Math.floor(
            npc.baseXpRate * 24 * 7 * (0.8 + Math.random() * 0.4)
          ),
          rank: 0,
        })),
      ];

      // Sort by weeklyXp and assign ranks
      entries.sort((a, b) => b.weeklyXp - a.weeklyXp);
      entries.forEach((entry, index) => {
        entry.rank = index + 1;
      });

      setLeaderboard(entries);
    },
    []
  );

  const addPlayerActivity = useCallback(
    (activity: Omit<FriendActivity, "id" | "timestamp" | "likes">) => {
      const newActivity: FriendActivity = {
        ...activity,
        id: `player-${Date.now()}`,
        timestamp: new Date().toISOString(),
        likes: 0,
      };

      setActivities((prev) => [newActivity, ...prev].slice(0, 50));
    },
    []
  );

  return {
    npcFriends,
    activities,
    leaderboard,
    updateLeaderboard,
    addPlayerActivity,
  };
}
