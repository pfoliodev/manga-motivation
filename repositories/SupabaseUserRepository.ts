import { UserProfile } from '@/types/database.types';
import { supabase } from '@/utils/supabase';
import { UserRepository } from './UserRepository';

/**
 * Supabase implementation of UserRepository
 * Handles Power Level & Streak System logic
 */
export class SupabaseUserRepository implements UserRepository {
    /**
     * XP reward for daily login
     */
    private readonly DAILY_LOGIN_XP = 10;
    private readonly QUOTE_VIEW_XP = 5; // 5 XP per new quote viewed

    /**
     * Mark a quote as seen and award XP if new
     */
    async markQuoteAsSeen(userId: string, quoteId: string): Promise<{
        seen: boolean;
        xpGained: number;
        leveledUp: boolean;
    }> {
        // Get current level before adding XP to detect level up
        const profile = await this.getProfile(userId);
        const oldLevel = profile?.level || 1;

        // Try to insert into user_seen_quotes
        const { error } = await supabase
            .from('user_seen_quotes')
            .insert({
                user_id: userId,
                quote_id: quoteId
            });

        if (error) {
            // Error 23505 is unique_violation (already seen)
            if (error.code === '23505') {
                return { seen: true, xpGained: 0, leveledUp: false };
            }
            console.error('Error marking quote as seen:', error);
            // Return safe default to avoid breaking app flow
            return { seen: false, xpGained: 0, leveledUp: false };
        }

        // If success (not seen before), award XP
        try {
            const updatedProfile = await this.addXP(userId, this.QUOTE_VIEW_XP);
            const leveledUp = updatedProfile.level > oldLevel;
            return { seen: false, xpGained: this.QUOTE_VIEW_XP, leveledUp };
        } catch (xpError) {
            console.error('Error awarding XP for quote view:', xpError);
            // Even if XP update fails, we marked it as seen
            return { seen: false, xpGained: 0, leveledUp: false };
        }
    }

    /**
     * Get user profile by ID
     */
    async getProfile(userId: string): Promise<UserProfile | null> {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) {
            console.error('Error fetching user profile:', error);
            return null;
        }

        return this.mapToUserProfile(data);
    }

    /**
     * Update daily streak and award XP
     * 
     * Logic:
     * - If user hasn't logged in today: award XP and update streak
     * - If last login was yesterday: increment streak
     * - If last login was more than 1 day ago: reset streak to 1
     * - Calculate new level based on XP
     */
    async updateDailyStreak(userId: string): Promise<{
        profile: UserProfile;
        xpGained: number;
        streakIncreased: boolean;
        leveledUp: boolean;
    }> {
        // Get current profile
        const currentProfile = await this.getProfile(userId);
        if (!currentProfile) {
            throw new Error('User profile not found');
        }

        const now = new Date();
        const lastLogin = currentProfile.lastLogin ? new Date(currentProfile.lastLogin) : null;

        // Check if user already logged in today
        const isToday = lastLogin && this.isSameDay(now, lastLogin);
        if (isToday) {
            // Already logged in today, no update needed
            return {
                profile: currentProfile,
                xpGained: 0,
                streakIncreased: false,
                leveledUp: false,
            };
        }

        // Calculate streak
        let newStreakCount = 1;
        let streakIncreased = false;

        if (lastLogin) {
            const isYesterday = this.isConsecutiveDay(lastLogin, now);
            if (isYesterday) {
                // Consecutive day: increment streak
                newStreakCount = currentProfile.streakCount + 1;
                streakIncreased = true;
            }
            // If not yesterday, streak resets to 1 (already set above)
        }

        // Calculate new XP and level
        const newXP = currentProfile.xp + this.DAILY_LOGIN_XP;
        const oldLevel = currentProfile.level;
        const newLevel = this.calculateLevel(newXP);
        const leveledUp = newLevel > oldLevel;

        // Update max streak if needed
        const newMaxStreak = Math.max(currentProfile.maxStreak, newStreakCount);

        // Update database
        const { data, error } = await supabase
            .from('profiles')
            .update({
                xp: newXP,
                level: newLevel,
                last_login: now.toISOString(),
                streak_count: newStreakCount,
                max_streak: newMaxStreak,
                updated_at: now.toISOString(),
            })
            .eq('id', userId)
            .select()
            .single();

        if (error) {
            console.error('Error updating daily streak:', error);
            throw new Error('Failed to update daily streak');
        }

        return {
            profile: this.mapToUserProfile(data),
            xpGained: this.DAILY_LOGIN_XP,
            streakIncreased,
            leveledUp,
        };
    }

    /**
     * Add XP to user (e.g., from completing challenges)
     */
    async addXP(userId: string, xpAmount: number): Promise<UserProfile> {
        const currentProfile = await this.getProfile(userId);
        if (!currentProfile) {
            throw new Error('User profile not found');
        }

        const newXP = currentProfile.xp + xpAmount;
        const newLevel = this.calculateLevel(newXP);

        const { data, error } = await supabase
            .from('profiles')
            .update({
                xp: newXP,
                level: newLevel,
                updated_at: new Date().toISOString(),
            })
            .eq('id', userId)
            .select()
            .single();

        if (error) {
            console.error('Error adding XP:', error);
            throw new Error('Failed to add XP');
        }

        return this.mapToUserProfile(data);
    }

    /**
     * Update user profile fields
     */
    async updateProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile> {
        // Map camelCase to snake_case for database
        const dbUpdates: any = {
            updated_at: new Date().toISOString(),
        };

        if (updates.email !== undefined) dbUpdates.email = updates.email;
        if (updates.fullName !== undefined) dbUpdates.full_name = updates.fullName;
        if (updates.avatarUrl !== undefined) dbUpdates.avatar_url = updates.avatarUrl;
        if (updates.notificationsEnabled !== undefined) dbUpdates.notifications_enabled = updates.notificationsEnabled;
        if (updates.notificationTime !== undefined) dbUpdates.notification_time = updates.notificationTime;

        const { data, error } = await supabase
            .from('profiles')
            .update(dbUpdates)
            .eq('id', userId)
            .select()
            .single();

        if (error) {
            console.error('Error updating profile:', error);
            throw new Error('Failed to update profile');
        }

        return this.mapToUserProfile(data);
    }

    /**
     * Calculate level from XP
     * Formula: level = floor(sqrt(xp / 10))
     * Ensures level 1 at 0-9 XP, level 2 at 40 XP, level 3 at 90 XP, etc.
     */
    private calculateLevel(xp: number): number {
        return Math.max(1, Math.floor(Math.sqrt(xp / 10)));
    }

    /**
     * Calculate XP needed for next level
     */
    getXPForNextLevel(currentLevel: number): number {
        return (currentLevel + 1) ** 2 * 10;
    }

    /**
     * Get XP progress to next level (0-1)
     */
    getXPProgress(xp: number, level: number): number {
        const currentLevelXP = level ** 2 * 10;
        const nextLevelXP = this.getXPForNextLevel(level);
        const xpInCurrentLevel = xp - currentLevelXP;
        const xpNeededForLevel = nextLevelXP - currentLevelXP;
        return Math.min(1, Math.max(0, xpInCurrentLevel / xpNeededForLevel));
    }

    /**
     * Check if two dates are the same day
     */
    private isSameDay(date1: Date, date2: Date): boolean {
        return (
            date1.getFullYear() === date2.getFullYear() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getDate() === date2.getDate()
        );
    }

    /**
     * Check if date2 is the day after date1
     */
    private isConsecutiveDay(date1: Date, date2: Date): boolean {
        const nextDay = new Date(date1);
        nextDay.setDate(nextDay.getDate() + 1);
        return this.isSameDay(nextDay, date2);
    }

    /**
     * Map database row to UserProfile domain model
     */
    private mapToUserProfile(row: any): UserProfile {
        return {
            id: row.id,
            email: row.email,
            fullName: row.full_name,
            avatarUrl: row.avatar_url,
            notificationsEnabled: row.notifications_enabled,
            notificationTime: row.notification_time,
            xp: row.xp || 0,
            level: row.level || 1,
            lastLogin: row.last_login,
            streakCount: row.streak_count || 0,
            maxStreak: row.max_streak || 0,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
        };
    }

    /**
     * Get IDs of all quotes seen by the user
     */
    async getSeenQuoteIds(userId: string): Promise<string[]> {
        const { data, error } = await supabase
            .from('user_seen_quotes')
            .select('quote_id')
            .eq('user_id', userId);

        if (error) {
            console.error('Error fetching seen quote IDs:', error);
            return [];
        }

        return data.map(row => row.quote_id);
    }
}

// Export singleton instance
export const userRepository = new SupabaseUserRepository();
