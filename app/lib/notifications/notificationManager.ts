"use client";

export type NotificationType = "daily" | "streak" | "quest" | "achievement";

export interface NotificationConfig {
  enabled: boolean;
  dailyReminderTime: string; // "09:00"
  streakAlertEnabled: boolean;
  questRemindersEnabled: boolean;
  achievementNotificationsEnabled: boolean;
}

const STORAGE_KEY = "notification-config";

const DEFAULT_CONFIG: NotificationConfig = {
  enabled: false,
  dailyReminderTime: "09:00",
  streakAlertEnabled: true,
  questRemindersEnabled: true,
  achievementNotificationsEnabled: true,
};

export const NotificationManager = {
  // Check if notifications are supported
  isSupported: (): boolean => {
    if (typeof window === "undefined") return false;
    return "Notification" in window;
  },

  // Request permission
  requestPermission: async (): Promise<NotificationPermission> => {
    if (!NotificationManager.isSupported()) return "denied";
    const permission = await Notification.requestPermission();
    return permission;
  },

  // Get current permission state
  getPermission: (): NotificationPermission => {
    if (!NotificationManager.isSupported()) return "denied";
    return Notification.permission;
  },

  // Send a notification
  sendNotification: (title: string, options?: NotificationOptions) => {
    if (!NotificationManager.isSupported()) return;
    if (Notification.permission !== "granted") return;

    // Try to use Service Worker registration if available (for mobile support)
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.showNotification(title, {
          icon: "/icons/icon-192x192.png",
          badge: "/icons/icon-96x96.png",
          ...options,
        });
      });
    } else {
      // Fallback to standard Notification API
      new Notification(title, {
        icon: "/icons/icon-192x192.png",
        ...options,
      });
    }
  },

  // Save config
  saveConfig: (config: NotificationConfig) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  },

  // Load config
  loadConfig: (): NotificationConfig => {
    if (typeof window === "undefined") return DEFAULT_CONFIG;
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return DEFAULT_CONFIG;
    try {
      return { ...DEFAULT_CONFIG, ...JSON.parse(stored) };
    } catch {
      return DEFAULT_CONFIG;
    }
  },
};
