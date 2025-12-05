"use client";

import { useState, useEffect } from 'react';
import { useUser } from '../features/user/context/UserContext';
import { useQuests } from '../features/quests/hooks/useQuests';

export interface DailyChallenge {
    id: string;
    title: string;
    description: string;
    target: number;
    progress: number;
    reward: {
        xp: number;
        gold: number;
    };
    isCompleted: boolean;
    type: 'xp' | 'quests' | 'streak';
}

export function useDailyChallenges() {
    const { user, addXp, addGold } = useUser();
    const { quests } = useQuests();
    const [challenges, setChallenges] = useState<DailyChallenge[]>([]);

    // Initialize challenges
    useEffect(() => {
        const today = new Date().toISOString().slice(0, 10);
        const storedChallenges = localStorage.getItem(`level-life:daily-challenges:${today}`);

        if (storedChallenges) {
            setChallenges(JSON.parse(storedChallenges));
        } else {
            // Generate new challenges
            const newChallenges: DailyChallenge[] = [
                {
                    id: 'daily-xp',
                    title: '本日の成長',
                    description: '今日中に100XPを獲得する',
                    target: 100,
                    progress: 0,
                    reward: { xp: 50, gold: 20 },
                    isCompleted: false,
                    type: 'xp'
                },
                {
                    id: 'daily-quests',
                    title: 'クエストマスター',
                    description: 'クエストを3つ完了する',
                    target: 3,
                    progress: 0,
                    reward: { xp: 100, gold: 50 },
                    isCompleted: false,
                    type: 'quests'
                },
                {
                    id: 'daily-streak',
                    title: '継続は力なり',
                    description: 'ストリークを維持する',
                    target: 1,
                    progress: user.streak?.current > 0 ? 1 : 0,
                    reward: { xp: 30, gold: 10 },
                    isCompleted: user.streak?.current > 0,
                    type: 'streak'
                }
            ];
            setChallenges(newChallenges);
            localStorage.setItem(`level-life:daily-challenges:${today}`, JSON.stringify(newChallenges));
        }
    }, []);

    // Update progress
    useEffect(() => {
        if (challenges.length === 0) return;

        const today = new Date().toISOString().slice(0, 10);
        let updated = false;

        const newChallenges = challenges.map(challenge => {
            if (challenge.isCompleted) return challenge;

            let newProgress = challenge.progress;

            if (challenge.type === 'quests') {
                // Filter completed quests for today
                const completedToday = quests.filter((q: any) => {
                    if (!q.completedAt) return false;
                    const completedDate = new Date(q.completedAt).toISOString().slice(0, 10);
                    return completedDate === today;
                }).length;
                newProgress = completedToday;
            } else if (challenge.type === 'xp') {
                // This is tricky without real-time XP tracking hook, 
                // simplified to use user's total XP difference or similar logic
                // For now, we'll assume progress is updated manually or via event
            } else if (challenge.type === 'streak') {
                newProgress = user.streak?.current > 0 ? 1 : 0;
            }

            if (newProgress !== challenge.progress) {
                updated = true;
                return { ...challenge, progress: newProgress };
            }
            return challenge;
        });

        if (updated) {
            setChallenges(newChallenges);
            localStorage.setItem(`level-life:daily-challenges:${today}`, JSON.stringify(newChallenges));
        }
    }, [quests, user.streak?.current]);

    const claimReward = (challengeId: string) => {
        const challenge = challenges.find(c => c.id === challengeId);
        if (!challenge || challenge.isCompleted || challenge.progress < challenge.target) return;

        addXp(challenge.reward.xp);
        addGold(challenge.reward.gold);

        const newChallenges = challenges.map(c =>
            c.id === challengeId ? { ...c, isCompleted: true } : c
        );

        setChallenges(newChallenges);
        const today = new Date().toISOString().slice(0, 10);
        localStorage.setItem(`level-life:daily-challenges:${today}`, JSON.stringify(newChallenges));
    };

    return {
        challenges,
        claimReward
    };
}
