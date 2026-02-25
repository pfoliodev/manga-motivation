import { useDailyQuests } from '@/context/DailyQuestsContext';
import * as Haptics from 'expo-haptics';
import { Clock, Sparkles, Target, Trophy, X } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Modal, Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { QuestCard } from './QuestCard';

interface DailyQuestsModalProps {
    visible: boolean;
    onClose: () => void;
}

/**
 * Modal displaying daily quests and countdown to reset
 * High-contrast "Dark Manga" design with premium animations
 */
export const DailyQuestsModal = ({ visible, onClose }: DailyQuestsModalProps) => {
    const { quests, loading, claimReward, refresh } = useDailyQuests();
    const [timeLeft, setTimeLeft] = useState('--:--:--');

    // Mettre à jour les quêtes quand la pop-up s'ouvre
    useEffect(() => {
        if (visible) {
            refresh();
        }
    }, [visible, refresh]);

    useEffect(() => {
        if (!visible) return;

        const updateTimer = () => {
            const now = new Date();
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(0, 0, 0, 0);

            const diff = tomorrow.getTime() - now.getTime();
            if (diff <= 0) {
                setTimeLeft('00:00:00');
                return;
            }

            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            setTimeLeft(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, [visible]);

    const handleClaim = async (id: string) => {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        await claimReward(id);
    };

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View className="flex-1 justify-end">
                {/* Backdrop */}
                <Pressable
                    className="absolute inset-0 bg-black/80"
                    onPress={onClose}
                />

                {/* Modal Content */}
                <Animated.View
                    entering={FadeInDown.springify().damping(15)}
                    className="h-[85%] bg-[#0F0F0F] rounded-t-[40px] border-t border-white/10"
                >
                    <View className="flex-1 p-6">
                        {/* Drag Handle Shōnen Style */}
                        <View className="items-center mb-6">
                            <View className="w-12 h-1 bg-white/10 rounded-full" />
                        </View>

                        {/* Header */}
                        <View className="flex-row justify-between items-start mb-8">
                            <View>
                                <View className="flex-row items-center">
                                    <View className="bg-orange-600/20 p-2 rounded-xl mr-3">
                                        <Target size={24} color="#f97316" />
                                    </View>
                                    <View>
                                        <Text className="text-white text-2xl font-black uppercase tracking-tighter">
                                            Quêtes
                                        </Text>
                                        <Text className="text-white/40 text-[10px] font-bold uppercase tracking-[2px]">
                                            Journalières
                                        </Text>
                                    </View>
                                </View>

                                <View className="flex-row items-center mt-4 bg-white/5 self-start px-3 py-1.5 rounded-full border border-white/5">
                                    <Clock size={12} color="#f97316" />
                                    <Text className="text-white text-[10px] font-bold uppercase tracking-widest ml-2">
                                        Reset : <Text className="text-orange-500">{timeLeft}</Text>
                                    </Text>
                                </View>
                            </View>

                            <TouchableOpacity
                                onPress={onClose}
                                hitSlop={20}
                                className="bg-white/5 p-3 rounded-2xl border border-white/5 active:scale-95"
                            >
                                <View pointerEvents="none">
                                    <X size={20} color="#fff" />
                                </View>
                            </TouchableOpacity>
                        </View>

                        {/* Quests List */}
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            className="flex-1"
                        >
                            {quests.length === 0 && !loading ? (
                                <View className="items-center justify-center py-24">
                                    <View className="bg-white/5 p-8 rounded-full mb-6">
                                        <Trophy size={48} color="#333" />
                                    </View>
                                    <Text className="text-white/40 text-center font-bold uppercase tracking-[3px] text-xs">
                                        Aucune quête pour le moment
                                    </Text>
                                </View>
                            ) : (
                                quests.map((q, index) => (
                                    <Animated.View
                                        key={q.id}
                                        entering={FadeInDown.delay(index * 100).springify()}
                                    >
                                        <QuestCard
                                            progress={q}
                                            onClaim={() => handleClaim(q.id)}
                                        />
                                    </Animated.View>
                                ))
                            )}

                            {/* Motivational Footer */}
                            <View className="mt-8 mb-12 items-center">
                                <View className="h-[1px] w-full bg-white/5 mb-8" />
                                <Sparkles size={20} color="#FFD700" className="opacity-40 mb-3" />
                                <Text className="text-white/30 text-center italic text-xs px-10 leading-5">
                                    "Si tu ne trouves pas de raison de te battre, alors tu n'as aucune raison de vivre."
                                </Text>
                            </View>
                        </ScrollView>
                    </View>
                </Animated.View>
            </View>
        </Modal>
    );
};
