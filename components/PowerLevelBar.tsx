import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withSequence,
    withSpring,
    withTiming,
} from 'react-native-reanimated';

interface PowerLevelBarProps {
    level: number;
    xp: number;
    className?: string;
    animated?: boolean;
}

/**
 * PowerLevelBar Component
 * Displays user's current level and XP progress with manga-inspired styling
 * 
 * Features:
 * - Animated progress bar with pulsing effect when XP is gained
 * - Electric gradient (yellow/blue aura)
 * - Level badge with glow effect
 */
export const PowerLevelBar: React.FC<PowerLevelBarProps> = ({
    level,
    xp,
    className = '',
    animated = true,
}) => {
    // Calculate XP for current and next level
    const currentLevelXP = level ** 2 * 10;
    const nextLevelXP = (level + 1) ** 2 * 10;
    const xpInCurrentLevel = xp - currentLevelXP;
    const xpNeededForLevel = nextLevelXP - currentLevelXP;
    const progress = Math.min(1, Math.max(0, xpInCurrentLevel / xpNeededForLevel));

    // Animated values
    const progressValue = useSharedValue(0);
    const pulseScale = useSharedValue(1);

    // Animate progress bar on mount and when XP changes
    useEffect(() => {
        if (animated) {
            // Smooth progress animation
            progressValue.value = withSpring(progress, {
                damping: 15,
                stiffness: 100,
            });

            // Pulse effect when XP changes
            pulseScale.value = withSequence(
                withTiming(1.05, { duration: 200, easing: Easing.out(Easing.ease) }),
                withTiming(1, { duration: 200, easing: Easing.in(Easing.ease) })
            );
        } else {
            progressValue.value = progress;
        }
    }, [xp, progress, animated]);

    // Animated styles
    const progressBarStyle = useAnimatedStyle(() => ({
        width: `${progressValue.value * 100}%`,
    }));

    const pulseStyle = useAnimatedStyle(() => ({
        transform: [{ scale: pulseScale.value }],
    }));

    return (
        <View className={`${className}`}>
            {/* Level Badge */}
            <View className="flex-row items-center justify-between mb-4">
                <Animated.View
                    style={[
                        pulseStyle,
                        {
                            backgroundColor: '#FBBF24',
                            paddingHorizontal: 20,
                            paddingVertical: 10,
                            borderRadius: 999,
                            shadowColor: '#FBBF24',
                            shadowOffset: { width: 0, height: 0 },
                            shadowOpacity: 0.6,
                            shadowRadius: 12,
                            elevation: 8,
                        }
                    ]}
                >
                    <Text style={{
                        color: '#000',
                        fontSize: 28,
                        fontFamily: 'Bangers_400Regular',
                        letterSpacing: 1.5,
                    }}>
                        LVL {level}
                    </Text>
                </Animated.View>

                <Text className="text-gray-400 text-base font-semibold">
                    {xpInCurrentLevel} / {xpNeededForLevel} XP
                </Text>
            </View>

            {/* Progress Bar Container - Plus épais et visible */}
            <View style={{
                height: 16,
                backgroundColor: '#1F1F1F',
                borderRadius: 999,
                overflow: 'hidden',
                borderWidth: 1,
                borderColor: '#333',
                position: 'relative',
            }}>
                {/* Animated Progress Fill */}
                <Animated.View
                    style={[
                        progressBarStyle,
                        {
                            position: 'absolute',
                            height: '100%',
                        }
                    ]}
                >
                    <LinearGradient
                        colors={['#FBBF24', '#F59E0B', '#3B82F6']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={{ height: '100%', width: '100%' }}
                    />
                </Animated.View>

                {/* Glow effect overlay */}
                <Animated.View
                    style={[
                        progressBarStyle,
                        {
                            position: 'absolute',
                            height: '100%',
                            opacity: 0.4,
                        }
                    ]}
                >
                    <LinearGradient
                        colors={['#FBBF24', '#F59E0B', '#3B82F6']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={{
                            height: '100%',
                            width: '100%',
                        }}
                    />
                </Animated.View>
            </View>

            {/* Next Level Indicator */}
            <Text className="text-gray-500 text-sm mt-3 text-right font-medium">
                {xpNeededForLevel - xpInCurrentLevel} XP to Level {level + 1}
            </Text>
        </View>
    );
};
