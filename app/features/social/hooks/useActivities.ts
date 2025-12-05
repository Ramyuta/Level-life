"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../auth/context/AuthContext";
import { useUser } from "../../user/context/UserContext";
import { getDataClient } from "../../../lib/data/dataClient";
import type { Activity, Reaction, Comment } from "../../../lib/types";

export function useActivities() {
  const { userProfile, firebaseAvailable } = useAuth();
  const { user } = useUser();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [reactions, setReactions] = useState<Record<string, Reaction[]>>({});
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [loading, setLoading] = useState(true);

  const loadActivities = async () => {
    if (!userProfile) return;

    try {
      const client = getDataClient(
        user.settings.storageMode,
        firebaseAvailable
      );
      const fetchedActivities = await client.getActivities(userProfile.uid);
      setActivities(fetchedActivities);

      // Load reactions and comments for each activity
      const reactionsMap: Record<string, Reaction[]> = {};
      const commentsMap: Record<string, Comment[]> = {};

      for (const activity of fetchedActivities) {
        const activityReactions = await client.getReactions(activity.id);
        const activityComments = await client.getComments(activity.id);
        reactionsMap[activity.id] = activityReactions;
        commentsMap[activity.id] = activityComments;
      }

      setReactions(reactionsMap);
      setComments(commentsMap);
    } catch (error) {
      console.error("Failed to load activities:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadActivities();
  }, [userProfile?.uid]);

  const addReaction = async (activityId: string) => {
    if (!userProfile) return;

    try {
      const client = getDataClient(
        user.settings.storageMode,
        firebaseAvailable
      );
      const newReaction = await client.addReaction({
        activityId,
        userId: userProfile.uid,
        userName: userProfile.displayName || "Unknown",
        type: "like",
        createdAt: new Date().toISOString(),
      });

      setReactions((prev) => ({
        ...prev,
        [activityId]: [...(prev[activityId] || []), newReaction],
      }));
    } catch (error) {
      console.error("Failed to add reaction:", error);
    }
  };

  const removeReaction = async (activityId: string) => {
    if (!userProfile) return;

    try {
      const client = getDataClient(
        user.settings.storageMode,
        firebaseAvailable
      );
      await client.removeReaction(activityId, userProfile.uid);

      setReactions((prev) => ({
        ...prev,
        [activityId]: (prev[activityId] || []).filter(
          (r) => r.userId !== userProfile.uid
        ),
      }));
    } catch (error) {
      console.error("Failed to remove reaction:", error);
    }
  };

  const addComment = async (activityId: string, content: string) => {
    if (!userProfile || !content.trim()) return;

    try {
      const client = getDataClient(
        user.settings.storageMode,
        firebaseAvailable
      );
      const newComment = await client.addComment({
        activityId,
        userId: userProfile.uid,
        userName: userProfile.displayName || "Unknown",
        userAvatar: userProfile.avatarId,
        content: content.trim(),
        createdAt: new Date().toISOString(),
      });

      setComments((prev) => ({
        ...prev,
        [activityId]: [...(prev[activityId] || []), newComment],
      }));
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  return {
    activities,
    reactions,
    comments,
    loading,
    addReaction,
    removeReaction,
    addComment,
    refresh: loadActivities,
  };
}
