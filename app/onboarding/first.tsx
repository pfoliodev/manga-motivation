import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
    Easing,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withRepeat,
    withSequence,
    withTiming
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

/**
 * PureAuraVisual : Un visuel géométrique et abstrait qui représente l'énergie
 */
const PureAuraVisual = () => {
    const pulse = useSharedValue(0);

    useEffect(() => {
        pulse.value = withRepeat(
            withTiming(1, { duration: 2500, easing: Easing.inOut(Easing.quad) }),
            -1,
            true
        );
    }, []);

    const ring1Style = useAnimatedStyle(() => ({
        transform: [{ scale: interpolate(pulse.value, [0, 1], [0.8, 1.2]) }],
        opacity: interpolate(pulse.value, [0, 1], [0.3, 0.1]),
    }));

    const ring2Style = useAnimatedStyle(() => ({
        transform: [{ scale: interpolate(pulse.value, [0, 1], [1, 1.5]) }],
        opacity: interpolate(pulse.value, [0, 1], [0.2, 0]),
    }));

    const coreStyle = useAnimatedStyle(() => ({
        transform: [{ scale: interpolate(pulse.value, [0, 1], [1, 1.05]) }],
    }));

    return (
        <View className="items-center justify-center w-full h-[40%]">
            {/* Anneaux d'énergie sortants */}
            <Animated.View
                style={[ring1Style, { width: 220, height: 220, borderRadius: 110, borderWidth: 1, borderColor: '#FF4D00', position: 'absolute' }]}
            />
            <Animated.View
                style={[ring2Style, { width: 220, height: 220, borderRadius: 110, borderWidth: 1, borderColor: '#FFD700', position: 'absolute' }]}
            />

            {/* Noyau Central */}
            <Animated.View style={coreStyle}>
                <LinearGradient
                    colors={['#FF4D00', '#FFD700']}
                    style={{ width: 120, height: 120, borderRadius: 60, elevation: 10, shadowColor: '#FF4D00', shadowRadius: 20, shadowOpacity: 0.3 }}
                />
            </Animated.View>

            {/* Particules légères */}
            <View className="absolute">
                {[...Array(4)].map((_, i) => (
                    <SmallSpark key={i} delay={i * 800} />
                ))}
            </View>
        </View>
    );
};

const SmallSpark = ({ delay }: { delay: number }) => {
    const y = useSharedValue(0);
    const opacity = useSharedValue(0);

    useEffect(() => {
        y.value = withDelay(delay, withRepeat(withTiming(-100, { duration: 2000 }), -1, false));
        opacity.value = withDelay(delay, withRepeat(withSequence(withTiming(0.5, { duration: 500 }), withTiming(0, { duration: 1500 })), -1, false));
    }, []);

    const style = useAnimatedStyle(() => ({
        transform: [{ translateY: y.value }, { translateX: Math.sin(y.value / 10) * 8 }],
        opacity: opacity.value,
        position: 'absolute',
    }));

    return <Animated.View style={[style, { width: 4, height: 4, backgroundColor: '#FF4D00', borderRadius: 2 }]} />;
};

export default function OnboardingFirst() {
    const router = useRouter();
    const fade = useSharedValue(0);

    useEffect(() => {
        fade.value = withTiming(1, { duration: 800 });
    }, []);

    const animatedContent = useAnimatedStyle(() => ({
        opacity: fade.value,
    }));

    return (
        <View className="flex-1 bg-white">
            <StatusBar style="dark" />

            <SafeAreaView className="flex-1">
                {/* --- HEADER --- */}
                <Animated.View style={animatedContent} className="items-center mt-12">
                    <Text className="text-black text-6xl font-black italic tracking-tighter">
                        AURA
                    </Text>
                    <Text className="text-black/30 text-[10px] font-bold tracking-[8px] uppercase mt-1 text-center">
                        Mangas & motivations
                    </Text>
                </Animated.View>

                {/* --- CENTRE : L'AURA ABSTRAITE --- */}
                <PureAuraVisual />

                {/* --- FOOTER CONTENT --- */}
                <Animated.View style={animatedContent} className="px-10 pb-8 items-center">

                    {/* Citation */}
                    <View className="mb-14 items-center">
                        <Text className="text-black/60 text-center text-lg italic font-medium leading-6 px-4">
                            "Chaque légende commence par une citation."
                        </Text>
                        <View className="w-10 h-[3px] bg-black mt-4" />
                    </View>

                    {/* Titre d'appel */}
                    <View className="mb-10 items-center">
                        <Text className="text-[#FF4D00] text-xs font-black uppercase tracking-[4px] mb-1">
                            Prêt à éveiller
                        </Text>
                        <Text className="text-black text-4xl font-black uppercase italic tracking-tight">
                            Ton Aura ?
                        </Text>
                    </View>

                    {/* BOUTON NOIR PREMIUM */}
                    <Pressable
                        onPress={() => {
                            console.log('Navigating to selection...');
                            router.push('/selection');
                        }}
                        className="w-full active:scale-[0.97]"
                    >
                        <View className="bg-black py-5 rounded-2xl items-center justify-center shadow-xl shadow-black/20">
                            <Text className="text-white text-lg font-black uppercase tracking-[3px] italic">
                                Commencer ma quête
                            </Text>
                        </View>
                    </Pressable>

                    {/* Barre de progression */}
                    <View className="w-32 h-[2px] bg-black/5 mt-12 rounded-full overflow-hidden">
                        <View className="w-1/3 h-full bg-black" />
                    </View>
                </Animated.View>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({});
