"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../auth/context/AuthContext";
import { useUser } from "../../user/context/UserContext";
import { getDataClient } from "../../../lib/data/dataClient";
import type { Friend, LeaderboardEntry } from "../../../lib/types";

export function useFriends() {
  const { user: firebaseUser, firebaseAvailable } = useAuth();
  const { user } = useUser();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const userId = firebaseUser?.uid || "local-user";
  const storageMode = user.settings.storageMode;
  const dataClient = getDataClient(storageMode, firebaseAvailable);

  const loadFriends = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const loadedFriends = await dataClient.getFriends(userId);
      setFriends(loadedFriends);
    } catch (err) {
      console.error("Failed to load friends:", err);
      setError("Failed to load friends");
    } finally {
      setIsLoading(false);
    }
  }, [dataClient, userId]);

  const loadLeaderboard = useCallback(async () => {
    try {
      const loadedLeaderboard = await dataClient.getLeaderboard(userId);
      setLeaderboard(loadedLeaderboard);
    } catch (err) {
      console.error("Failed to load leaderboard:", err);
    }
  }, [dataClient, userId]);

  useEffect(() => {
    loadFriends();
    loadLeaderboard();
  }, [loadFriends, loadLeaderboard]);

  const addFriend = async (friendCode: string) => {
    try {
      setError(null);
      await dataClient.addFriend(userId, friendCode);
      await loadFriends();
      await loadLeaderboard();
      return true;
    } catch (err: any) {
      console.error("Failed to add friend:", err);
      setError(err.message || "Failed to add friend");
      throw err;
    }
  };

  const removeFriend = async (friendId: string) => {
    try {
      setError(null);
      await dataClient.removeFriend(userId, friendId);
      await loadFriends();
      await loadLeaderboard();
    } catch (err: any) {
      console.error("Failed to remove friend:", err);
      setError(err.message || "Failed to remove friend");
      throw err;
    }
  };

  return {
    friends,
    leaderboard,
    isLoading,
    error,
    addFriend,
    removeFriend,
    reload: () => {
      loadFriends();
      loadLeaderboard();
    },
  };
}
