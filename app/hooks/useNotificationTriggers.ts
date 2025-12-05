"use client";

import { useEffect } from 'react';
import { useUser } from '../features/user/context/UserContext';
import { NotificationScheduler } from '../lib/notifications/notificationScheduler';
import { NotificationManager } from '../lib/notifications/notificationManager';

/**
 * Hook to trigger notifications based on user events
 */
export function useNotificationTriggers() {
    const { user } = useUser();

    // Track previous level to detect level ups
    useEffect(() => {
        const config = NotificationManager.loadConfig();
        if (!config.enabled || !config.achievementNotificationsEnabled) return;

        const prevLevel = parseInt(localStorage.getItem('prev-level') || '1');

        if (user.level > prevLevel) {
            // Level up detected!
            NotificationScheduler.sendLevelUpNotification(user.level);
            localStorage.setItem('prev-level', user.level.toString());
        } else if (prevLevel === 1 && user.level === 1) {
            // First time, just store current level
            localStorage.setItem('prev-level', user.level.toString());
        }
    }, [user.level]);

    // Initialize scheduler when config changes
    useEffect(() => {
        NotificationScheduler.initialize();

        // Cleanup on unmount
        return () => {
            // Don't stop scheduler on unmount, let it run in background
        };
    }, []);

    return null;
}
