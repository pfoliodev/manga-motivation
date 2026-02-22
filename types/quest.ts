export type ActionType = 'READ_QUOTES' | 'SHARE_QUOTE' | 'ADD_FAVORITE' | 'STREAK_DAYS';

export interface BonusRewards {
    badge?: string;
    multiplier?: number;
    [key: string]: any;
}

export interface Quest {
    id: string;
    title: string;
    description: string;
    action_type: ActionType;
    target_value: number;
    xp_reward: number;
    aura_reward: number;
    bonus_rewards?: BonusRewards;
}

export interface QuestProgress {
    id: string;
    userId: string;
    questId: string;
    assignedDate: string;
    currentProgress: number;
    isCompleted: boolean;
    completedAt?: string | null;
    claimedAt?: string | null;
    quest: Quest;
}
