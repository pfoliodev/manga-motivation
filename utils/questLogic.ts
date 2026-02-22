import { ActionType } from '../types/quest';

/**
 * Vérifie l'évolution de la quête et retourne le nouvel état.
 */
export function checkQuestProgress(
    actionType: ActionType,
    currentProgress: number,
    target: number,
    increment: number = 1
): { newProgress: number; isCompleted: boolean } {
    const newProgress = Math.min(currentProgress + increment, target);
    const isCompleted = newProgress >= target;

    return {
        newProgress,
        isCompleted
    };
}
