import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { QuestProgress } from '../types/quest';

interface QuestCardProps {
    progress: QuestProgress;
    onClaim?: () => void;
}

export const QuestCard = ({ progress, onClaim }: QuestCardProps) => {
    const { quest, currentProgress, claimedAt } = progress;
    const isCompleted = currentProgress >= quest.target_value;
    const progressPercent = Math.min((currentProgress / quest.target_value) * 100, 100);

    return (
        <View className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 mb-4 shadow-black/50 shadow-lg">
            <View className="flex-row justify-between items-start mb-3">
                <View className="flex-1 pr-4">
                    <Text className="text-white text-lg font-bold tracking-wider uppercase">
                        {quest.title}
                    </Text>
                    <Text className="text-zinc-400 text-sm mt-1 leading-5">
                        {quest.description}
                    </Text>
                </View>
                <View className="items-end">
                    <Text className="text-orange-500 font-black text-lg">+{quest.xp_reward} XP</Text>
                    <Text className="text-blue-400 font-bold text-sm">+{quest.aura_reward} Aura</Text>
                </View>
            </View>

            {/* Progress Bar Shōnen Style */}
            <View className="h-2 w-full bg-zinc-800 rounded-full mt-2 overflow-hidden">
                <View
                    className={`h-full rounded-full ${isCompleted ? 'bg-orange-500' : 'bg-blue-500'}`}
                    style={{ width: `${progressPercent}%` }}
                />
            </View>

            <View className="flex-row justify-between items-center mt-3">
                <Text className="text-zinc-500 font-bold text-xs uppercase tracking-widest">
                    {currentProgress} / {quest.target_value}
                </Text>

                {isCompleted && !claimedAt && (
                    <TouchableOpacity
                        onPress={onClaim}
                        className="bg-orange-500 px-4 py-2 rounded-lg flex-row items-center"
                    >
                        <Ionicons name="flash-outline" size={16} color="white" />
                        <Text className="text-white font-bold ml-1 uppercase text-xs">
                            Réclamer
                        </Text>
                    </TouchableOpacity>
                )}

                {claimedAt && (
                    <Text className="text-zinc-600 font-bold text-xs uppercase">
                        Terminé ✓
                    </Text>
                )}
            </View>
        </View>
    );
};
