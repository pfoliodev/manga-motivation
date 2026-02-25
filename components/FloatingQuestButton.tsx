import * as Haptics from 'expo-haptics';
import { Target } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withSpring,
    withTiming
} from 'react-native-reanimated';
import { DailyQuestsModal } from './DailyQuestsModal';

/**
 * Floating action button for daily quests
 * Restored visual style with optimized hit area
 */
export const FloatingQuestButton = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const scale = useSharedValue(1);
    const pulse = useSharedValue(1);

    useEffect(() => {
        pulse.value = withRepeat(
            withSequence(
                withTiming(1.1, { duration: 1500, easing: Easing.bezier(0.4, 0, 0.2, 1) }),
                withTiming(1, { duration: 1500, easing: Easing.bezier(0.4, 0, 0.2, 1) })
            ),
            -1,
            true
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { scale: scale.value * pulse.value }
        ]
    }));

    const handlePress = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setModalVisible(true);
    };

    return (
        <>
            <View
                style={{
                    position: 'absolute',
                    bottom: 110,
                    right: 24,
                    zIndex: 9999,
                }}
            >
                <Pressable
                    onPress={handlePress}
                    onPressIn={() => { scale.value = withSpring(0.9); }}
                    onPressOut={() => { scale.value = withSpring(1); }}
                    hitSlop={25}
                    style={({ pressed }) => ({
                        opacity: pressed ? 0.9 : 1,
                    })}
                >
                    <Animated.View
                        style={[animatedStyle]}
                        pointerEvents="none"
                        className="bg-orange-600 p-4 rounded-3xl shadow-2xl shadow-orange-900/50 border border-orange-400/30 items-center justify-center"
                    >
                        <Target size={28} color="#fff" strokeWidth={2.5} />
                    </Animated.View>
                </Pressable>
            </View>

            <DailyQuestsModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
            />
        </>
    );
};
