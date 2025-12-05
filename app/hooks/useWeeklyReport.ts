"use client";

import { useUser } from '../features/user/context/UserContext';

export interface WeeklyStats {
    weekStart: Date;
    weekEnd: Date;
    totalXpGained: number;
    questsCompleted: number;
    dailyStreak: number;
    levelUps: number;
    topDay: { day: string; xp: number };
    averageDailyXp: number;
    comparisonToPreviousWeek: number; // percentage
}

export function useWeeklyReport() {
    const { user } = useUser();

    const getWeeklyStats = (): WeeklyStats => {
        const now = new Date();
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - 7);
        weekStart.setHours(0, 0, 0, 0);

        const weekEnd = new Date(now);
        weekEnd.setHours(23, 59, 59, 999);

        // Get completions from localStorage
        const completionsKey = 'level-life:completions';
        const completionsData = localStorage.getItem(completionsKey);

        let weeklyCompletions: any[] = [];
        let totalXpGained = 0;
        let questsCompleted = 0;

        if (completionsData) {
            try {
                const allCompletions = JSON.parse(completionsData);
                weeklyCompletions = allCompletions.filter((c: any) => {
                    const completedDate = new Date(c.completedAt);
                    return completedDate >= weekStart && completedDate <= weekEnd;
                });

                totalXpGained = weeklyCompletions.reduce((sum, c) => sum + (c.xpGained || 0), 0);
                questsCompleted = weeklyCompletions.length;
            } catch (error) {
                console.error('Error parsing completions:', error);
            }
        }

        // Calculate daily XP for finding top day
        const dailyXp: { [key: string]: number } = {};
        weeklyCompletions.forEach((c: any) => {
            const day = new Date(c.completedAt).toLocaleDateString('ja-JP', { weekday: 'short' });
            dailyXp[day] = (dailyXp[day] || 0) + (c.xpGained || 0);
        });

        const topDay = Object.entries(dailyXp).reduce(
            (max, [day, xp]) => (xp > max.xp ? { day, xp } : max),
            { day: '月', xp: 0 }
        );

        const averageDailyXp = totalXpGained / 7;

        // Calculate comparison to previous week
        const prevWeekStart = new Date(weekStart);
        prevWeekStart.setDate(weekStart.getDate() - 7);

        let prevWeekXp = 0;
        if (completionsData) {
            try {
                const allCompletions = JSON.parse(completionsData);
                const prevWeekCompletions = allCompletions.filter((c: any) => {
                    const completedDate = new Date(c.completedAt);
                    return completedDate >= prevWeekStart && completedDate < weekStart;
                });
                prevWeekXp = prevWeekCompletions.reduce((sum: number, c: any) => sum + (c.xpGained || 0), 0);
            } catch (error) {
                console.error('Error calculating previous week:', error);
            }
        }

        const comparisonToPreviousWeek = prevWeekXp > 0
            ? ((totalXpGained - prevWeekXp) / prevWeekXp) * 100
            : totalXpGained > 0 ? 100 : 0;

        return {
            weekStart,
            weekEnd,
            totalXpGained,
            questsCompleted,
            dailyStreak: 0, // Streak tracking would need to be implemented separately
            levelUps: 0, // Would need to track this separately
            topDay,
            averageDailyXp: Math.round(averageDailyXp),
            comparisonToPreviousWeek: Math.round(comparisonToPreviousWeek),
        };
    };

    return {
        getWeeklyStats,
    };
}
