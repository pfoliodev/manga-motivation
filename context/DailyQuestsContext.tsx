import { questRepository } from '@/repositories/SupabaseQuestRepository';
import { useAuth } from '@/src/context/AuthContext';
import { QuestProgress } from '@/types/quest';
import { supabase } from '@/utils/supabase';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { usePowerLevel } from './PowerLevelContext';

interface DailyQuestsContextType {
    quests: QuestProgress[];
    loading: boolean;
    error: Error | null;
    refresh: () => Promise<void>;
    claimReward: (questProgressId: string) => Promise<boolean>;
}

const DailyQuestsContext = createContext<DailyQuestsContextType | undefined>(undefined);

export function DailyQuestsProvider({ children }: { children: React.ReactNode }) {
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

            // Auto-refresh quests every 30 seconds as a fallback
            const interval = setInterval(fetchQuests, 30000);

            // Subscribe to realtime changes in user_quests immediately!
            const channel = supabase
                .channel(`user_quests_${user.id}`)
                .on(
                    'postgres_changes',
                    {
                        event: 'UPDATE',
                        schema: 'public',
                        table: 'user_quests',
                        filter: `user_id=eq.${user.id}`
                    },
                    (payload: any) => {
                        console.log('⚡ Quests updated in realtime!', payload);
                        fetchQuests(); // Re-fetch to get new progress
                    }
                )
                .subscribe();

            return () => {
                clearInterval(interval);
                channel.unsubscribe();
            };
        }
    }, [user?.id, fetchQuests]);

    const value = {
        quests,
        loading,
        error,
        refresh: fetchQuests,
        claimReward
    };

    return (
        <DailyQuestsContext.Provider value={value}>
            {children}
        </DailyQuestsContext.Provider>
    );
}

export function useDailyQuests() {
    const context = useContext(DailyQuestsContext);
    if (context === undefined) {
        throw new Error('useDailyQuests must be used within a DailyQuestsProvider');
    }
    return context;
}
