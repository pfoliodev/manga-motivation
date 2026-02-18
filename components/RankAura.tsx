import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withRepeat,
    withSequence,
    withTiming,
} from 'react-native-reanimated';

interface ParticleProps {
    index: number;
    color: string;
    size: number;
}

const SteamParticle = ({ index }: { index: number }) => {
    const translateY = useSharedValue(0);
    const opacity = useSharedValue(0);
    const scale = useSharedValue(0.5);
    const translateX = useSharedValue(Math.random() * 60 - 30);

    useEffect(() => {
        const duration = 2000 + Math.random() * 1000;
        const delay = index * 200;

        translateY.value = withDelay(
            delay,
            withRepeat(
                withTiming(-60 - Math.random() * 40, {
                    duration,
                    easing: Easing.out(Easing.quad),
                }),
                -1,
                false
            )
        );

        opacity.value = withDelay(
            delay,
            withRepeat(
                withSequence(
                    withTiming(0.6, { duration: duration * 0.3 }),
                    withTiming(0, { duration: duration * 0.7 })
                ),
                -1,
                false
            )
        );

        scale.value = withDelay(
            delay,
            withRepeat(
                withTiming(2 + Math.random(), { duration }),
                -1,
                false
            )
        );

        translateX.value = withDelay(
            delay,
            withRepeat(
                withTiming(translateX.value + (Math.random() * 40 - 20), { duration }),
                -1,
                false
            )
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateY: translateY.value },
            { translateX: translateX.value },
            { scale: scale.value },
        ],
        opacity: opacity.value,
    }));

    return (
        <Animated.View
            style={[
                styles.particle,
                { backgroundColor: '#FFFFFF', borderRadius: 20, width: 15, height: 15 },
                animatedStyle,
            ]}
        />
    );
};

const EmberParticle = ({ index }: { index: number }) => {
    const translateY = useSharedValue(0);
    const opacity = useSharedValue(0);
    const translateX = useSharedValue(Math.random() * 80 - 40);

    useEffect(() => {
        const duration = 1500 + Math.random() * 800;
        const delay = index * 300;

        translateY.value = withDelay(
            delay,
            withRepeat(
                withTiming(-30 - Math.random() * 20, { duration }),
                -1,
                false
            )
        );

        opacity.value = withDelay(
            delay,
            withRepeat(
                withSequence(
                    withTiming(1, { duration: duration * 0.2 }),
                    withTiming(0, { duration: duration * 0.8 })
                ),
                -1,
                false
            )
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateY: translateY.value },
            { translateX: translateX.value },
        ],
        opacity: opacity.value,
    }));

    return (
        <Animated.View
            style={[
                styles.particle,
                { backgroundColor: '#FF8C00', width: 2, height: 2, borderRadius: 1 },
                animatedStyle,
            ]}
        />
    );
};

export const RankAura = ({ rankName }: { rankName: string }) => {
    if (rankName !== 'FER') return null;

    const steamParticles = useMemo(() => Array.from({ length: 8 }).map((_, i) => i), []);
    const emberParticles = useMemo(() => Array.from({ length: 12 }).map((_, i) => i), []);

    return (
        <View style={styles.container}>
            {/* Background Steam */}
            <View style={styles.particleLayer}>
                {steamParticles.map((i) => (
                    <SteamParticle key={`steam-${i}`} index={i} />
                ))}
            </View>

            {/* The Badge Base */}
            <View style={styles.badgeContainer}>
                <LinearGradient
                    colors={['#4A4A4A', '#2A2A2A', '#1A1A1A']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.badgeBase}
                >
                    <View style={styles.innerBadge}>
                        {/* Highlights */}
                        <LinearGradient
                            colors={['rgba(255,255,255,0.2)', 'transparent']}
                            style={StyleSheet.absoluteFill}
                        />
                    </View>
                </LinearGradient>
            </View>

            {/* Embers */}
            <View style={styles.particleLayer}>
                {emberParticles.map((i) => (
                    <EmberParticle key={`ember-${i}`} index={i} />
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 130,
        height: 70,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    particleLayer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 0,
    },
    particle: {
        position: 'absolute',
    },
    badgeContainer: {
        width: 90,
        height: 36,
        padding: 2,
        borderRadius: 18,
        backgroundColor: '#708090', // Iron border color
        elevation: 10,
        shadowColor: 'white',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        zIndex: 5,
    },
    badgeBase: {
        flex: 1,
        borderRadius: 16,
        overflow: 'hidden',
    },
    innerBadge: {
        flex: 1,
        borderRadius: 16,
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
