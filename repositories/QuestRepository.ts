import { QuestProgress } from '@/types/quest';

/**
 * Repository interface for Quest operations
 */
export interface QuestRepository {
    /**
     * Get all daily quests for the current user
     */
    getUserDailyQuests(userId: string): Promise<QuestProgress[]>;

    /**
     * Claim a completed quest reward
     */
    claimQuestReward(questProgressId: string): Promise<boolean>;

    /**
     * Update progress of a specific quest type (for internal triggers, e.g. "READ_QUOTES")
     */
    incrementQuestProgress(userId: string, actionType: string, increment?: number, isAbsolute?: boolean): Promise<void>;

    /**
     * Assigns random active daily quests to the user for today
     */
    assignDailyQuests(userId: string): Promise<boolean>;
}
