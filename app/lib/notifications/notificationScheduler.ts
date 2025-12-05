"use client";

import { NotificationManager } from './notificationManager';

export class NotificationScheduler {
    private static dailyReminderTimeout: NodeJS.Timeout | null = null;
    private static streakCheckInterval: NodeJS.Timeout | null = null;

    /**
     * Schedule daily reminder notification
     */
    static scheduleDailyReminder(time: string) {
        // Clear existing timeout
        if (this.dailyReminderTimeout) {
            clearTimeout(this.dailyReminderTimeout);
        }

        const [hours, minutes] = time.split(':').map(Number);
        const now = new Date();
        const scheduled = new Date();
        scheduled.setHours(hours, minutes, 0, 0);

        // If time has passed today, schedule for tomorrow
        if (scheduled <= now) {
            scheduled.setDate(scheduled.getDate() + 1);
        }

        const timeout = scheduled.getTime() - now.getTime();

        console.log(`📅 Daily reminder scheduled for ${scheduled.toLocaleString()}`);

        this.dailyReminderTimeout = setTimeout(() => {
            this.sendDailyReminder();
            // Reschedule for next day
            this.scheduleDailyReminder(time);
        }, timeout);
    }

    /**
     * Send daily reminder notification
     */
    private static sendDailyReminder() {
        NotificationManager.sendNotification('デイリーリマインダー 📅', {
            body: '今日のクエストを完了しよう！',
            tag: 'daily-reminder',
            requireInteraction: false,
            data: { url: '/dashboard' },
        });
    }

    /**
     * Start streak check (runs every hour)
     */
    static startStreakCheck() {
        // Clear existing interval
        if (this.streakCheckInterval) {
            clearInterval(this.streakCheckInterval);
        }

        // Check immediately
        this.checkStreakStatus();

        // Then check every hour
        this.streakCheckInterval = setInterval(() => {
            this.checkStreakStatus();
        }, 60 * 60 * 1000); // 1 hour

        console.log('🔥 Streak check started');
    }

    /**
     * Check streak status and send notification if needed
     */
    private static checkStreakStatus() {
        if (typeof window === 'undefined') return;

        const now = new Date();
        const hour = now.getHours();

        // Only check between 20:00 and 23:00
        if (hour < 20 || hour >= 23) return;

        // Check if user has completed any quests today
        const today = now.toISOString().split('T')[0];
        const completionsKey = 'level-life:completions';
        const completionsData = localStorage.getItem(completionsKey);

        if (!completionsData) {
            this.sendStreakAlert();
            return;
        }

        try {
            const completions = JSON.parse(completionsData);
            const todayCompletions = completions.filter((c: any) =>
                c.completedAt.startsWith(today)
            );

            if (todayCompletions.length === 0) {
                this.sendStreakAlert();
            }
        } catch (error) {
            console.error('Error checking streak status:', error);
        }
    }

    /**
     * Send streak alert notification
     */
    private static sendStreakAlert() {
        NotificationManager.sendNotification('ストリークを維持しよう！🔥', {
            body: '今日のクエストを完了してストリークを維持してください',
            tag: 'streak-alert',
            requireInteraction: true,
            data: { url: '/quests' },
        });
    }

    /**
     * Send level up notification
     */
    static sendLevelUpNotification(level: number) {
        NotificationManager.sendNotification(`レベル${level}に到達！🎉`, {
            body: `おめでとうございます！レベル${level}に到達しました`,
            tag: 'level-up',
            requireInteraction: false,
            data: { url: '/dashboard' },
        });
    }

    /**
     * Send achievement unlock notification
     */
    static sendAchievementNotification(achievementName: string) {
        NotificationManager.sendNotification('実績アンロック！🏆', {
            body: `「${achievementName}」をアンロックしました`,
            tag: 'achievement-unlock',
            requireInteraction: false,
            data: { url: '/achievements' },
        });
    }

    /**
     * Send quest completion notification
     */
    static sendQuestCompletionNotification(questTitle: string, xpGained: number) {
        NotificationManager.sendNotification('クエスト完了！✅', {
            body: `「${questTitle}」を完了して${xpGained}XPを獲得しました`,
            tag: 'quest-complete',
            requireInteraction: false,
            data: { url: '/dashboard' },
        });
    }

    /**
     * Stop all scheduled notifications
     */
    static stopAll() {
        if (this.dailyReminderTimeout) {
            clearTimeout(this.dailyReminderTimeout);
            this.dailyReminderTimeout = null;
        }
        if (this.streakCheckInterval) {
            clearInterval(this.streakCheckInterval);
            this.streakCheckInterval = null;
        }
        console.log('🛑 All notification schedules stopped');
    }

    /**
     * Initialize scheduler based on config
     */
    static initialize() {
        const config = NotificationManager.loadConfig();

        if (!config.enabled) {
            this.stopAll();
            return;
        }

        // Schedule daily reminder
        if (config.dailyReminderTime) {
            this.scheduleDailyReminder(config.dailyReminderTime);
        }

        // Start streak check
        if (config.streakAlertEnabled) {
            this.startStreakCheck();
        }

        console.log('✅ Notification scheduler initialized');
    }
}
