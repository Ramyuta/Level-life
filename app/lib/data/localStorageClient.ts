import { v4 as uuidv4 } from "uuid";
import type {
  Quest,
  Completion,
  Achievement,
  UserProfile,
  DailyStats,
  Category,
  Friend,
  LeaderboardEntry,
  Activity,
  Reaction,
  Comment,
} from "../types";
import type { DataClient } from "./dataClient";

/**
 * LocalStorageのキー定義
 */
const STORAGE_KEYS = {
  QUESTS: "level-life:quests",
  COMPLETIONS: "level-life:completions",
  ACHIEVEMENTS: "level-life:achievements",
  DAILY_STATS: "level-life:dailyStats",
  USER_PROFILE: "level-life:userProfile",
  CATEGORIES: "level-life:categories",
  FRIENDS: "level-life:friends",
  ACTIVITIES: "level-life:activities",
  REACTIONS: "level-life:reactions",
  COMMENTS: "level-life:comments",
  GEMINI_API_KEY: "level-life:gemini-api-key",
} as const;

/**
 * LocalStorageヘルパー関数
 */
function getFromStorage<T>(key: string): T[] {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error(`Error reading from localStorage (${key}):`, error);
    return [];
  }
}

function saveToStorage<T>(key: string, data: T[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error writing to localStorage (${key}):`, error);
  }
}

/**
 * LocalStorageベースのDataClient実装
 */
class LocalStorageClient implements DataClient {
  // Quest operations
  async createQuest(quest: Omit<Quest, "id">): Promise<Quest> {
    const quests = getFromStorage<Quest>(STORAGE_KEYS.QUESTS);
    const newQuest: Quest = {
      ...quest,
      id: uuidv4(),
    };
    quests.push(newQuest);
    saveToStorage(STORAGE_KEYS.QUESTS, quests);
    return newQuest;
  }

  async updateQuest(id: string, updates: Partial<Quest>): Promise<void> {
    const quests = getFromStorage<Quest>(STORAGE_KEYS.QUESTS);
    const index = quests.findIndex((q) => q.id === id);
    if (index !== -1) {
      quests[index] = {
        ...quests[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      saveToStorage(STORAGE_KEYS.QUESTS, quests);
    }
  }

  async deleteQuest(id: string): Promise<void> {
    const quests = getFromStorage<Quest>(STORAGE_KEYS.QUESTS);
    const filtered = quests.filter((q) => q.id !== id);
    saveToStorage(STORAGE_KEYS.QUESTS, filtered);
  }

  async getQuest(id: string): Promise<Quest | null> {
    const quests = getFromStorage<Quest>(STORAGE_KEYS.QUESTS);
    return quests.find((q) => q.id === id) || null;
  }

  async getQuests(userId: string): Promise<Quest[]> {
    const quests = getFromStorage<Quest>(STORAGE_KEYS.QUESTS);
    return quests.filter((q) => q.userId === userId);
  }

  // Completion operations
  async recordCompletion(
    completion: Omit<Completion, "id">
  ): Promise<Completion> {
    const completions = getFromStorage<Completion>(STORAGE_KEYS.COMPLETIONS);
    const newCompletion: Completion = {
      ...completion,
      id: uuidv4(),
    };
    completions.push(newCompletion);
    saveToStorage(STORAGE_KEYS.COMPLETIONS, completions);
    return newCompletion;
  }

  async getCompletions(
    userId: string,
    startDate?: string,
    endDate?: string
  ): Promise<Completion[]> {
    const completions = getFromStorage<Completion>(STORAGE_KEYS.COMPLETIONS);
    let filtered = completions.filter((c) => c.userId === userId);

    if (startDate) {
      filtered = filtered.filter((c) => c.completedAt >= startDate);
    }
    if (endDate) {
      filtered = filtered.filter((c) => c.completedAt <= endDate);
    }

    return filtered;
  }

  // Achievement operations
  async unlockAchievement(
    userId: string,
    achievementId: string
  ): Promise<void> {
    const achievements = getFromStorage<Achievement>(STORAGE_KEYS.ACHIEVEMENTS);
    const existing = achievements.find(
      (a) => a.userId === userId && a.id === achievementId
    );

    if (!existing) {
      const newAchievement: Achievement = {
        id: achievementId,
        userId,
        unlockedAt: new Date().toISOString(),
        progress: 100,
      };
      achievements.push(newAchievement);
      saveToStorage(STORAGE_KEYS.ACHIEVEMENTS, achievements);
    }
  }

  async getUserAchievements(userId: string): Promise<Achievement[]> {
    const achievements = getFromStorage<Achievement>(STORAGE_KEYS.ACHIEVEMENTS);
    return achievements.filter((a) => a.userId === userId);
  }

  // Stats operations
  async updateDailyStats(
    userId: string,
    date: string,
    stats: Partial<DailyStats>
  ): Promise<void> {
    const allStats = getFromStorage<DailyStats>(STORAGE_KEYS.DAILY_STATS);
    const index = allStats.findIndex(
      (s) => s.userId === userId && s.date === date
    );

    if (index !== -1) {
      allStats[index] = { ...allStats[index], ...stats };
    } else {
      const newStats: DailyStats = {
        userId,
        date,
        questsCompleted: 0,
        habitsCompleted: 0,
        timerMinutes: 0,
        totalXpEarned: 0,
        streak: 0,
        ...stats,
      };
      allStats.push(newStats);
    }
    saveToStorage(STORAGE_KEYS.DAILY_STATS, allStats);
  }

  async getDailyStats(
    userId: string,
    date: string
  ): Promise<DailyStats | null> {
    const allStats = getFromStorage<DailyStats>(STORAGE_KEYS.DAILY_STATS);
    return allStats.find((s) => s.userId === userId && s.date === date) || null;
  }

  // User profile operations
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    const profiles = getFromStorage<UserProfile>(STORAGE_KEYS.USER_PROFILE);
    return profiles.find((p) => p.uid === userId) || null;
  }

  async updateUserProfile(
    userId: string,
    updates: Partial<UserProfile>
  ): Promise<void> {
    const profiles = getFromStorage<UserProfile>(STORAGE_KEYS.USER_PROFILE);
    const index = profiles.findIndex((p) => p.uid === userId);

    if (index !== -1) {
      profiles[index] = { ...profiles[index], ...updates };
      saveToStorage(STORAGE_KEYS.USER_PROFILE, profiles);
    }
  }

  // Category operations
  async createCategory(category: Omit<Category, "id">): Promise<Category> {
    const categories = getFromStorage<Category>(STORAGE_KEYS.CATEGORIES);
    const newCategory: Category = {
      ...category,
      id: uuidv4(),
    };
    categories.push(newCategory);
    saveToStorage(STORAGE_KEYS.CATEGORIES, categories);
    return newCategory;
  }

  async updateCategory(id: string, updates: Partial<Category>): Promise<void> {
    const categories = getFromStorage<Category>(STORAGE_KEYS.CATEGORIES);
    const index = categories.findIndex((c) => c.id === id);
    if (index !== -1) {
      categories[index] = { ...categories[index], ...updates };
      saveToStorage(STORAGE_KEYS.CATEGORIES, categories);
    }
  }

  async deleteCategory(id: string): Promise<void> {
    const categories = getFromStorage<Category>(STORAGE_KEYS.CATEGORIES);
    const filtered = categories.filter((c) => c.id !== id);
    saveToStorage(STORAGE_KEYS.CATEGORIES, filtered);
  }

  async getCategories(userId: string): Promise<Category[]> {
    const categories = getFromStorage<Category>(STORAGE_KEYS.CATEGORIES);
    return categories.filter((c) => c.userId === userId);
  }

  // Social operations
  async addFriend(userId: string, friendCode: string): Promise<void> {
    // ローカルモードでは、自分自身を追加するか、モックユーザーを追加する
    // 実際のアプリでは、friendCodeからユーザーを検索する

    const profiles = getFromStorage<UserProfile>(STORAGE_KEYS.USER_PROFILE);
    const targetUser = profiles.find((p) => p.friendCode === friendCode);

    if (!targetUser) {
      throw new Error("User not found");
    }

    if (targetUser.uid === userId) {
      // 自分自身を追加しようとした場合（テスト用には許可するが、警告）
      // throw new Error("Cannot add yourself as a friend");
    }

    const friends = getFromStorage<Friend>(STORAGE_KEYS.FRIENDS);

    // 既にフレンドかチェック
    const existing = friends.find(
      (f) => f.uid === targetUser.uid // Note: In a real DB, we'd store the relationship properly
    );

    // ローカルストレージの実装は簡易的に、"friends"リストにFriendオブジェクトを保存する形にする
    // 本来は { userId, friendId } のようなリレーションテーブルが必要だが、
    // ここでは単純化して、全ユーザー共有のフレンドリストとして扱う（ローカル環境は1ユーザー前提）

    // 修正: ローカル環境では「自分のフレンドリスト」を管理する
    // Friendオブジェクトには userId (所有者) プロパティがないため、
    // ローカルストレージの構造を少し変えるか、フィルタリングを工夫する必要がある。
    // ここでは、Friend型を拡張せず、ローカルストレージには「現在のユーザーのフレンド」のみが入ると仮定するか、
    // あるいは単純に全フレンドを返す。

    // 簡易実装: 重複チェックのみ
    const isAlreadyFriend = friends.some((f) => f.uid === targetUser.uid);
    if (isAlreadyFriend) {
      throw new Error("Already friends");
    }

    const newFriend: Friend = {
      uid: targetUser.uid,
      displayName: targetUser.displayName || "Unknown",
      friendCode: targetUser.friendCode,
      avatarId: targetUser.avatarId || "warrior", // Default avatar
      level: 1,
      status: "offline",
      lastActive: new Date().toISOString(),
    };

    friends.push(newFriend);
    saveToStorage(STORAGE_KEYS.FRIENDS, friends);
  }

  async removeFriend(userId: string, friendId: string): Promise<void> {
    const friends = getFromStorage<Friend>(STORAGE_KEYS.FRIENDS);
    const filtered = friends.filter((f) => f.uid !== friendId);
    saveToStorage(STORAGE_KEYS.FRIENDS, filtered);
  }

  async getFriends(userId: string): Promise<Friend[]> {
    return getFromStorage<Friend>(STORAGE_KEYS.FRIENDS);
  }

  async getLeaderboard(userId: string): Promise<LeaderboardEntry[]> {
    // ローカルモードでは、自分とフレンド（モック）のランキングを生成
    const friends = await this.getFriends(userId);
    const myProfile = await this.getUserProfile(userId);
    const myStats = await this.getDailyStats(
      userId,
      new Date().toISOString().split("T")[0]
    ); // 今日の統計だけだと不十分だが、簡易的に

    // 実際にはUserStatsから合計XPを取得する必要があるが、DataClientにはgetStatsがない
    // ここでは簡易的に、フレンドはランダムなXP、自分は0または保存された値とする

    const leaderboard: LeaderboardEntry[] = [];

    // 自分
    if (myProfile) {
      // 注: 正確な合計XPを取得するには全DailyStatsを集計するか、Userオブジェクトを保存する必要がある
      // LocalStorageClientの設計上、Userオブジェクト全体へのアクセスが少し遠い
      // ここでは簡易的に実装
      leaderboard.push({
        uid: userId,
        displayName: myProfile.displayName || "You",
        weeklyXp: 0,
        level: 1,
        rank: 1,
        avatarId: myProfile.avatarId || "warrior",
      });
    }

    // フレンド (モックデータ)
    friends.forEach((friend) => {
      leaderboard.push({
        uid: friend.uid,
        displayName: friend.displayName,
        weeklyXp: Math.floor(Math.random() * 1000),
        level: Math.floor(Math.random() * 10) + 1,
        rank: 0,
        avatarId: friend.avatarId,
      });
    });

    // ソートとランク付け
    leaderboard.sort((a, b) => b.weeklyXp - a.weeklyXp);
    leaderboard.forEach((entry, index) => {
      entry.rank = index + 1;
    });

    return leaderboard;
  }

  // Activity operations
  async createActivity(activity: Omit<Activity, "id">): Promise<Activity> {
    const activities = getFromStorage<Activity>(STORAGE_KEYS.ACTIVITIES);
    const newActivity: Activity = {
      ...activity,
      id: uuidv4(),
    };
    activities.push(newActivity);
    saveToStorage(STORAGE_KEYS.ACTIVITIES, activities);
    return newActivity;
  }

  async getActivities(userId: string): Promise<Activity[]> {
    // Get activities from user's friends
    const friends = await this.getFriends(userId);
    const friendIds = friends.map((f) => f.uid);
    const activities = getFromStorage<Activity>(STORAGE_KEYS.ACTIVITIES);

    // Return activities from friends and self
    return activities
      .filter((a) => friendIds.includes(a.userId) || a.userId === userId)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }

  async addReaction(reaction: Omit<Reaction, "id">): Promise<Reaction> {
    const reactions = getFromStorage<Reaction>(STORAGE_KEYS.REACTIONS);
    const newReaction: Reaction = {
      ...reaction,
      id: uuidv4(),
    };
    reactions.push(newReaction);
    saveToStorage(STORAGE_KEYS.REACTIONS, reactions);
    return newReaction;
  }

  async removeReaction(activityId: string, userId: string): Promise<void> {
    const reactions = getFromStorage<Reaction>(STORAGE_KEYS.REACTIONS);
    const filtered = reactions.filter(
      (r) => !(r.activityId === activityId && r.userId === userId)
    );
    saveToStorage(STORAGE_KEYS.REACTIONS, filtered);
  }

  async getReactions(activityId: string): Promise<Reaction[]> {
    const reactions = getFromStorage<Reaction>(STORAGE_KEYS.REACTIONS);
    return reactions.filter((r) => r.activityId === activityId);
  }

  async addComment(comment: Omit<Comment, "id">): Promise<Comment> {
    const comments = getFromStorage<Comment>(STORAGE_KEYS.COMMENTS);
    const newComment: Comment = {
      ...comment,
      id: uuidv4(),
    };
    comments.push(newComment);
    saveToStorage(STORAGE_KEYS.COMMENTS, comments);
    return newComment;
  }

  async getComments(activityId: string): Promise<Comment[]> {
    const comments = getFromStorage<Comment>(STORAGE_KEYS.COMMENTS);
    return comments
      .filter((c) => c.activityId === activityId)
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
  }

  // Gemini API Key methods
  getGeminiApiKey(): string | null {
    try {
      return localStorage.getItem(STORAGE_KEYS.GEMINI_API_KEY);
    } catch (error) {
      console.error("Error reading Gemini API key:", error);
      return null;
    }
  }

  setGeminiApiKey(apiKey: string): void {
    try {
      localStorage.setItem(STORAGE_KEYS.GEMINI_API_KEY, apiKey);
    } catch (error) {
      console.error("Error saving Gemini API key:", error);
    }
  }

  clearGeminiApiKey(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.GEMINI_API_KEY);
    } catch (error) {
      console.error("Error clearing Gemini API key:", error);
    }
  }
}

export const localStorageClient = new LocalStorageClient();
