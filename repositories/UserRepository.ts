import { UserProfile } from '@/types/database.types';

/**
 * Repository interface for user profile operations
 * Following the Repository Pattern for clean architecture
 */
export interface UserRepository {
    /**
     * Get user profile by ID
     */
    getProfile(userId: string): Promise<UserProfile | null>;

    /**
     * Update daily streak and XP for a user
     * This is called when the user opens the app
     */
    updateDailyStreak(userId: string): Promise<{
        profile: UserProfile;
        xpGained: number;
        streakIncreased: boolean;
        leveledUp: boolean;
    }>;

    /**
     * Add XP to a user (e.g., from completing challenges)
     */
    addXP(userId: string, xpAmount: number): Promise<UserProfile>;

    /**
     * Update user profile fields
     */
    updateProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile>;

    /**
     * Mark a quote as seen by the user and award XP if it's the first time
     */
    markQuoteAsSeen(userId: string, quoteId: string): Promise<{
        seen: boolean; // True if it was already seen
        xpGained: number; // Amount of XP awarded (0 if already seen)
        leveledUp: boolean; // True if this view caused a level up
    }>;
    /**
     * Get IDs of all quotes seen by the user
     */
    getSeenQuoteIds(userId: string): Promise<string[]>;
}
