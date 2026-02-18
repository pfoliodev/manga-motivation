import { userRepository } from '@/repositories/SupabaseUserRepository';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Session, User } from '@supabase/supabase-js';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../../utils/supabase';
import { authService } from '../services/authService';

interface AuthContextType {
    session: Session | null;
    user: User | null;
    loading: boolean;
    isGuest: boolean;
    signInWithApple: () => Promise<void>;
    signInWithGoogle: () => Promise<void>;
    signInAnonymously: () => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    session: null,
    user: null,
    loading: true,
    isGuest: true,
    signInWithApple: async () => { },
    signInWithGoogle: async () => { },
    signInAnonymously: async () => { },
    signOut: async () => { },
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check active sessions and sets the user
        const checkSession = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                setSession(session);
                setUser(session?.user ?? null);

                // Sync onboarding data if user just logged in and we have a session
                if (session?.user) {
                    syncOnboardingData(session.user.id);
                }
            } catch (error) {
                console.error('Error checking session:', error);
            } finally {
                setLoading(false);
            }
        };

        checkSession();

        // Listen for changes on auth state (logged in, signed out, etc.)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);

            if (session?.user) {
                syncOnboardingData(session.user.id);
            }
        });

        return () => {
            subscription?.unsubscribe();
        };
    }, []);

    const syncOnboardingData = async (userId: string) => {
        try {
            const storedName = await AsyncStorage.getItem('onboarding_username');
            const storedCategories = await AsyncStorage.getItem('preferred_categories');

            const updates: any = {};
            if (storedName) updates.fullName = storedName;
            if (storedCategories) updates.preferredCategories = JSON.parse(storedCategories);

            if (Object.keys(updates).length > 0) {
                await userRepository.updateProfile(userId, updates);
                console.log('✅ Onboarding data synced to Supabase');

                if (storedName) await AsyncStorage.removeItem('onboarding_username');
                // Note: We might want to keep categories locally for offline filtering, 
                // but they are now safely in the cloud too.
            }
        } catch (error) {
            console.error('Error syncing onboarding data:', error);
        }
    };

    const signInWithApple = async () => {
        setLoading(true);
        try {
            await authService.signInWithApple();
        } catch (error) {
            console.error('Apple Sign In Error:', error);
            // Handle error (toast, alert, etc.)
        } finally {
            setLoading(false);
        }
    };

    const signInWithGoogle = async () => {
        setLoading(true);
        try {
            await authService.signInWithGoogle();
        } catch (error) {
            console.error('Google Sign In Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const signInAnonymously = async () => {
        setLoading(true);
        try {
            await authService.signInAnonymously();
        } catch (error) {
            console.error('Anonymous Sign In Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const signOut = async () => {
        setLoading(true);
        try {
            await authService.signOut();
        } finally {
            setLoading(false);
        }
    };

    const value = {
        session,
        user,
        loading,
        isGuest: !session || session?.user?.is_anonymous || false,
        signInWithApple,
        signInWithGoogle,
        signInAnonymously,
        signOut,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
