import { Quest, QuestProgress } from '@/types/quest';
import { checkQuestProgress } from '@/utils/questLogic';
import { supabase } from '@/utils/supabase';
import { QuestRepository } from './QuestRepository';

/**
 * Supabase implementation of QuestRepository
 */
export class SupabaseQuestRepository implements QuestRepository {

    async getUserDailyQuests(userId: string): Promise<QuestProgress[]> {
        // Fetch user quests for today with joint daily_quests table
        const today = new Date().toISOString().split('T')[0];

        const { data, error } = await supabase
            .from('user_quests')
            .select(`
                id,
                user_id,
                quest_id,
                assigned_date,
                current_progress,
                is_completed,
                completed_at,
                claimed_at,
                daily_quests (
                    id, title, description, action_type, target_value, xp_reward, aura_reward, bonus_rewards
                )
            `)
            .eq('user_id', userId)
            .eq('assigned_date', today);

        if (error) {
            console.error('Error fetching daily quests:', error);
            return [];
        }

        if (!data || data.length === 0) {
            // Auto-assign quests if none found for today
            const assigned = await this.assignDailyQuests(userId);
            if (assigned) {
                // Re-fetch
                const { data: newData, error: retryError } = await supabase
                    .from('user_quests')
                    .select(`
                        id,
                        user_id,
                        quest_id,
                        assigned_date,
                        current_progress,
                        is_completed,
                        completed_at,
                        claimed_at,
                        daily_quests (
                            id, title, description, action_type, target_value, xp_reward, aura_reward, bonus_rewards
                        )
                    `)
                    .eq('user_id', userId)
                    .eq('assigned_date', today);

                if (!retryError && newData) {
                    return this.mapToQuestProgressList(newData);
                }
            }
        }

        return this.mapToQuestProgressList(data || []);
    }

    async claimQuestReward(questProgressId: string): Promise<boolean> {
        const { error } = await (supabase.from('user_quests') as any)
            .update({ claimed_at: new Date().toISOString() })
            .eq('id', questProgressId)
            // Ensure it's not already claimed
            .is('claimed_at', null);

        if (error) {
            console.error('Error claiming quest reward:', error);
            return false;
        }

        return true;
    }

    async incrementQuestProgress(userId: string, actionType: string, increment: number = 1, isAbsolute: boolean = false): Promise<void> {
        const today = new Date().toISOString().split('T')[0];

        // Find quest for this user & action that is not completed yet
        const { data: quests, error: fetchError } = await supabase
            .from('user_quests')
            .select(`
                id, current_progress, is_completed, 
                daily_quests!inner(action_type, target_value)
            `)
            .eq('user_id', userId)
            .eq('assigned_date', today)
            .eq('daily_quests.action_type', actionType)
            .eq('is_completed', false);

        if (fetchError || !quests || quests.length === 0) return;

        const questsList = quests as any[] || [];
        // For each matching active quest, increment progress
        for (const q of questsList) {
            const dq = q.daily_quests as any; // Cast for TS simplicity since inner join returns object
            const { newProgress, isCompleted } = checkQuestProgress(
                dq.action_type,
                q.current_progress,
                dq.target_value,
                increment,
                isAbsolute
            );

            const updates: any = {
                current_progress: newProgress,
                is_completed: isCompleted
            };

            if (isCompleted) {
                updates.completed_at = new Date().toISOString();
            }

            await (supabase.from('user_quests') as any)
                .update(updates)
                .eq('id', q.id);
        }
    }

    async assignDailyQuests(userId: string): Promise<boolean> {
        const today = new Date().toISOString().split('T')[0];

        // 1. Get random active quests
        const { data: randomQuests, error: fetchError } = await (supabase.from('daily_quests') as any)
            .select('id')
            .eq('is_active', true)
            .limit(10); // get a bunch

        if (fetchError || !randomQuests || randomQuests.length === 0) return false;

        // Shuffle and take 3
        const shuffled = randomQuests.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 3);

        const inserts = selected.map((q: any) => ({
            user_id: userId,
            quest_id: q.id,
            assigned_date: today,
            current_progress: 0,
            is_completed: false
        }));

        const { error: insertError } = await (supabase.from('user_quests') as any)
            .insert(inserts);

        if (insertError) {
            console.error('Failed to assign quests:', insertError);
            return false;
        }

        return true;
    }

    /**
     * Map database row to QuestProgress domain model
     */
    private mapToQuestProgress(row: any): QuestProgress {
        return {
            id: row.id,
            userId: row.user_id,
            questId: row.quest_id,
            assignedDate: row.assigned_date,
            currentProgress: row.current_progress,
            isCompleted: row.is_completed,
            completedAt: row.completed_at,
            claimedAt: row.claimed_at,
            quest: {
                id: row.daily_quests.id,
                title: row.daily_quests.title,
                description: row.daily_quests.description,
                action_type: row.daily_quests.action_type,
                target_value: row.daily_quests.target_value,
                xp_reward: row.daily_quests.xp_reward,
                aura_reward: row.daily_quests.aura_reward,
                bonus_rewards: row.daily_quests.bonus_rewards,
            } as Quest
        };
    }

    private mapToQuestProgressList(rows: any[]): QuestProgress[] {
        return rows.map(row => this.mapToQuestProgress(row));
    }
}

// Export singleton instance
export const questRepository = new SupabaseQuestRepository();
