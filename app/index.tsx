import { useAuth } from '@/src/context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Redirect } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function Index() {
    const { session, loading: authLoading } = useAuth();
    const [onboardingComplete, setOnboardingComplete] = useState<boolean | null>(null);

    useEffect(() => {
        const checkOnboarding = async () => {
            const completed = await AsyncStorage.getItem('onboarding_complete');
            setOnboardingComplete(completed === 'true');
        };
        checkOnboarding();
    }, []);

    if (authLoading || onboardingComplete === null) {
        return (
            <View style={{ flex: 1, backgroundColor: '#050505', justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#FFD700" />
            </View>
        );
    }

    // If user is logged in, skip onboarding and go to main app
    if (session) {
        return <Redirect href="/(tabs)" />;
    }

    // If onboarding is complete but not logged in, go to login
    if (onboardingComplete) {
        return <Redirect href="/login" />;
    }

    // Otherwise, start onboarding
    return <Redirect href="/onboarding/first" />;
}
