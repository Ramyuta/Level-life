import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  Timestamp,
} from "firebase/firestore";
import { db, firebaseAvailable } from "../firebase";
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
 * Firebaseが利用できない場合のエラー
 */
class FirebaseUnavailableError extends Error {
  constructor() {
    super("Firebase is not configured. Please use local storage mode.");
    this.name = "FirebaseUnavailableError";
  }
}

/**
 * Firestoreの可用性をチェック
 */
function ensureFirebaseAvailable(): void {
  if (!firebaseAvailable || !db) {
    throw new FirebaseUnavailableError();
  }
}

/**
 * FirestoreベースのDataClient実装
 */
class FirestoreClient implements DataClient {
  // Quest operations
  async createQuest(quest: Omit<Quest, "id">): Promise<Quest> {
    ensureFirebaseAvailable();

    const questsRef = collection(db!, "users", quest.userId, "quests");
    const newQuestRef = doc(questsRef);
    const newQuest: Quest = {
      ...quest,
      id: newQuestRef.id,
    };

    await setDoc(newQuestRef, newQuest);
    return newQuest;
  }

  async updateQuest(id: string, updates: Partial<Quest>): Promise<void> {
    ensureFirebaseAvailable();

    if (!updates.userId) {
      throw new Error("userId is required for updateQuest");
    }

    const questRef = doc(db!, "users", updates.userId, "quests", id);
    await updateDoc(questRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  }

  async deleteQuest(id: string): Promise<void> {
    ensureFirebaseAvailable();

    // Note: userId must be passed via updates in a real implementation
    // For now, this is a limitation - consider refactoring the interface
    throw new Error(
      "deleteQuest requires userId - use updateQuest to set status to archived"
    );
  }

  async getQuest(id: string): Promise<Quest | null> {
    ensureFirebaseAvailable();

    // Note: This requires knowing the userId
    // In practice, you'd get this from auth context
    throw new Error("getQuest requires userId - use getQuests instead");
  }

  async getQuests(userId: string): Promise<Quest[]> {
    ensureFirebaseAvailable();

    const questsRef = collection(db!, "users", userId, "quests");
    const snapshot = await getDocs(questsRef);

    return snapshot.docs.map((doc) => doc.data() as Quest);
  }

  // Completion operations
  async recordCompletion(
    completion: Omit<Completion, "id">
  ): Promise<Completion> {
    ensureFirebaseAvailable();

    const completionsRef = collection(
      db!,
      "users",
      completion.userId,
      "completions"
    );
    const newCompletionRef = doc(completionsRef);
    const newCompletion: Completion = {
      ...completion,
      id: newCompletionRef.id,
    };

    await setDoc(newCompletionRef, newCompletion);
    return newCompletion;
  }

  async getCompletions(
    userId: string,
    startDate?: string,
    endDate?: string
  ): Promise<Completion[]> {
    ensureFirebaseAvailable();

    const completionsRef = collection(db!, "users", userId, "completions");
    let q = query(completionsRef);

    if (startDate) {
      q = query(q, where("completedAt", ">=", startDate));
    }
    if (endDate) {
      q = query(q, where("completedAt", "<=", endDate));
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => doc.data() as Completion);
  }

  // Achievement operations
  async unlockAchievement(
    userId: string,
    achievementId: string
  ): Promise<void> {
    ensureFirebaseAvailable();

    const achievementRef = doc(
      db!,
      "users",
      userId,
      "achievements",
      achievementId
    );
    const achievementDoc = await getDoc(achievementRef);

    if (!achievementDoc.exists()) {
      const newAchievement: Achievement = {
        id: achievementId,
        userId,
        unlockedAt: new Date().toISOString(),
        progress: 100,
      };
      await setDoc(achievementRef, newAchievement);
    }
  }

  async getUserAchievements(userId: string): Promise<Achievement[]> {
    ensureFirebaseAvailable();

    const achievementsRef = collection(db!, "users", userId, "achievements");
    const snapshot = await getDocs(achievementsRef);

    return snapshot.docs.map((doc) => doc.data() as Achievement);
  }

  // Stats operations
  async updateDailyStats(
    userId: string,
    date: string,
    stats: Partial<DailyStats>
  ): Promise<void> {
    ensureFirebaseAvailable();

    const statsRef = doc(db!, "users", userId, "dailyStats", date);
    const statsDoc = await getDoc(statsRef);

    if (statsDoc.exists()) {
      await updateDoc(statsRef, stats);
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
      await setDoc(statsRef, newStats);
    }
  }

  async getDailyStats(
    userId: string,
    date: string
  ): Promise<DailyStats | null> {
    ensureFirebaseAvailable();

    const statsRef = doc(db!, "users", userId, "dailyStats", date);
    const statsDoc = await getDoc(statsRef);

    return statsDoc.exists() ? (statsDoc.data() as DailyStats) : null;
  }

  // User profile operations
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    ensureFirebaseAvailable();

    const profileRef = doc(db!, "users", userId);
    const profileDoc = await getDoc(profileRef);

    return profileDoc.exists() ? (profileDoc.data() as UserProfile) : null;
  }

  async updateUserProfile(
    userId: string,
    updates: Partial<UserProfile>
  ): Promise<void> {
    ensureFirebaseAvailable();

    const profileRef = doc(db!, "users", userId);
    await updateDoc(profileRef, updates);
  }

  // Category operations
  async createCategory(category: Omit<Category, "id">): Promise<Category> {
    ensureFirebaseAvailable();

    const categoriesRef = collection(
      db!,
      "users",
      category.userId,
      "categories"
    );
    const newCategoryRef = doc(categoriesRef);
    const newCategory: Category = {
      ...category,
      id: newCategoryRef.id,
    };

    await setDoc(newCategoryRef, newCategory);
    return newCategory;
  }

  async updateCategory(id: string, updates: Partial<Category>): Promise<void> {
    ensureFirebaseAvailable();

    if (!updates.userId) {
      throw new Error("userId is required for updateCategory");
    }

    const categoryRef = doc(db!, "users", updates.userId, "categories", id);
    await updateDoc(categoryRef, updates);
  }

  async deleteCategory(id: string): Promise<void> {
    ensureFirebaseAvailable();

    // Note: userId must be passed - consider refactoring the interface
    throw new Error("deleteCategory requires userId");
  }

  async getCategories(userId: string): Promise<Category[]> {
    ensureFirebaseAvailable();

    const categoriesRef = collection(db!, "users", userId, "categories");
    const snapshot = await getDocs(categoriesRef);

    return snapshot.docs.map((doc) => doc.data() as Category);
  }

  // Social operations
  async addFriend(userId: string, friendCode: string): Promise<void> {
    ensureFirebaseAvailable();

    // 1. Find user by friend code
    const usersRef = collection(db!, "users");
    const q = query(usersRef, where("friendCode", "==", friendCode));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      throw new Error("User not found");
    }

    const targetUserDoc = querySnapshot.docs[0];
    const targetUser = targetUserDoc.data() as UserProfile;

    if (targetUser.uid === userId) {
      throw new Error("Cannot add yourself as a friend");
    }

    // 2. Check if already friends
    const friendRef = doc(db!, "users", userId, "friends", targetUser.uid);
    const friendDoc = await getDoc(friendRef);

    if (friendDoc.exists()) {
      throw new Error("Already friends");
    }

    // 3. Add to friends collection
    const newFriend: Friend = {
      uid: targetUser.uid,
      displayName: targetUser.displayName || "Unknown",
      friendCode: targetUser.friendCode,
      avatarId: targetUser.avatarId || "neutral_1",
      level: 1, // Default level
      status: "offline",
      lastActive: new Date().toISOString(),
    };

    await setDoc(friendRef, newFriend);
  }

  async removeFriend(userId: string, friendId: string): Promise<void> {
    ensureFirebaseAvailable();

    const friendRef = doc(db!, "users", userId, "friends", friendId);
    await deleteDoc(friendRef);
  }

  async getFriends(userId: string): Promise<Friend[]> {
    ensureFirebaseAvailable();

    const friendsRef = collection(db!, "users", userId, "friends");
    const snapshot = await getDocs(friendsRef);

    return snapshot.docs.map((doc) => doc.data() as Friend);
  }

  async getLeaderboard(userId: string): Promise<LeaderboardEntry[]> {
    ensureFirebaseAvailable();

    // 1. Get friends
    const friends = await this.getFriends(userId);
    const friendIds = friends.map((f) => f.uid);

    // Include self
    friendIds.push(userId);

    const leaderboard: LeaderboardEntry[] = [];

    // 2. Fetch stats for each user (This might be slow for many friends, optimization needed later)
    // Ideally, we should store totalXp in UserProfile or a separate public stats collection
    for (const uid of friendIds) {
      const profile = await this.getUserProfile(uid);

      // Fetch latest daily stats to get total XP (or calculate from all stats - expensive)
      // Better approach: Store totalXp in UserProfile.
      // For now, let's assume we can get it from somewhere or calculate it.
      // Since we don't have totalXp in UserProfile yet, let's fetch today's stats as a proxy or 0
      // TODO: Update UserProfile to include totalXp for efficient leaderboard

      const today = new Date().toISOString().split("T")[0];
      const dailyStats = await this.getDailyStats(uid, today);

      // This is a limitation of current data model.
      // We will use 0 for now if we can't easily get total XP without reading all history.
      // Or we can try to read 'users/{uid}' doc which might have 'stats' field if we sync it.

      // Let's try to get the user document directly, assuming it matches User interface
      const userDocRef = doc(db!, "users", uid);
      const userDoc = await getDoc(userDocRef);
      let totalXp = 0;
      let level = 1;
      let streak = 0;

      if (userDoc.exists()) {
        const userData = userDoc.data();
        // Check if it has stats object (from User interface)
        if (
          userData.stats &&
          typeof userData.stats.totalXpEarned === "number"
        ) {
          totalXp = userData.stats.totalXpEarned;
        }
        if (typeof userData.level === "number") {
          level = userData.level;
        }
        if (userData.streak && typeof userData.streak.current === "number") {
          streak = userData.streak.current;
        }
      }

      if (profile) {
        leaderboard.push({
          uid,
          displayName: profile.displayName || "Unknown",
          avatarId: profile.avatarId || "neutral_1",
          weeklyXp: totalXp, // Use totalXp as weeklyXp for now
          level,
          rank: 0,
        });
      }
    }

    // 3. Sort and rank
    leaderboard.sort((a, b) => b.weeklyXp - a.weeklyXp);
    leaderboard.forEach((entry, index) => {
      entry.rank = index + 1;
    });

    return leaderboard;
  }

  // Activity operations
  async createActivity(activity: Omit<Activity, "id">): Promise<Activity> {
    ensureFirebaseAvailable();
    const activitiesRef = collection(db!, "activities");
    const activityDoc = doc(activitiesRef);
    const newActivity: Activity = {
      ...activity,
      id: activityDoc.id,
    };
    await setDoc(activityDoc, newActivity);
    return newActivity;
  }

  async getActivities(userId: string): Promise<Activity[]> {
    ensureFirebaseAvailable();
    // Get user's friends first
    const friends = await this.getFriends(userId);
    const friendIds = friends.map((f) => f.uid);

    // Query activities from friends and self
    const activitiesRef = collection(db!, "activities");
    const q = query(
      activitiesRef,
      where("userId", "in", [...friendIds, userId])
    );
    const snapshot = await getDocs(q);
    const activities = snapshot.docs.map((doc) => doc.data() as Activity);
    return activities.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async addReaction(reaction: Omit<Reaction, "id">): Promise<Reaction> {
    ensureFirebaseAvailable();
    const reactionsRef = collection(db!, "reactions");
    const reactionDoc = doc(reactionsRef);
    const newReaction: Reaction = {
      ...reaction,
      id: reactionDoc.id,
    };
    await setDoc(reactionDoc, newReaction);
    return newReaction;
  }

  async removeReaction(activityId: string, userId: string): Promise<void> {
    ensureFirebaseAvailable();
    const reactionsRef = collection(db!, "reactions");
    const q = query(
      reactionsRef,
      where("activityId", "==", activityId),
      where("userId", "==", userId)
    );
    const snapshot = await getDocs(q);
    const deletePromises = snapshot.docs.map((doc) => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
  }

  async getReactions(activityId: string): Promise<Reaction[]> {
    ensureFirebaseAvailable();
    const reactionsRef = collection(db!, "reactions");
    const q = query(reactionsRef, where("activityId", "==", activityId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => doc.data() as Reaction);
  }

  async addComment(comment: Omit<Comment, "id">): Promise<Comment> {
    ensureFirebaseAvailable();
    const commentsRef = collection(db!, "comments");
    const commentDoc = doc(commentsRef);
    const newComment: Comment = {
      ...comment,
      id: commentDoc.id,
    };
    await setDoc(commentDoc, newComment);
    return newComment;
  }

  async getComments(activityId: string): Promise<Comment[]> {
    ensureFirebaseAvailable();
    const commentsRef = collection(db!, "comments");
    const q = query(commentsRef, where("activityId", "==", activityId));
    const snapshot = await getDocs(q);
    const comments = snapshot.docs.map((doc) => doc.data() as Comment);
    return comments.sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }
}

export const firestoreClient = new FirestoreClient();
