"use client";

import { useState, useEffect } from 'react';
import { useUser } from '../features/user/context/UserContext';
import { useQuests } from '../features/quests/hooks/useQuests';

export interface Boss {
    id: string;
    name: string;
    description: string;
    image: string;
    hp: number;
    maxHp: number;
    level: number;
    rewards: {
        xp: number;
        gold: number;
        item?: string;
    };
    weakness: string; // e.g., 'fitness', 'learning'
}

const BOSS_TEMPLATES: Boss[] = [
    {
        id: 'slime_king',
        name: 'スライムキング',
        description: '怠惰の塊。動くことを極端に嫌う。',
        image: '👑',
        hp: 100,
        maxHp: 100,
        level: 1,
        rewards: { xp: 500, gold: 200 },
        weakness: 'fitness'
    },
    {
        id: 'shadow_dragon',
        name: 'シャドウドラゴン',
        description: '未完了のタスクから生まれた闇の竜。',
        image: '🐉',
        hp: 300,
        maxHp: 300,
        level: 5,
        rewards: { xp: 1500, gold: 800, item: 'dragon_scale' },
        weakness: 'productivity'
    },
    {
        id: 'time_eater',
        name: 'タイムイーター',
        description: '無駄な時間を使わせようとする悪魔。',
        image: '⏳',
        hp: 200,
        maxHp: 200,
        level: 3,
        rewards: { xp: 1000, gold: 500 },
        weakness: 'learning'
    }
];

export function useWeeklyBoss() {
    const { user, addXp, addGold } = useUser();
    const { quests } = useQuests();
    const [currentBoss, setCurrentBoss] = useState<Boss | null>(null);
    const [damageHistory, setDamageHistory] = useState<{ date: string; damage: number }[]>([]);

    // Initialize boss
    useEffect(() => {
        const storedBoss = localStorage.getItem('level-life:weekly-boss');
        const storedHistory = localStorage.getItem('level-life:boss-damage-history');

        if (storedBoss) {
            setCurrentBoss(JSON.parse(storedBoss));
        } else {
            // Select random boss for the week
            const randomBoss = BOSS_TEMPLATES[Math.floor(Math.random() * BOSS_TEMPLATES.length)];
            setCurrentBoss(randomBoss);
            localStorage.setItem('level-life:weekly-boss', JSON.stringify(randomBoss));
        }

        if (storedHistory) {
            setDamageHistory(JSON.parse(storedHistory));
        }
    }, []);

    // Calculate damage based on completed quests
    useEffect(() => {
        if (!currentBoss) return;

        const today = new Date().toISOString().slice(0, 10);

        // Check if we already calculated damage for today's quests
        // This is a simplified logic. Ideally, we should track individual quest completions.
        // For now, we'll calculate total damage based on today's completed quests
        // and compare with stored damage history for today.

        const completedToday = quests.filter((q: any) => {
            if (!q.completedAt) return false;
            const completedDate = new Date(q.completedAt).toISOString().slice(0, 10);
            return completedDate === today;
        });

        let totalDamageToday = 0;
        completedToday.forEach((q: any) => {
            let damage = 10; // Base damage
            // Bonus damage for weakness
            // Assuming quest category maps to weakness (simplified)
            if (q.category === currentBoss.weakness) {
                damage *= 1.5;
            }
            totalDamageToday += damage;
        });

        // Get previous damage recorded for today
        const todayHistory = damageHistory.find(h => h.date === today);
        const previousDamageToday = todayHistory ? todayHistory.damage : 0;

        if (totalDamageToday > previousDamageToday) {
            const newDamage = totalDamageToday - previousDamageToday;
            const newHp = Math.max(0, currentBoss.hp - newDamage);

            const updatedBoss = { ...currentBoss, hp: newHp };
            setCurrentBoss(updatedBoss);
            localStorage.setItem('level-life:weekly-boss', JSON.stringify(updatedBoss));

            // Update history
            const newHistory = [
                ...damageHistory.filter(h => h.date !== today),
                { date: today, damage: totalDamageToday }
            ];
            setDamageHistory(newHistory);
            localStorage.setItem('level-life:boss-damage-history', JSON.stringify(newHistory));

            // Check for defeat
            if (newHp === 0 && currentBoss.hp > 0) {
                // Boss defeated!
                addXp(currentBoss.rewards.xp);
                addGold(currentBoss.rewards.gold);
                // Reset boss next week logic would go here
            }
        }
    }, [quests, currentBoss, damageHistory]);

    const attackBoss = (damage: number) => {
        if (!currentBoss || currentBoss.hp <= 0) return;

        const newHp = Math.max(0, currentBoss.hp - damage);
        const updatedBoss = { ...currentBoss, hp: newHp };

        setCurrentBoss(updatedBoss);
        localStorage.setItem('level-life:weekly-boss', JSON.stringify(updatedBoss));
    };

    return {
        boss: currentBoss,
        attackBoss
    };
}
