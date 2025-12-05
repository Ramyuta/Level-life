"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../auth/context/AuthContext";
import { useUser } from "../../user/context/UserContext";
import { getDataClient } from "../../../lib/data/dataClient";
import type { Quest, Category, Completion } from "../../../lib/types";
import { DEFAULT_CATEGORIES } from "../../../lib/constants";
import type { UnlockedAchievement } from "../../achievements/achievementDefinitions";

/**
 * クエスト管理フック
 * DataClientを使用してクエストのCRUD操作を提供
 */
export function useQuests() {
  const { user: firebaseUser, firebaseAvailable } = useAuth();
  const { user, addXp, updateUser } = useUser();
  const [quests, setQuests] = useState<Quest[]>([]);
  const [completions, setCompletions] = useState<Completion[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // ユーザーIDを取得（Firebase or ローカル）
  const userId = firebaseUser?.uid || "local-user";

  // ストレージモードを取得
  const storageMode = user.settings.storageMode;

  // DataClientを取得
  const dataClient = getDataClient(storageMode, firebaseAvailable);

  // クエストと完了履歴を読み込み
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [loadedQuests, loadedCompletions] = (await Promise.all([
        dataClient.getQuests(userId),
        dataClient.getCompletions(userId),
      ])) as [Quest[], Completion[]];
      setQuests(loadedQuests);
      setCompletions(loadedCompletions);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
    }
  }, [dataClient, userId]);

  // カテゴリを読み込み
  const loadCategories = useCallback(async () => {
    try {
      const loadedCategories = await dataClient.getCategories(userId);

      // デフォルトカテゴリがない場合は作成
      if (loadedCategories.length === 0) {
        const defaultCats: Category[] = [];
        for (const cat of DEFAULT_CATEGORIES) {
          const newCat = await dataClient.createCategory({
            userId,
            ...cat,
            isCustom: false,
          });
          defaultCats.push(newCat);
        }
        setCategories(defaultCats);
      } else {
        setCategories(loadedCategories);
      }
    } catch (error) {
      console.error("Failed to load categories:", error);
    }
  }, [dataClient, userId]);

  // 初回読み込み
  useEffect(() => {
    loadData();
    loadCategories();
  }, [loadData, loadCategories]);

  // クエストを作成
  const createQuest = async (
    questData: Omit<Quest, "id" | "userId" | "createdAt" | "updatedAt">
  ): Promise<Quest> => {
    const newQuest = await dataClient.createQuest({
      ...questData,
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    setQuests((prev) => [newQuest, ...prev]);
    return newQuest;
  };

  // クエストを更新
  const updateQuest = async (
    id: string,
    updates: Partial<Quest>
  ): Promise<void> => {
    await dataClient.updateQuest(id, { ...updates, userId });
    setQuests((prev) =>
      prev.map((q) => (q.id === id ? { ...q, ...updates } : q))
    );
  };

  // クエストを削除（アーカイブ）
  const deleteQuest = async (id: string): Promise<void> => {
    await updateQuest(id, { status: "archived" });
  };

  // クエストを完了
  const completeQuest = async (
    id: string
  ): Promise<{
    xpGained: number;
    leveledUp: boolean;
    achievementsUnlocked?: string[];
    droppedEquipment?: import("../../../lib/types").Equipment;
  }> => {
    const quest = quests.find((q) => q.id === id);
    if (!quest) {
      throw new Error("Quest not found");
    }

    // 完了記録を作成
    const newCompletion = await dataClient.recordCompletion({
      userId,
      questId: id,
      completedAt: new Date().toISOString(),
      xpEarned: quest.xpReward,
    });

    // 完了履歴を更新
    setCompletions((prev) => [...prev, newCompletion]);

    // クエストのステータスを更新
    await updateQuest(id, { status: "completed" });

    // XPを付与
    const result = addXp(quest.xpReward);

    // 統計を更新
    const updatedStats = {
      ...user.stats,
      questsCompleted: user.stats.questsCompleted + 1,
    };

    updateUser({
      stats: updatedStats,
    });

    // 実績チェック（動的インポートで循環依存を回避）
    const achievementsUnlocked: string[] = [];
    try {
      const { evaluateAchievements } = await import(
        "../../achievements/achievementEngine"
      );

      // 現在のアンロック済み実績を取得
      const currentAchievements = await dataClient.getUserAchievements(userId);
      const unlocked: UnlockedAchievement[] = currentAchievements.map((a) => ({
        achievementId: a.id,
        unlockedAt: a.unlockedAt,
      }));

      // カスタムカテゴリ数を計算
      const customCategoriesCount = categories.filter((c) => c.isCustom).length;

      // 更新後のユーザーデータで実績を評価
      const updatedUser = {
        ...user,
        stats: updatedStats,
      };

      const newlyUnlocked = evaluateAchievements(
        updatedUser,
        customCategoriesCount,
        unlocked
      );

      // 新しくアンロックされた実績を保存
      for (const achievement of newlyUnlocked) {
        await dataClient.unlockAchievement(userId, achievement.id);
        achievementsUnlocked.push(achievement.name);
      }
    } catch (error) {
      console.error("Failed to evaluate achievements:", error);
      // エラーが発生してもクエスト完了は成功とする
    }

    // アクティビティを作成（フレンドに共有）
    try {
      const category = categories.find((c) => c.id === quest.category);
      await dataClient.createActivity({
        userId,
        userName: firebaseUser?.displayName || "Unknown",
        userAvatar: firebaseUser?.photoURL || undefined,
        type: "quest_completed",
        questId: quest.id,
        questTitle: quest.title,
        xpEarned: quest.xpReward,
        categoryIcon: category?.icon,
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Failed to create activity:", error);
      // エラーが発生してもクエスト完了は成功とする
    }

    // 宝箱ドロップ判定
    let droppedEquipment: import("../../../lib/types").Equipment | undefined;
    try {
      const { getDroppedEquipment } = await import("../../../lib/lootSystem");

      // スキルによるドロップ率ブースト計算
      let dropMultiplier = 1;
      if (user.unlockedSkills?.some((s) => s.skillId === "treasure_hunter")) {
        dropMultiplier *= 1.5;
      }

      const dropped = getDroppedEquipment(dropMultiplier);

      if (dropped) {
        droppedEquipment = dropped;
        // インベントリに追加（ストアから直接取得）
        const { useStore } = await import("../../../lib/store");
        useStore.getState().addToInventory(dropped);
      }
    } catch (error) {
      console.error("Failed to process treasure drop:", error);
    }

    return {
      xpGained: quest.xpReward,
      leveledUp: result.leveledUp,
      achievementsUnlocked:
        achievementsUnlocked.length > 0 ? achievementsUnlocked : undefined,
      droppedEquipment,
    };
  };

  // カテゴリを作成
  const createCategory = async (
    categoryData: Omit<Category, "id" | "userId">
  ): Promise<Category> => {
    const newCategory = await dataClient.createCategory({
      ...categoryData,
      userId,
    });
    setCategories((prev) => [...prev, newCategory]);
    return newCategory;
  };

  // カテゴリを更新
  const updateCategory = async (
    id: string,
    updates: Partial<Category>
  ): Promise<void> => {
    await dataClient.updateCategory(id, { ...updates, userId });
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
  };

  // カテゴリを削除
  const deleteCategory = async (id: string): Promise<void> => {
    // カスタムカテゴリのみ削除可能
    const category = categories.find((c) => c.id === id);
    if (category && !category.isCustom) {
      throw new Error("Cannot delete default category");
    }

    // このカテゴリを使用しているクエストがないかチェック
    const questsWithCategory = quests.filter((q) => q.category === id);
    if (questsWithCategory.length > 0) {
      throw new Error("Cannot delete category that is being used by quests");
    }

    await dataClient.deleteCategory(id);
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  // 今日のクエストをフィルタ
  const getTodaysQuests = (): Quest[] => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0=Sunday, 1=Monday, etc.

    return quests.filter((quest) => {
      if (quest.status !== "active") return false;

      if (quest.scheduleType === "daily") {
        return true;
      }

      if (quest.scheduleType === "weekly" && quest.scheduleDays) {
        return quest.scheduleDays.includes(dayOfWeek);
      }

      return false;
    });
  };

  return {
    quests,
    completions,
    categories,
    loading,
    isLoading: loading,
    createQuest,
    updateQuest,
    deleteQuest,
    completeQuest,
    createCategory,
    updateCategory,
    deleteCategory,
    getTodaysQuests,
    reload: loadData,
  };
}
