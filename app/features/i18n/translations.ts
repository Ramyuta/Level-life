import type { Language } from "./LanguageContext";

export const translations = {
  ja: {
    common: {
      low: "低",
      medium: "中",
      high: "高",
      once: "1回のみ",
      daily: "毎日",
      weekly: "週間",
      confirm: "確認",
      cancel: "キャンセル",
      loading: "読み込み中...",
      retry: "再試行",
      minutes: "分",
      xp: "XP",
      days: {
        sun: "日",
        mon: "月",
        tue: "火",
        wed: "水",
        thu: "木",
        fri: "金",
        sat: "土",
      },
    },
    nav: {
      dashboard: "ダッシュボード",
      quests: "クエスト",
      battle: "ボスバトル",
      shop: "ショップ",
      skills: "スキル",
      achievements: "実績",
      settings: "設定",
      analytics: "分析",
      friends: "フレンド",
    },
    dashboard: {
      title: "ダッシュボード",
      subtitle: "おかえりなさい",
      level: "Lv",
      nextLevel: "次のレベルまで",
      todayXp: "今日のXP",
      streak: "連続日数",
      streakUnit: "日",
      totalXp: "累計XP",
      completedQuests: "完了クエスト",
      todaysQuests: "今日のクエスト",
      viewAll: "すべて表示",
      noQuestsTitle: "今日のクエストはありません",
      noQuestsDesc: "新しいクエストを作成して冒険を始めましょう！",
      createQuest: "クエストを作成",
      timerActive: "タイマー実行中",
      levelUp: "LEVEL UP!!",
      newAchievement: "新しい実績をアンロックしました",
      motivation: {
        message1: "小さな一歩が未来を変える。",
        message2: "昨日の自分を1%超えていこう。",
        message3: "集中は最強のスキル。今ここに全集中！",
        message4: "積み上げた努力は必ずXPに変わる。",
        message5: "ミスは学びの証。次の一歩の糧にしよう。",
        message6: "習慣こそが最高のチートアイテム。",
        message7: "今日を制する者が週を制す。",
      },
      analytics: {
        weeklyProgress: "週間進捗",
        xpEarned: "獲得XP",
        tasksCompleted: "完了タスク",
      },
    },
    quests: {
      title: "クエスト",
      subtitle: "クエストを完了してXPを獲得しよう",
      empty: "アクティブなクエストがありません",
      newQuest: "新規クエスト",
      editQuest: "クエストを編集",
      filter: "フィルター",
      category: "カテゴリ",
      schedule: "スケジュール",
      all: "すべて",
      categoryManager: "カテゴリ管理",
      closeCategoryManager: "カテゴリを閉じる",
      activeQuests: "アクティブなクエスト",
      completedQuests: "完了済み",
      deleteTitle: "クエストの削除",
      deleteMessage:
        "このクエストを削除してもよろしいですか？\nこの操作は取り消せません。",
      delete: "削除",
      created: "クエストを作成しました！",
      updated: "クエストを更新しました！",
      deleted: "クエストを削除しました",
      completed: "クエスト完了！",
    },
    questForm: {
      title: "タイトル",
      titlePlaceholder: "クエストのタイトルを入力",
      description: "説明",
      descriptionPlaceholder: "詳細な説明（任意）",
      category: "カテゴリ",
      priority: "優先度",
      schedule: "スケジュール",
      days: "曜日を選択",
      xpReward: "XP報酬",
      timerDuration: "タイマー時間（分）",
      timerPlaceholder: "タイマーを使用する場合は入力",
      tags: "タグ",
      tagsPlaceholder: "タグを追加",
      add: "追加",
      note: "メモ",
      notePlaceholder: "追加のメモ（任意）",
      cancel: "キャンセル",
      save: "保存",
      errorTitle: "タイトルは必須です",
      errorDays: "曜日を選択してください",
      errorXp: "XPは1以上である必要があります",
    },
    questCard: {
      priority: "優先度",
      complete: "完了",
      completing: "完了中...",
      edit: "編集",
      delete: "削除",
      timer: "タイマー",
      startTimer: "タイマーを開始",
      streak: "日連続",
    },
    categoryManager: {
      title: "カテゴリ管理",
      newCategory: "新規カテゴリ",
      name: "カテゴリ名",
      namePlaceholder: "例: 運動",
      defaultXp: "デフォルトXP",
      icon: "アイコン",
      color: "カラー",
      create: "作成",
      update: "更新",
      cancel: "キャンセル",
      edit: "編集",
      delete: "削除",
      default: "デフォルト",
      deleteTitle: "カテゴリの削除",
      deleteMessage:
        "このカテゴリを削除してもよろしいですか？\nこの操作は取り消せません。",
      created: "カテゴリを作成しました！",
      updated: "カテゴリを更新しました！",
      deleted: "カテゴリを削除しました",
      toast: {
        createSuccess: "カテゴリを作成しました！",
        updateSuccess: "カテゴリを更新しました！",
        deleteSuccess: "カテゴリを削除しました",
      },
      confirm: {
        deleteTitle: "カテゴリの削除",
        deleteMessage: "このカテゴリを削除してもよろしいですか？",
        deleteButton: "削除",
      },
      add: "追加",
    },
    achievements: {
      title: "実績",
      subtitle: "バッジを集めて成長を記録しよう",
      unlocked: "アンロック済み",
      total: "総実績数",
      rate: "達成率",
      streak: "現在のストリーク",
      progress: "進捗",
      typeStreak: "ストリーク",
      typeXp: "XP獲得",
      typeQuests: "クエスト完了",
      typeCategories: "カテゴリ作成",
    },
    settings: {
      title: "設定",
      subtitle: "アカウントとアプリの設定",
      languageTitle: "言語",
      languageDescription: "表示言語を選択してください",
      accountInfo: "アカウント情報",
      displayName: "表示名",
      email: "メールアドレス",
      friendCode: "フレンドコード",
      guest: "ゲスト",
      notSet: "未設定",
      storageMode: "ストレージモード",
      localMode: "ローカルモード",
      localDesc: "データをこのデバイスにのみ保存",
      cloudMode: "クラウドモード",
      cloudDesc: "Firebaseにデータを同期（要ログイン）",
      changing: "ストレージモードを変更中...",
      cloudWarning: "クラウドモードを使用するにはFirebaseの設定が必要です",
      loginWarning: "クラウドモードを使用するにはログインが必要です",
      theme: "テーマ",
      themeDark: "ダーク",
      themeLight: "ライト",
      themeSystem: "システム設定に従う",
      themeNote: "※ テーマ切り替えは今後実装予定",
      dataManagement: "データ管理",
      export: "データをエクスポート（JSON）",
      exporting: "エクスポート中...",
      import: "データをインポート",
      importing: "インポート中...",
      backupNote:
        "💡 エクスポートしたJSONファイルをバックアップとして保存できます",
      logout: "ログアウト",
      loggedOut: "ログアウトしました",
      logoutFailed: "ログアウトに失敗しました",
      confirmChange: "ストレージモードの変更",
      confirmLocalToCloud:
        "ローカルデータをクラウドに移行しますか？\n※ 既存のクラウドデータは上書きされます。",
      confirmCloudToLocal:
        "クラウドモードからローカルモードに切り替えますか？\n※ クラウドのデータはローカルには移行されません。",
      change: "変更する",
      changed: "モードに切り替えました",
      changeFailed: "ストレージモードの切り替えに失敗しました",
      exportSuccess: "データをエクスポートしました！",
      exportFailed: "エクスポートに失敗しました",
      importConfirmTitle: "データのインポート",
      importConfirmMessage:
        "インポートすると現在のローカルデータは上書きされます。\n続けますか？",
      importAction: "インポート",
      importSuccess: "データをインポートしました！",
      importFailed: "インポートに失敗しました。ファイル形式を確認してください",
      subscription: "サブスクリプション",
      premiumPlan: "プレミアムプラン",
      freePlan: "無料プラン",
      premiumDesc: "すべてのプレミアム機能にアクセスできます。",
      freeDesc:
        "無制限のカテゴリと高度な分析を解除するにはアップグレードしてください。",
      upgrade: "アップグレード",
      customizeProfile: "プロフィールをカスタマイズ",
      chooseAvatar: "アバターを選択",
      profileUpdated: "プロフィールを更新しました",
    },

    login: {
      title: "人生をゲーミファイ",
      subtitleLogin: "おかえりなさい",
      subtitleSignup: "冒険を始めましょう",
      createAccount: "アカウント作成",
      login: "ログイン",
      displayName: "表示名",
      displayNamePlaceholder: "表示名を入力",
      email: "メールアドレス",
      emailPlaceholder: "example@email.com",
      password: "パスワード",
      passwordPlaceholder: "パスワードを入力",
      loginButton: "ログイン",
      signupButton: "登録",
      signupLink: "新規登録はこちら",
      loginLink: "ログインはこちら",
      processing: "処理中...",
      or: "または",
      googleLogin: "Googleでログイン",
      googleButton: "Googleでログイン",
      toLogin: "すでにアカウントをお持ちですか？ログイン",
      toSignup: "アカウントをお持ちでないですか？新規登録",
      guestLogin: "ログインせずに続ける（ローカルモード）",
      guestButton: "ゲストとして続ける",
      noAccount: "アカウントをお持ちでないですか？",
      hasAccount: "すでにアカウントをお持ちですか？",
      errorName: "表示名を入力してください",
      errorGeneric: "エラーが発生しました",
      cloudWarning:
        "クラウドモードはまだ設定されていません。ローカルモードで利用できます。",
    },
    timer: {
      active: "タイマー実行中",
      start: "タイマーを開始",
      selectQuest: "クエストを選択してください",
      startButton: "スタート",
      pause: "一時停止",
      resume: "再開",
      stop: "停止",
      estimatedXp: "獲得予定XP",
      elapsed: "経過時間",
      completed: "タイマー完了！",
      xpGained: "XPを獲得しました",
      howTo: "タイマーの使い方",
      instruction1: "クエストを選択してタイマーを開始",
      instruction2: "1分ごとに2XPを獲得",
      instruction3: "クエストXPも追加で獲得",
      instruction4: "集中して取り組みましょう！",
    },
    categories: {
      work: "仕事",
      health: "健康",
      learning: "学習",
      relationships: "人間関係",
      money: "お金",
      hobbies: "趣味",
      life: "生活",
    },
    tasks: {
      inputPlaceholder: "例: 英語を30分勉強する",
      title: "タスク名",
      category: "カテゴリ",
      xpReward: "XP報酬",
      addTask: "タスクを追加",
      complete: "完了",
      delete: "削除",
      emptyState: "まだタスクがありません。追加して今日のXPを稼ごう！",
    },
    pwa: {
      install: {
        title: "アプリをインストール",
        description: "ホーム画面に追加して、いつでも素早くアクセス！",
        button: "インストール",
        later: "後で",
      },
      offline: {
        title: "オフラインモード",
        description:
          "インターネット接続がありません。ローカルデータを表示しています。",
      },
      notifications: {
        title: "通知設定",
        enable: "通知を有効にする",
        dailyReminder: "デイリーリマインダー",
        streakAlert: "連続日数アラート",
        questReminders: "クエストリマインダー",
        achievements: "実績通知",
        time: "通知時刻",
        permission: "通知の許可が必要です",
        grant: "許可する",
      },
    },
    analytics: {
      title: "分析",
      subtitle: "あなたの成長と活動データを可視化",
      categoryDistribution: "カテゴリ別分布",
      xpTrend: "XP獲得トレンド",
      productivityHeatmap: "生産性ヒートマップ",
      totalXp: "合計XP",
      completedQuests: "完了クエスト",
      currentStreak: "現在の連続日数",
      completionRate: "完了率",
      noData: "データがまだありません",
      quests: "クエスト",
      xpEarned: "獲得XP",
      unlockTrends:
        "トレンドを解除して、時間の経過に伴う進捗を確認しましょう。",
      unlockHeatmap: "ヒートマップを解除して、日々の活動を可視化しましょう。",
      premiumFeature: "プレミアム機能",
    },
    social: {
      friends: "フレンド",
      friendsSubtitle: "仲間と一緒に成長しよう",
      yourFriendCode: "あなたのフレンドコード",
      shareCodeDesc: "このコードを友達に共有してフレンドになろう",
      friendCode: "フレンドコード",
      addFriend: "フレンドを追加",
      add: "追加",
      friendAdded: "フレンドを追加しました！",
      myFriends: "マイフレンド",
      leaderboard: "ランキング",
      noFriends: "まだフレンドがいません",
      noFriendsDesc: "フレンドコードを入力して仲間を追加しましょう",
      noLeaderboard: "ランキングがありません",
      noLeaderboardDesc: "フレンドを追加するとランキングが表示されます",
      removeFriendConfirm: "フレンドを削除",
      removeFriendMessage: "本当にこのフレンドを削除しますか？",
      remove: "削除",
      friendsAndLeaderboard: "フレンド & ランキング",
      activityFeed: "アクティビティフィード",
      recentActivities: "最近のアクティビティ",
      noActivities: "まだアクティビティがありません",
      noActivitiesDesc: "クエストを完了するとここに表示されます！",
      completed: "完了しました",
      writeComment: "コメントを書く...",
      justNow: "たった今",
      minutesAgo: "分前",
      hoursAgo: "時間前",
      daysAgo: "日前",
    },
    premium: {
      currentPlan: "現在のプラン",
      upgradeNow: "今すぐアップグレード",
    },
    errors: {
      questCreateFailed: "クエストの作成に失敗しました",
      questUpdateFailed: "クエストの更新に失敗しました",
      questCompleteFailed: "クエストの完了に失敗しました",
      questDeleteFailed: "クエストの削除に失敗しました",
      cloudModeNotConfigured: "クラウドモードが設定されていません",
      generic: "エラーが発生しました",
      unexpected: "申し訳ございません。予期しないエラーが発生しました。",
      notFound: "ページが見つかりません",
      notFoundDesc: "お探しのページは存在しないか、移動した可能性があります。",
      backToDashboard: "ダッシュボードに戻る",
    },
  },
  en: {
    common: {
      low: "Low",
      medium: "Medium",
      high: "High",
      once: "Once",
      daily: "Daily",
      weekly: "Weekly",
      confirm: "Confirm",
      cancel: "Cancel",
      loading: "Loading...",
      retry: "Retry",
      minutes: "min",
      xp: "XP",
      days: {
        sun: "Sun",
        mon: "Mon",
        tue: "Tue",
        wed: "Wed",
        thu: "Thu",
        fri: "Fri",
        sat: "Sat",
      },
    },
    nav: {
      dashboard: "Dashboard",
      quests: "Quests",
      battle: "Boss Battle",
      shop: "Shop",
      skills: "Skills",
      achievements: "Achievements",
      settings: "Settings",
      analytics: "Analytics",
      friends: "Friends",
    },
    dashboard: {
      title: "Dashboard",
      subtitle: "Welcome back",
      level: "Lv",
      nextLevel: "Next Level",
      todayXp: "Today's XP",
      streak: "Streak",
      streakUnit: "days",
      totalXp: "Total XP",
      completedQuests: "Completed",
      todaysQuests: "Today's Quests",
      viewAll: "View All",
      noQuestsTitle: "No quests for today",
      noQuestsDesc: "Create a new quest to start your adventure!",

      themeNote: "* Theme switching coming soon",
      dataManagement: "Data Management",
      export: "Export Data (JSON)",
      exporting: "Exporting...",
      import: "Import Data",
      importing: "Importing...",
      backupNote: "💡 You can save the exported JSON file as a backup",
      logout: "Sign Out",
      loggedOut: "Signed out successfully",
      logoutFailed: "Failed to sign out",
      confirmChange: "Change Storage Mode",
      confirmLocalToCloud:
        "Migrate local data to cloud?\n* Existing cloud data will be overwritten.",
      confirmCloudToLocal:
        "Switch from cloud to local mode?\n* Cloud data will not be migrated to local.",
      change: "Change",
      changed: "Switched to mode",
      changeFailed: "Failed to switch storage mode",
      exportSuccess: "Data exported successfully!",
      exportFailed: "Export failed",
      importConfirmTitle: "Import Data",
      importConfirmMessage:
        "Importing will overwrite current local data.\nContinue?",
      importAction: "Import",
      importSuccess: "Data imported successfully!",
      importFailed: "Import failed. Please check the file format.",
    },
    settings: {
      title: "Settings",
      subtitle: "Manage your app preferences",
      languageTitle: "Language",
      languageDescription: "Select display language",
      storageMode: "Storage Mode",
      localMode: "Local Mode",
      localDesc: "Save data only on this device",
      cloudMode: "Cloud Mode",
      cloudDesc: "Sync data to Firebase (Login required)",
      changing: "Changing storage mode...",
      cloudWarning: "Firebase configuration is required to use Cloud Mode",
      loginWarning: "Login is required to use Cloud Mode",
      theme: "Theme",
      themeDark: "Dark",
      themeLight: "Light",
      themeSystem: "System Default",
      themeNote: "* Theme switching coming soon",
      dataManagement: "Data Management",
      export: "Export Data (JSON)",
      exporting: "Exporting...",
      import: "Import Data",
      importing: "Importing...",
      backupNote: "💡 You can save the exported JSON file as a backup",
      logout: "Sign Out",
      loggedOut: "Signed out successfully",
      logoutFailed: "Failed to sign out",
      confirmChange: "Change Storage Mode",
      confirmLocalToCloud:
        "Migrate local data to cloud?\n* Existing cloud data will be overwritten.",
      confirmCloudToLocal:
        "Switch from cloud to local mode?\n* Cloud data will not be migrated to local.",
      change: "Change",
      changed: "Switched to mode",
      changeFailed: "Failed to switch storage mode",
      exportSuccess: "Data exported successfully!",
      exportFailed: "Export failed",
      importConfirmTitle: "Import Data",
      importConfirmMessage:
        "Importing will overwrite current local data.\nContinue?",
      importAction: "Import",
      importSuccess: "Data imported successfully!",
      importFailed: "Import failed. Please check the file format.",
      subscription: "Subscription",
      premiumPlan: "Premium Plan",
      freePlan: "Free Plan",
      premiumDesc: "You have access to all premium features.",
      freeDesc:
        "Upgrade to unlock unlimited categories and advanced analytics.",
      upgrade: "Upgrade",
      customizeProfile: "Customize Profile",
      chooseAvatar: "Choose your avatar",
      profileUpdated: "Profile updated",
      accountInfo: "Account Info",
      displayName: "Display Name",
      email: "Email",
      friendCode: "Friend Code",
      guest: "Guest",
      notSet: "Not set",
    },
    login: {
      title: "Gamify Your Life",
      subtitleLogin: "Welcome back",
      subtitleSignup: "Start your adventure",
      createAccount: "Create Account",
      login: "Login",
      displayName: "Display Name",
      displayNamePlaceholder: "Enter display name",
      email: "Email",
      emailPlaceholder: "example@email.com",
      password: "Password",
      passwordPlaceholder: "Enter password",
      loginButton: "Login",
      signupButton: "Sign Up",
      signupLink: "Sign up here",
      loginLink: "Login here",
      processing: "Processing...",
      or: "OR",
      googleLogin: "Continue with Google",
      googleButton: "Continue with Google",
      toLogin: "Already have an account? Login",
      toSignup: "Don't have an account? Sign up",
      guestLogin: "Continue without login (Local Mode)",
      guestButton: "Continue as Guest",
      noAccount: "Don't have an account?",
      hasAccount: "Already have an account?",
      errorName: "Display name is required",
      errorGeneric: "An error occurred",
      cloudWarning: "Cloud mode is not configured yet. You can use Local Mode.",
    },
    timer: {
      active: "Timer Active",
      start: "Start Timer",
      selectQuest: "Please select a quest",
      startButton: "Start",
      pause: "Pause",
      resume: "Resume",
      stop: "Stop",
      estimatedXp: "Estimated XP",
      elapsed: "Elapsed Time",
      completed: "Timer Completed!",
      xpGained: "XP Gained",
      howTo: "How to use Timer",
      instruction1: "Select a quest and start the timer",
      instruction2: "Earn 2 XP every minute",
      instruction3: "Earn quest XP additionally",
      instruction4: "Stay focused!",
    },
    categories: {
      work: "Work",
      health: "Health",
      learning: "Learning",
      relationships: "Relationships",
      money: "Finance",
      hobbies: "Hobbies",
      life: "Life",
    },
    tasks: {
      inputPlaceholder: "e.g., Study English for 30 minutes",
      title: "Task Name",
      category: "Category",
      xpReward: "XP Reward",
      addTask: "Add Task",
      complete: "Complete",
      delete: "Delete",
      emptyState: "No tasks yet. Add one to earn XP today!",
    },
    pwa: {
      install: {
        title: "Install App",
        description: "Add to home screen for quick access anytime!",
        button: "Install",
        later: "Later",
      },
      offline: {
        title: "Offline Mode",
        description: "No internet connection. Showing local data.",
      },
      notifications: {
        title: "Notification Settings",
        enable: "Enable Notifications",
        dailyReminder: "Daily Reminder",
        streakAlert: "Streak Alert",
        questReminders: "Quest Reminders",
        achievements: "Achievement Notifications",
        time: "Notification Time",
        permission: "Notification permission required",
        grant: "Grant Permission",
      },
    },
    analytics: {
      title: "Analytics",
      subtitle: "Visualize your growth and activity data",
      categoryDistribution: "Category Distribution",
      xpTrend: "XP Trend",
      productivityHeatmap: "Productivity Heatmap",
      totalXp: "Total XP",
      completedQuests: "Completed Quests",
      currentStreak: "Current Streak",
      completionRate: "Completion Rate",
      noData: "No data yet",
      quests: "Quests",
      xpEarned: "XP Earned",
      unlockTrends: "Unlock trends to see your progress over time.",
      unlockHeatmap: "Unlock heatmap to visualize your daily activity.",
      premiumFeature: "Premium Feature",
    },
    social: {
      friends: "Friends",
      friendsSubtitle: "Level up together with your friends",
      yourFriendCode: "Your Friend Code",
      shareCodeDesc: "Share this code with friends to connect",
      friendCode: "Friend Code",
      addFriend: "Add Friend",
      add: "Add",
      friendAdded: "Friend added!",
      myFriends: "My Friends",
      leaderboard: "Leaderboard",
      noFriends: "No friends yet",
      noFriendsDesc: "Enter a friend code to add your first friend",
      noLeaderboard: "No leaderboard yet",
      noLeaderboardDesc: "Add friends to see the leaderboard",
      removeFriendConfirm: "Remove Friend",
      removeFriendMessage: "Are you sure you want to remove this friend?",
      remove: "Remove",
      friendsAndLeaderboard: "Friends & Leaderboard",
      activityFeed: "Activity Feed",
      recentActivities: "Recent Activities",
      noActivities: "No activities yet",
      noActivitiesDesc: "Complete quests to see them here!",
      completed: "Completed",
      writeComment: "Write a comment...",
      justNow: "Just now",
      minutesAgo: "m ago",
      hoursAgo: "h ago",
      daysAgo: "d ago",
    },
    premium: {
      currentPlan: "Current Plan",
      upgradeNow: "Upgrade Now",
    },
    errors: {
      questCreateFailed: "Failed to create quest",
      questUpdateFailed: "Failed to update quest",
      questCompleteFailed: "Failed to complete quest",
      questDeleteFailed: "Failed to delete quest",
      cloudModeNotConfigured: "Cloud mode is not configured",
      generic: "An error occurred",
      unexpected: "We apologize, but an unexpected error has occurred.",
      notFound: "Page Not Found",
      notFoundDesc:
        "The page you are looking for does not exist or has been moved.",
      backToDashboard: "Back to Dashboard",
    },
  },
} as const;

export type TranslationKey =
  | "common.low"
  | "common.medium"
  | "common.high"
  | "common.once"
  | "common.daily"
  | "common.weekly"
  | "common.confirm"
  | "common.cancel"
  | "common.loading"
  | "common.minutes"
  | "common.xp"
  | "common.days.sun"
  | "common.days.mon"
  | "common.days.tue"
  | "common.days.wed"
  | "common.days.thu"
  | "common.days.fri"
  | "common.days.sat"
  | "nav.dashboard"
  | "nav.quests"
  | "nav.battle"
  | "nav.shop"
  | "nav.skills"
  | "nav.achievements"
  | "nav.settings"
  | "nav.analytics"
  | "nav.friends"
  | "dashboard.title"
  | "dashboard.subtitle"
  | "dashboard.level"
  | "dashboard.nextLevel"
  | "dashboard.todayXp"
  | "dashboard.streak"
  | "dashboard.streakUnit"
  | "dashboard.totalXp"
  | "dashboard.completedQuests"
  | "dashboard.todaysQuests"
  | "dashboard.viewAll"
  | "dashboard.noQuestsTitle"
  | "dashboard.noQuestsDesc"
  | "dashboard.createQuest"
  | "dashboard.timerActive"
  | "dashboard.levelUp"
  | "dashboard.newAchievement"
  | "dashboard.motivation.message1"
  | "dashboard.motivation.message2"
  | "dashboard.motivation.message3"
  | "dashboard.motivation.message4"
  | "dashboard.motivation.message5"
  | "dashboard.motivation.message6"
  | "dashboard.motivation.message7"
  | "quests.title"
  | "quests.subtitle"
  | "quests.empty"
  | "quests.newQuest"
  | "quests.editQuest"
  | "quests.filter"
  | "quests.category"
  | "quests.schedule"
  | "quests.all"
  | "quests.categoryManager"
  | "quests.closeCategoryManager"
  | "quests.activeQuests"
  | "quests.completedQuests"
  | "quests.deleteTitle"
  | "quests.deleteMessage"
  | "quests.delete"
  | "quests.created"
  | "quests.updated"
  | "quests.deleted"
  | "quests.completed"
  | "questForm.title"
  | "questForm.titlePlaceholder"
  | "questForm.description"
  | "questForm.descriptionPlaceholder"
  | "questForm.category"
  | "questForm.priority"
  | "questForm.schedule"
  | "questForm.days"
  | "questForm.xpReward"
  | "questForm.timerDuration"
  | "questForm.timerPlaceholder"
  | "questForm.tags"
  | "questForm.tagsPlaceholder"
  | "questForm.add"
  | "questForm.note"
  | "questForm.notePlaceholder"
  | "questForm.cancel"
  | "questForm.save"
  | "questForm.errorTitle"
  | "questForm.errorDays"
  | "questForm.errorXp"
  | "questCard.priority"
  | "questCard.complete"
  | "questCard.completing"
  | "questCard.edit"
  | "questCard.delete"
  | "questCard.timer"
  | "questCard.startTimer"
  | "questCard.streak"
  | "categoryManager.title"
  | "categoryManager.newCategory"
  | "categoryManager.name"
  | "categoryManager.namePlaceholder"
  | "categoryManager.defaultXp"
  | "categoryManager.icon"
  | "categoryManager.color"
  | "categoryManager.create"
  | "categoryManager.update"
  | "categoryManager.cancel"
  | "categoryManager.edit"
  | "categoryManager.delete"
  | "categoryManager.default"
  | "categoryManager.deleteTitle"
  | "categoryManager.deleteMessage"
  | "categoryManager.created"
  | "categoryManager.updated"
  | "categoryManager.deleted"
  | "categoryManager.toast.createSuccess"
  | "categoryManager.toast.updateSuccess"
  | "categoryManager.toast.deleteSuccess"
  | "categoryManager.confirm.deleteTitle"
  | "categoryManager.confirm.deleteMessage"
  | "categoryManager.confirm.deleteButton"
  | "categoryManager.add"
  | "achievements.title"
  | "achievements.subtitle"
  | "achievements.unlocked"
  | "achievements.total"
  | "achievements.rate"
  | "achievements.streak"
  | "achievements.progress"
  | "achievements.typeStreak"
  | "achievements.typeXp"
  | "achievements.typeQuests"
  | "achievements.typeCategories"
  | "settings.title"
  | "settings.subtitle"
  | "settings.languageTitle"
  | "settings.languageDescription"
  | "settings.accountInfo"
  | "settings.displayName"
  | "settings.email"
  | "settings.friendCode"
  | "settings.guest"
  | "settings.notSet"
  | "settings.storageMode"
  | "settings.localMode"
  | "settings.localDesc"
  | "settings.cloudMode"
  | "settings.cloudDesc"
  | "settings.changing"
  | "settings.cloudWarning"
  | "settings.loginWarning"
  | "settings.theme"
  | "settings.themeDark"
  | "settings.themeLight"
  | "settings.themeSystem"
  | "settings.themeNote"
  | "settings.dataManagement"
  | "settings.export"
  | "settings.exporting"
  | "settings.import"
  | "settings.importing"
  | "settings.backupNote"
  | "settings.logout"
  | "settings.loggedOut"
  | "settings.logoutFailed"
  | "settings.confirmChange"
  | "settings.confirmLocalToCloud"
  | "settings.confirmCloudToLocal"
  | "settings.change"
  | "settings.changed"
  | "settings.changeFailed"
  | "settings.exportSuccess"
  | "settings.exportFailed"
  | "settings.importConfirmTitle"
  | "settings.importConfirmMessage"
  | "settings.importAction"
  | "settings.importSuccess"
  | "settings.importFailed"
  | "login.title"
  | "login.subtitleLogin"
  | "login.subtitleSignup"
  | "login.createAccount"
  | "login.login"
  | "login.displayName"
  | "login.displayNamePlaceholder"
  | "login.email"
  | "login.emailPlaceholder"
  | "login.password"
  | "login.passwordPlaceholder"
  | "login.loginButton"
  | "login.signupButton"
  | "login.signupLink"
  | "login.loginLink"
  | "login.processing"
  | "login.or"
  | "login.googleLogin"
  | "login.googleButton"
  | "login.toLogin"
  | "login.toSignup"
  | "login.guestLogin"
  | "login.guestButton"
  | "login.noAccount"
  | "login.hasAccount"
  | "login.errorName"
  | "login.errorGeneric"
  | "login.cloudWarning"
  | "timer.active"
  | "timer.start"
  | "timer.selectQuest"
  | "timer.startButton"
  | "timer.pause"
  | "timer.resume"
  | "timer.stop"
  | "timer.estimatedXp"
  | "timer.elapsed"
  | "timer.completed"
  | "timer.xpGained"
  | "timer.howTo"
  | "timer.instruction1"
  | "timer.instruction2"
  | "timer.instruction3"
  | "timer.instruction4"
  | "categories.work"
  | "categories.health"
  | "categories.learning"
  | "categories.relationships"
  | "categories.money"
  | "categories.hobbies"
  | "categories.life"
  | "settings.title"
  | "settings.subtitle"
  | "settings.subscription"
  | "settings.premiumPlan"
  | "settings.freePlan"
  | "settings.premiumDesc"
  | "settings.freeDesc"
  | "settings.upgrade"
  | "settings.customizeProfile"
  | "settings.chooseAvatar"
  | "settings.profileUpdated"
  | "settings.accountInfo"
  | "settings.displayName"
  | "settings.email"
  | "settings.friendCode"
  | "settings.guest"
  | "settings.notSet"
  | "social.friendsAndLeaderboard"
  | "social.activityFeed"
  | "social.recentActivities"
  | "social.noActivities"
  | "social.noActivitiesDesc"
  | "social.completed"
  | "social.writeComment"
  | "social.justNow"
  | "social.minutesAgo"
  | "social.hoursAgo"
  | "social.daysAgo"
  | "premium.currentPlan"
  | "premium.upgradeNow"
  | "tasks.inputPlaceholder"
  | "tasks.title"
  | "tasks.category"
  | "tasks.xpReward"
  | "tasks.addTask"
  | "tasks.complete"
  | "tasks.delete"
  | "tasks.emptyState"
  | "pwa.install.title"
  | "pwa.install.description"
  | "pwa.install.button"
  | "pwa.install.later"
  | "pwa.offline.title"
  | "pwa.offline.description"
  | "pwa.notifications.title"
  | "pwa.notifications.enable"
  | "pwa.notifications.dailyReminder"
  | "pwa.notifications.streakAlert"
  | "pwa.notifications.questReminders"
  | "pwa.notifications.achievements"
  | "pwa.notifications.time"
  | "pwa.notifications.permission"
  | "pwa.notifications.grant"
  | "pwa.notifications.grant"
  | "analytics.title"
  | "analytics.subtitle"
  | "analytics.categoryDistribution"
  | "analytics.xpTrend"
  | "analytics.productivityHeatmap"
  | "analytics.totalXp"
  | "analytics.completedQuests"
  | "analytics.currentStreak"
  | "analytics.completionRate"
  | "analytics.noData"
  | "analytics.quests"
  | "analytics.xpEarned"
  | "analytics.unlockTrends"
  | "analytics.unlockHeatmap"
  | "analytics.premiumFeature"
  | "nav.analytics"
  | "nav.friends"
  | "social.friends"
  | "social.friendsSubtitle"
  | "social.yourFriendCode"
  | "social.shareCodeDesc"
  | "social.friendCode"
  | "social.addFriend"
  | "social.add"
  | "social.friendAdded"
  | "social.myFriends"
  | "social.leaderboard"
  | "social.noFriends"
  | "social.noFriendsDesc"
  | "social.noLeaderboard"
  | "social.noLeaderboardDesc"
  | "social.removeFriendConfirm"
  | "social.removeFriendMessage"
  | "social.remove"
  | "errors.questCreateFailed"
  | "errors.questUpdateFailed"
  | "errors.questCompleteFailed"
  | "errors.questDeleteFailed"
  | "errors.cloudModeNotConfigured"
  | "errors.generic"
  | "errors.unexpected"
  | "errors.notFound"
  | "errors.notFoundDesc"
  | "errors.backToDashboard"
  | "common.retry"
  | "dashboard.analytics.weeklyProgress"
  | "dashboard.analytics.xpEarned"
  | "dashboard.analytics.tasksCompleted";
