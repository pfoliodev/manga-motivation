import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, Image, StyleSheet, Text, View } from 'react-native';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
    onComplete: () => void;
}

const MANGA_QUOTES = [
    "Plus Ultra !",
    "Crois en moi qui crois en toi !",
    "C'est mon nindo !",
    "Le seul qui puisse me battre, c'est moi.",
    "Je serai le Roi des Pirates !"
];

export default function SplashScreen({ onComplete }: SplashScreenProps) {
    // Animation values
    const logoScale = useRef(new Animated.Value(0)).current;
    const logoRotate = useRef(new Animated.Value(0)).current;
    const logoOpacity = useRef(new Animated.Value(0)).current;
    const appNameOpacity = useRef(new Animated.Value(0)).current;
    const appNameScale = useRef(new Animated.Value(0.5)).current;
    const glowPulse = useRef(new Animated.Value(0)).current;
    const quoteOpacity = useRef(new Animated.Value(0)).current;
    const quoteTranslateY = useRef(new Animated.Value(30)).current;
    const progressWidth = useRef(new Animated.Value(0)).current;
    const speedLinesOpacity = useRef(new Animated.Value(0)).current;

    const randomQuote = useRef(
        MANGA_QUOTES[Math.floor(Math.random() * MANGA_QUOTES.length)]
    ).current;

    useEffect(() => {
        // Sequence d'animations
        Animated.sequence([
            // 1. Speed lines apparaissent (0-0.3s)
            Animated.timing(speedLinesOpacity, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),

            // 2. Logo zoom + rotation (0.3-1.2s)
            Animated.parallel([
                Animated.spring(logoScale, {
                    toValue: 1,
                    tension: 50,
                    friction: 7,
                    useNativeDriver: true,
                }),
                Animated.timing(logoOpacity, {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: true,
                }),
                Animated.timing(logoRotate, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(appNameOpacity, {
                    toValue: 1,
                    duration: 600,
                    delay: 400,
                    useNativeDriver: true,
                }),
                Animated.spring(appNameScale, {
                    toValue: 1,
                    tension: 40,
                    friction: 7,
                    delay: 400,
                    useNativeDriver: true,
                }),
            ]),
        ]).start();

        // Glow pulsant continu
        Animated.loop(
            Animated.sequence([
                Animated.timing(glowPulse, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(glowPulse, {
                    toValue: 0,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        ).start();

        // Citation apparaît (1.5s)
        setTimeout(() => {
            Animated.parallel([
                Animated.timing(quoteOpacity, {
                    toValue: 1,
                    duration: 600,
                    useNativeDriver: true,
                }),
                Animated.spring(quoteTranslateY, {
                    toValue: 0,
                    tension: 50,
                    friction: 8,
                    useNativeDriver: true,
                }),
            ]).start();
        }, 1500);

        // Barre de progression (0-3.5s)
        Animated.timing(progressWidth, {
            toValue: 1,
            duration: 5500,
            useNativeDriver: false,
        }).start();

        // Terminer après 3.5s
        const timer = setTimeout(() => {
            onComplete();
        }, 5500);

        return () => clearTimeout(timer);
    }, []);

    const rotation = logoRotate.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    const glowScale = glowPulse.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 1.3],
    });

    const glowOpacity = glowPulse.interpolate({
        inputRange: [0, 1],
        outputRange: [0.3, 0.8],
    });

    const progressWidthInterpolated = progressWidth.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
    });

    return (
        <View style={styles.container}>
            {/* Background gradient */}
            <LinearGradient
                colors={['#0a0a0a', '#1a1a1a', '#0a0a0a']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
            />

            {/* Speed lines background */}
            <Animated.View
                style={[
                    styles.speedLinesContainer,
                    { opacity: speedLinesOpacity },
                ]}
            >
                {[...Array(20)].map((_, i) => (
                    <View
                        key={i}
                        style={[
                            styles.speedLine,
                            {
                                top: `${(i * 5) % 100}%`,
                                left: `${(i * 7) % 100}%`,
                                width: Math.random() * 100 + 50,
                                opacity: Math.random() * 0.1 + 0.05,
                                transform: [{ rotate: `${Math.random() * 30 - 15}deg` }],
                            },
                        ]}
                    />
                ))}
            </Animated.View>

            {/* Glow effect */}
            <Animated.View
                style={[
                    styles.glowContainer,
                    {
                        opacity: glowOpacity,
                        transform: [{ scale: glowScale }],
                    },
                ]}
            >
                <LinearGradient
                    colors={['rgba(0, 122, 255, 0.4)', 'rgba(255, 69, 0, 0.4)', 'transparent']}
                    style={styles.glow}
                />
            </Animated.View>

            {/* Logo */}
            <Animated.View
                style={[
                    styles.logoContainer,
                    {
                        opacity: logoOpacity,
                        transform: [
                            { scale: logoScale },
                            { rotate: rotation },
                        ],
                    },
                ]}
            >
                <Image
                    source={require('@/assets/images/aura_icon.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
            </Animated.View>

            {/* Application Name */}
            <Animated.View
                style={[
                    styles.appNameContainer,
                    {
                        opacity: appNameOpacity,
                        transform: [{ scale: appNameScale }],
                    },
                ]}
            >
                <Text style={styles.appName}>AURA</Text>
                <Text style={styles.appSubtitle}>MANGAS & MOTIVATION</Text>
            </Animated.View>

            {/* Quote */}
            <Animated.View
                style={[
                    styles.quoteContainer,
                    {
                        opacity: quoteOpacity,
                        transform: [{ translateY: quoteTranslateY }],
                    },
                ]}
            >
                <Text style={styles.quote}>{randomQuote}</Text>
                <View style={styles.quoteLine} />
            </Animated.View>

            {/* Progress bar */}
            <View style={styles.progressContainer}>
                <View style={styles.progressTrack}>
                    <Animated.View
                        style={[
                            styles.progressBar,
                            { width: progressWidthInterpolated },
                        ]}
                    >
                        <LinearGradient
                            colors={['#007AFF', '#FF4500']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={StyleSheet.absoluteFill}
                        />
                    </Animated.View>
                </View>
            </View>

            {/* Particles effect */}
            <View style={styles.particlesContainer}>
                {[...Array(15)].map((_, i) => (
                    <Animated.View
                        key={i}
                        style={[
                            styles.particle,
                            {
                                top: `${(i * 13) % 100}%`,
                                left: `${(i * 17) % 100}%`,
                                opacity: logoOpacity,
                            },
                        ]}
                    />
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0a0a0a',
        alignItems: 'center',
        justifyContent: 'center',
    },
    speedLinesContainer: {
        ...StyleSheet.absoluteFillObject,
        overflow: 'hidden',
    },
    speedLine: {
        position: 'absolute',
        height: 2,
        backgroundColor: '#FFF',
    },
    glowContainer: {
        position: 'absolute',
        width: 400,
        height: 400,
        alignItems: 'center',
        justifyContent: 'center',
    },
    glow: {
        width: '100%',
        height: '100%',
        borderRadius: 200,
    },
    logoContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        width: 200,
        height: 200,
    },
    quoteContainer: {
        position: 'absolute',
        top: height * 0.65,
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    quote: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: '900',
        textAlign: 'center',
        fontStyle: 'italic',
        letterSpacing: 2,
        textTransform: 'uppercase',
        textShadowColor: 'rgba(0, 122, 255, 0.8)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 10,
    },
    quoteLine: {
        width: 60,
        height: 3,
        backgroundColor: '#FF4500',
        marginTop: 12,
    },
    progressContainer: {
        position: 'absolute',
        bottom: 60,
        width: width * 0.7,
        alignItems: 'center',
    },
    progressTrack: {
        width: '100%',
        height: 3,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 2,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        borderRadius: 2,
    },
    particlesContainer: {
        ...StyleSheet.absoluteFillObject,
        pointerEvents: 'none',
    },
    particle: {
        position: 'absolute',
        width: 4,
        height: 4,
        backgroundColor: '#007AFF',
        borderRadius: 2,
        shadowColor: '#007AFF',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 4,
    },
    appNameContainer: {
        position: 'absolute',
        top: 120,
        alignItems: 'center',
        width: '100%',
    },
    appName: {
        color: '#FFF',
        fontSize: 48,
        fontWeight: '900',
        fontStyle: 'italic',
        letterSpacing: 12,
        textShadowColor: 'rgba(255, 69, 0, 0.8)',
        textShadowOffset: { width: 4, height: 4 },
        textShadowRadius: 4,
    },
    appSubtitle: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 4,
        marginTop: 4,
        opacity: 0.8,
        textAlign: 'center',
    },
});
