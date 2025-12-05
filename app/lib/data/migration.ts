import { localStorageClient } from "./localStorageClient";
import { firestoreClient } from "./firestoreClient";
import { firebaseAvailable } from "../firebase";

/**
 * LocalStorageからFirestoreへデータを移行
 */
export async function migrateLocalToFirestore(userId: string): Promise<void> {
  if (!firebaseAvailable) {
    throw new Error("Firebase is not configured. Cannot migrate to Firestore.");
  }

  try {
    console.log("Starting migration from LocalStorage to Firestore...");

    // 1. Questsを移行
    const quests = await localStorageClient.getQuests(userId);
    console.log(`Migrating ${quests.length} quests...`);
    for (const quest of quests) {
      const { id, ...questData } = quest;
      await firestoreClient.createQuest(questData);
    }

    // 2. Completionsを移行
    const completions = await localStorageClient.getCompletions(userId);
    console.log(`Migrating ${completions.length} completions...`);
    for (const completion of completions) {
      const { id, ...completionData } = completion;
      await firestoreClient.recordCompletion(completionData);
    }

    // 3. Achievementsを移行
    const achievements = await localStorageClient.getUserAchievements(userId);
    console.log(`Migrating ${achievements.length} achievements...`);
    for (const achievement of achievements) {
      await firestoreClient.unlockAchievement(userId, achievement.id);
    }

    // 4. Categoriesを移行
    const categories = await localStorageClient.getCategories(userId);
    console.log(`Migrating ${categories.length} categories...`);
    for (const category of categories) {
      const { id, ...categoryData } = category;
      await firestoreClient.createCategory(categoryData);
    }

    // 5. User Profileを移行
    const profile = await localStorageClient.getUserProfile(userId);
    if (profile) {
      console.log("Migrating user profile...");
      await firestoreClient.updateUserProfile(userId, profile);
    }

    // TODO: Daily Statsの移行
    // 日付ごとのstatsを移行する必要がある場合は、ここに実装

    console.log("Migration completed successfully!");

    // TODO: 成功したらLocalStorageデータをバックアップ
    // backupLocalData(userId);
  } catch (error) {
    console.error("Migration failed:", error);
    // TODO: ロールバック処理
    throw error;
  }
}

/**
 * すべてのLocalStorageデータをJSON形式でエクスポート
 */
export function exportData(): string {
  const data = {
    quests: localStorage.getItem("level-life:quests"),
    completions: localStorage.getItem("level-life:completions"),
    achievements: localStorage.getItem("level-life:achievements"),
    dailyStats: localStorage.getItem("level-life:dailyStats"),
    userProfile: localStorage.getItem("level-life:userProfile"),
    categories: localStorage.getItem("level-life:categories"),
    exportedAt: new Date().toISOString(),
  };

  return JSON.stringify(data, null, 2);
}

/**
 * JSONデータをインポートしてLocalStorageに保存
 */
export async function importData(jsonData: string): Promise<void> {
  try {
    const data = JSON.parse(jsonData);

    // バリデーション
    if (!data.exportedAt) {
      throw new Error("Invalid data format: missing exportedAt field");
    }

    // 確認ダイアログ（実装側で呼び出す前に確認すること）
    console.warn("Importing data will overwrite existing local data!");

    // データをLocalStorageに保存
    if (data.quests) localStorage.setItem("level-life:quests", data.quests);
    if (data.completions)
      localStorage.setItem("level-life:completions", data.completions);
    if (data.achievements)
      localStorage.setItem("level-life:achievements", data.achievements);
    if (data.dailyStats)
      localStorage.setItem("level-life:dailyStats", data.dailyStats);
    if (data.userProfile)
      localStorage.setItem("level-life:userProfile", data.userProfile);
    if (data.categories)
      localStorage.setItem("level-life:categories", data.categories);

    console.log("Data imported successfully!");
  } catch (error) {
    console.error("Import failed:", error);
    throw error;
  }
}

/**
 * LocalStorageデータをバックアップ（将来の実装用）
 */
function backupLocalData(userId: string): void {
  // TODO: バックアップ処理の実装
  // 例: LocalStorageデータを別のキーに保存
  const backup = exportData();
  localStorage.setItem(`level-life:backup:${userId}:${Date.now()}`, backup);
  console.log("Local data backed up");
}
