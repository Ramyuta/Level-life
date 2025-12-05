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

/**
 * データアクセスの統一インターフェース
 * LocalStorageとFirestoreの両方で同じAPIを提供
 */
export interface DataClient {
  // Quest operations
  createQuest(quest: Omit<Quest, "id">): Promise<Quest>;
  updateQuest(id: string, updates: Partial<Quest>): Promise<void>;
  deleteQuest(id: string): Promise<void>;
  getQuest(id: string): Promise<Quest | null>;
  getQuests(userId: string): Promise<Quest[]>;

  // Completion operations
  recordCompletion(completion: Omit<Completion, "id">): Promise<Completion>;
  getCompletions(
    userId: string,
    startDate?: string,
    endDate?: string
  ): Promise<Completion[]>;

  // Achievement operations
  unlockAchievement(userId: string, achievementId: string): Promise<void>;
  getUserAchievements(userId: string): Promise<Achievement[]>;

  // Stats operations
  updateDailyStats(
    userId: string,
    date: string,
    stats: Partial<DailyStats>
  ): Promise<void>;
  getDailyStats(userId: string, date: string): Promise<DailyStats | null>;

  // User profile operations
  getUserProfile(userId: string): Promise<UserProfile | null>;
  updateUserProfile(
    userId: string,
    updates: Partial<UserProfile>
  ): Promise<void>;

  // Category operations
  createCategory(category: Omit<Category, "id">): Promise<Category>;
  updateCategory(id: string, updates: Partial<Category>): Promise<void>;
  deleteCategory(id: string): Promise<void>;
  getCategories(userId: string): Promise<Category[]>;

  // Social operations
  addFriend(userId: string, friendCode: string): Promise<void>;
  removeFriend(userId: string, friendId: string): Promise<void>;
  getFriends(userId: string): Promise<Friend[]>;
  getLeaderboard(userId: string): Promise<LeaderboardEntry[]>;

  // Activity operations
  createActivity(activity: Omit<Activity, "id">): Promise<Activity>;
  getActivities(userId: string): Promise<Activity[]>;
  addReaction(reaction: Omit<Reaction, "id">): Promise<Reaction>;
  removeReaction(activityId: string, userId: string): Promise<void>;
  getReactions(activityId: string): Promise<Reaction[]>;
  addComment(comment: Omit<Comment, "id">): Promise<Comment>;
  getComments(activityId: string): Promise<Comment[]>;
}

/**
 * データクライアントのファクトリー関数
 * ストレージモードとFirebase可用性に基づいて適切なクライアントを返す
 */
import { firestoreClient } from "./firestoreClient";
import { localStorageClient } from "./localStorageClient";

/**
 * データクライアントのファクトリー関数
 * ストレージモードとFirebase可用性に基づいて適切なクライアントを返す
 */
export function getDataClient(
  storageMode: "local" | "cloud",
  firebaseAvailable: boolean
): DataClient {
  // Firebaseが利用可能でクラウドモードの場合はFirestoreクライアントを使用
  if (storageMode === "cloud" && firebaseAvailable) {
    return firestoreClient;
  }

  // それ以外はLocalStorageクライアントを使用
  return localStorageClient;
}
