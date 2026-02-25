import { questRepository } from '@/repositories/SupabaseQuestRepository';
import { useAuth } from '@/src/context/AuthContext';
import { QuestProgress } from '@/types/quest';
import { useCallback, useEffect, useState } from 'react';
import { usePowerLevel } from './usePowerLevel';

/**
 * Hook for managing daily quests logic
 */
export function useDailyQuests() {
    const { user } = useAuth();
    const { addXP, refresh: refreshProfile } = usePowerLevel();
    const [quests, setQuests] = useState<QuestProgress[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchQuests = useCallback(async () => {
        if (!user?.id) return;
        setLoading(true);
        try {
            const data = await questRepository.getUserDailyQuests(user.id);
            setQuests(data);
        } catch (e) {
            console.error('Error fetching quests:', e);
            setError(e as Error);
        } finally {
            setLoading(false);
        }
    }, [user?.id]);

    const claimReward = useCallback(async (questProgressId: string) => {
        const questProgress = quests.find(q => q.id === questProgressId);
        if (!questProgress || questProgress.claimedAt) return false;

        try {
            const success = await questRepository.claimQuestReward(questProgressId);
            if (success) {
                // Optimistic update
                setQuests(prev => prev.map(q =>
                    q.id === questProgressId
                        ? { ...q, claimedAt: new Date().toISOString() }
                        : q
                ));

                // Add rewards to profile
                if (questProgress.quest.xp_reward) {
                    await addXP(questProgress.quest.xp_reward);
                }

                // Refresh profile to ensure sync
                await refreshProfile();
                return true;
            }
        } catch (e) {
            console.error('Error claiming reward:', e);
        }
        return false;
    }, [quests, addXP, refreshProfile]);

    useEffect(() => {
        if (user?.id) {
            fetchQuests();

            // Auto-refresh quests every 30 seconds to stay in sync
            // Typically would use real-time listeners, but this works well for polling
            const interval = setInterval(fetchQuests, 30000);
            return () => clearInterval(interval);
        }
    }, [user?.id, fetchQuests]);

    return {
        quests,
        loading,
        error,
        refresh: fetchQuests,
        claimReward
    };
}
