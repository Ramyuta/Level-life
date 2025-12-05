"use client";

import { useState, useEffect } from 'react';

export type Season = 'spring' | 'summer' | 'autumn' | 'winter' | 'new_year' | 'halloween' | 'christmas';

export interface SeasonEvent {
    id: string;
    season: Season;
    name: string;
    description: string;
    themeColor: string;
    icon: string;
    startDate: { month: number; day: number };
    endDate: { month: number; day: number };
}

const SEASON_EVENTS: SeasonEvent[] = [
    {
        id: 'new_year',
        season: 'new_year',
        name: '新年イベント',
        description: '新たな目標を立てて、良いスタートを切ろう！',
        themeColor: 'from-red-500 to-white',
        icon: '🎍',
        startDate: { month: 1, day: 1 },
        endDate: { month: 1, day: 15 }
    },
    {
        id: 'spring_blossom',
        season: 'spring',
        name: '桜祭り',
        description: '新しい出会いと始まりの季節。',
        themeColor: 'from-pink-400 to-rose-300',
        icon: '🌸',
        startDate: { month: 3, day: 20 },
        endDate: { month: 4, day: 30 }
    },
    {
        id: 'summer_festival',
        season: 'summer',
        name: '夏祭り',
        description: '暑さに負けず、アクティブに過ごそう！',
        themeColor: 'from-blue-400 to-cyan-300',
        icon: '🎆',
        startDate: { month: 7, day: 1 },
        endDate: { month: 8, day: 31 }
    },
    {
        id: 'halloween',
        season: 'halloween',
        name: 'ハロウィン',
        description: 'トリック・オア・トリート！タスクを完了してお菓子をもらおう。',
        themeColor: 'from-orange-500 to-purple-600',
        icon: '🎃',
        startDate: { month: 10, day: 1 },
        endDate: { month: 10, day: 31 }
    },
    {
        id: 'autumn_harvest',
        season: 'autumn',
        name: '収穫祭',
        description: '実りの秋。努力の成果を確認しよう。',
        themeColor: 'from-amber-500 to-orange-400',
        icon: '🍁',
        startDate: { month: 9, day: 1 },
        endDate: { month: 11, day: 30 }
    },
    {
        id: 'christmas',
        season: 'christmas',
        name: 'クリスマス',
        description: '一年の締めくくり。自分へのプレゼントを獲得しよう。',
        themeColor: 'from-red-600 to-green-600',
        icon: '🎄',
        startDate: { month: 12, day: 1 },
        endDate: { month: 12, day: 25 }
    },
    {
        id: 'winter_chill',
        season: 'winter',
        name: '冬の静寂',
        description: '寒さに負けず、内面を磨く季節。',
        themeColor: 'from-slate-400 to-blue-200',
        icon: '❄️',
        startDate: { month: 12, day: 26 },
        endDate: { month: 2, day: 28 }
    }
];

export function useSeasonEvents() {
    const [currentEvent, setCurrentEvent] = useState<SeasonEvent | null>(null);

    useEffect(() => {
        const now = new Date();
        const currentMonth = now.getMonth() + 1;
        const currentDay = now.getDate();

        // Find matching event
        // Priority: Special events (New Year, Halloween, Christmas) > Seasonal events
        const event = SEASON_EVENTS.find(e => {
            const start = e.startDate;
            const end = e.endDate;

            if (start.month === end.month) {
                return currentMonth === start.month && currentDay >= start.day && currentDay <= end.day;
            } else {
                // Cross-month logic (simplified)
                if (currentMonth === start.month && currentDay >= start.day) return true;
                if (currentMonth === end.month && currentDay <= end.day) return true;
                if (currentMonth > start.month && currentMonth < end.month) return true;

                // Handle year wrap for winter (Dec -> Feb)
                if (start.month > end.month) {
                    if (currentMonth >= start.month && currentDay >= start.day) return true;
                    if (currentMonth <= end.month && currentDay <= end.day) return true;
                }

                return false;
            }
        });

        // Fallback to generic season if no specific event matches
        // (Logic simplified above covers most ranges, but could add generic fallback here)

        setCurrentEvent(event || SEASON_EVENTS[1]); // Default to Spring if nothing matches (shouldn't happen with full coverage)
    }, []);

    return {
        currentEvent
    };
}
