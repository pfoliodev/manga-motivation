import { ActionType } from '../types/quest';

/**
 * Vérifie l'évolution de la quête et retourne le nouvel état.
 */
export function checkQuestProgress(
    actionType: ActionType,
    currentProgress: number,
    target: number,
    increment: number = 1,
    isAbsolute: boolean = false
): { newProgress: number; isCompleted: boolean } {
    const newProgress = isAbsolute ? Math.min(increment, target) : Math.min(currentProgress + increment, target);
    const isCompleted = newProgress >= target;

    return {
        newProgress,
        isCompleted
    };
}
