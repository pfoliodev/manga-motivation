import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ShieldCheck, User } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    Text,
    TextInput,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import Animated, {
    FadeIn,
    FadeInDown,
    useAnimatedStyle,
    useSharedValue,
    withSpring
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function UsernameScreen() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const buttonScale = useSharedValue(1);

    const handleConfirm = async () => {
        if (username.trim().length < 2) {
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            return;
        }

        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        await AsyncStorage.setItem('onboarding_username', username.trim());
        await AsyncStorage.setItem('onboarding_complete', 'true');

        // Final move to Login
        router.replace('/login');
    };

    const animatedButtonStyle = useAnimatedStyle(() => ({
        transform: [{ scale: buttonScale.value }]
    }));

    const handlePressIn = () => {
        buttonScale.value = withSpring(0.95);
    };

    const handlePressOut = () => {
        buttonScale.value = withSpring(1);
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View className="flex-1 bg-[#050505]">
                <StatusBar style="light" />
                <SafeAreaView className="flex-1">
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        className="flex-1 px-8"
                    >
                        <View className="flex-1 justify-center">
                            {/* --- HEADER --- */}
                            <Animated.View
                                entering={FadeInDown.duration(600).delay(200)}
                                className="mb-12"
                            >
                                <Text className="text-[#FFD700] text-xs font-black uppercase tracking-[4px] mb-2">
                                    Identité du héros
                                </Text>
                                <Text className="text-white text-5xl font-black italic tracking-tighter leading-[50px]">
                                    COMMENT{"\n"}T'APPELLES-TU ?
                                </Text>
                                <Text className="text-white/50 text-base font-medium mt-4">
                                    Ton nom résonnera dans le Panthéon de l'Aura.
                                </Text>
                            </Animated.View>

                            {/* --- INPUT --- */}
                            <Animated.View
                                entering={FadeInDown.duration(600).delay(400)}
                                className="relative"
                            >
                                <View className="absolute left-0 top-0 bottom-0 w-1 bg-[#FFD700]" />
                                <TextInput
                                    className="bg-[#121212] py-6 px-6 text-white text-2xl font-black italic uppercase tracking-wider rounded-r-2xl"
                                    placeholder="TON PSEUDO..."
                                    placeholderTextColor="rgba(255,255,255,0.1)"
                                    value={username}
                                    onChangeText={setUsername}
                                    autoCapitalize="characters"
                                    autoCorrect={false}
                                    maxLength={15}
                                />
                                <View className="absolute right-4 top-1/2 -translate-y-4 opacity-20">
                                    <User size={32} color="white" />
                                </View>
                            </Animated.View>

                            <Animated.View
                                entering={FadeInDown.duration(600).delay(600)}
                                className="mt-4 flex-row items-center"
                            >
                                <ShieldCheck size={14} color="#FFD700" />
                                <Text className="text-white/30 text-[10px] font-bold uppercase tracking-widest ml-2">
                                    Sera affiché publiquement sur ton profil
                                </Text>
                            </Animated.View>
                        </View>

                        {/* --- FOOTER / BUTTON --- */}
                        <View className="pb-8">
                            <Animated.View
                                entering={FadeIn.duration(400).delay(800)}
                                style={animatedButtonStyle}
                            >
                                <Pressable
                                    onPress={handleConfirm}
                                    onPressIn={handlePressIn}
                                    onPressOut={handlePressOut}
                                    disabled={username.trim().length < 2}
                                    className={`w-full overflow-hidden rounded-2xl ${username.trim().length < 2 ? 'opacity-50' : 'opacity-100'}`}
                                >
                                    <LinearGradient
                                        colors={username.trim().length < 2 ? ['#222', '#111'] : ['#FFD700', '#FFA500']}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                        style={{ paddingVertical: 22, alignItems: 'center' }}
                                    >
                                        <Text className={`text-lg font-black uppercase tracking-[3px] italic ${username.trim().length < 2 ? 'text-white/20' : 'text-black'}`}>
                                            Sceller mon identité
                                        </Text>
                                    </LinearGradient>
                                </Pressable>
                            </Animated.View>
                        </View>
                    </KeyboardAvoidingView>
                </SafeAreaView>
            </View>
        </TouchableWithoutFeedback>
    );
}
