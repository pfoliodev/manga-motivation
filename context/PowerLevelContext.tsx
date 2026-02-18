import { userRepository } from '@/repositories/SupabaseUserRepository';
import { UserProfile } from '@/types/database.types';
import { supabase } from '@/utils/supabase';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

interface PowerLevelContextType {
    profile: UserProfile | null;
    loading: boolean;
    error: string | null;
    updateDailyStreak: () => Promise<void>;
    addXP: (amount: number) => Promise<void>;
    markQuoteAsSeen: (quoteId: string) => Promise<{
        seen: boolean;
        xpGained: number;
        leveledUp: boolean;
    } | void>;
    refresh: () => Promise<void>;
    xpProgress: number;
    xpForNextLevel: number;
    seenQuoteIds: Set<string>;
    isQuoteSeen: (quoteId: string) => boolean;
}

const PowerLevelContext = createContext<PowerLevelContextType | undefined>(undefined);

export function PowerLevelProvider({ children }: { children: React.ReactNode }) {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [seenQuoteIds, setSeenQuoteIds] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    /**
     * Load current user's profile
     */
    const loadProfile = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                setLoading(false);
                return;
            }

            // Load profile and seen quotes in parallel
            const [userProfile, seenIds] = await Promise.all([
                userRepository.getProfile(user.id),
                userRepository.getSeenQuoteIds(user.id)
            ]);

            if (!userProfile) {
                console.warn('Profile not found - database migration may not have been run');
                setLoading(false);
                return;
            }

            setProfile(userProfile);
            setSeenQuoteIds(new Set(seenIds));
        } catch (err) {
            console.error('Error loading profile:', err);
            setError(err instanceof Error ? err.message : 'Failed to load profile');
        } finally {
            setLoading(false);
        }
    }, []);

    const isQuoteSeen = useCallback((quoteId: string) => {
        return seenQuoteIds.has(quoteId);
    }, [seenQuoteIds]);

    /**
     * Load user profile on mount and subscribe to changes
     */
    useEffect(() => {
        loadProfile();

        // Subscribe to profile changes in realtime
        let subscription: any = null;

        const setupSubscription = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                subscription = supabase
                    .channel('profile-changes')
                    .on(
                        'postgres_changes',
                        {
                            event: 'UPDATE',
                            schema: 'public',
                            table: 'profiles',
                            filter: `id=eq.${user.id}`
                        },
                        (payload) => {
                            console.log('📡 Profile updated in realtime:', payload.new);
                            const updatedProfile = userRepository.mapToUserProfile(payload.new);
                            setProfile(updatedProfile);
                        }
                    )
                    .subscribe();
            }
        };

        setupSubscription();

        return () => {
            if (subscription) {
                subscription.unsubscribe();
            }
        };
    }, [loadProfile]);

    /**
     * Update daily streak (call this on app launch)
     */
    const updateDailyStreak = useCallback(async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const result = await userRepository.updateDailyStreak(user.id);
            setProfile(result.profile);

            if (result.xpGained > 0) {
                console.log(`🔥 Gained ${result.xpGained} XP!`);
            }
            if (result.streakIncreased) {
                console.log(`⚡ Streak: ${result.profile.streakCount} days!`);
            }
            if (result.leveledUp) {
                console.log(`🎉 Level Up! Now Level ${result.profile.level}!`);
            }
        } catch (err) {
            console.error('Error updating daily streak:', err);
            setError(err instanceof Error ? err.message : 'Failed to update streak');
        }
    }, []);

    /**
     * Add XP to user (e.g., from completing challenges)
     */
    const addXP = useCallback(async (amount: number) => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const updatedProfile = await userRepository.addXP(user.id, amount);
            setProfile(updatedProfile);

            console.log(`⚡ Gained ${amount} XP!`);
        } catch (err) {
            console.error('Error adding XP:', err);
            setError(err instanceof Error ? err.message : 'Failed to add XP');
        }
    }, []);

    /**
     * Mark quote as seen and award XP if applicable
     */
    const markQuoteAsSeen = useCallback(async (quoteId: string) => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const result = await userRepository.markQuoteAsSeen(user.id, quoteId);

            // Update seen list locally
            setSeenQuoteIds(prev => {
                const next = new Set(prev);
                next.add(quoteId);
                return next;
            });

            if (result.leveledUp) {
                console.log(`🎉 LEVEL UP! Now Level ${profile?.level ? profile.level + 1 : '?'}`);
            } else if (result.xpGained > 0) {
                console.log(`👁️ Quote seen! Gained ${result.xpGained} XP.`);
            }
            return result;
        } catch (err) {
            console.error('Error marking quote as seen:', err);
            return { seen: false, xpGained: 0, leveledUp: false };
        }
    }, [profile]);

    /**
     * Calculate XP progress to next level (0-1)
     */
    const xpProgress = profile
        ? userRepository.getXPProgress(profile.xp, profile.level)
        : 0;

    /**
     * Calculate XP needed for next level
     */
    const xpForNextLevel = profile
        ? userRepository.getXPForNextLevel(profile.level)
        : 0;

    const value: PowerLevelContextType = {
        profile,
        loading,
        error,
        updateDailyStreak,
        addXP,
        markQuoteAsSeen,
        refresh: loadProfile,
        xpProgress,
        xpForNextLevel,
        seenQuoteIds,
        isQuoteSeen,
    };

    return (
        <PowerLevelContext.Provider value={value}>
            {children}
        </PowerLevelContext.Provider>
    );
}

export function usePowerLevel(): PowerLevelContextType {
    const context = useContext(PowerLevelContext);
    if (context === undefined) {
        throw new Error('usePowerLevel must be used within a PowerLevelProvider');
    }
    return context;
}
