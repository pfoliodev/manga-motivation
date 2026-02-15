import * as AppleAuthentication from 'expo-apple-authentication';
import Constants, { ExecutionEnvironment } from 'expo-constants';
import { supabase } from '../../utils/supabase';

// Helper to safely get GoogleSignin module
function getGoogleSignin() {
    // Prevent importing the module in Expo Go as it crashes due to missing native module
    if (Constants.executionEnvironment === ExecutionEnvironment.StoreClient) {
        return { GoogleSignin: null, statusCodes: null, error: 'Not supported in Expo Go' };
    }

    try {
        const { GoogleSignin, statusCodes } = require('@react-native-google-signin/google-signin');
        return { GoogleSignin, statusCodes, error: null };
    } catch (e) {
        return { GoogleSignin: null, statusCodes: null, error: e };
    }
}

// Initialize Google Sign-In if possible
const { GoogleSignin } = getGoogleSignin();
if (GoogleSignin) {
    try {
        GoogleSignin.configure({
            scopes: ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile'],
            webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
            iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
        });
    } catch (e) {
        console.warn('Google Signin configure failed:', e);
    }
}

export const authService = {
    async signInWithApple() {
        try {
            const credential = await AppleAuthentication.signInAsync({
                requestedScopes: [
                    AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                    AppleAuthentication.AppleAuthenticationScope.EMAIL,
                ],
            });

            // Sign in via Supabase with the ID token
            if (credential.identityToken) {
                const { error, data } = await supabase.auth.signInWithIdToken({
                    provider: 'apple',
                    token: credential.identityToken,
                });

                if (error) throw error;
                return data;
            }
            throw new Error('No identity token returned from Apple Sign-In.');
        } catch (e: any) {
            if (e.code === 'ERR_REQUEST_CANCELED') {
                // handle that the user canceled the sign-in flow
                console.log('User canceled Apple Sign-In');
                return null;
            }
            throw e;
        }
    },

    async signInWithGoogle() {
        // conditionally load module
        const { GoogleSignin, statusCodes, error } = getGoogleSignin();

        if (!GoogleSignin) {
            alert("Google Sign-In is not supported in Expo Go. Please use a Development Build.");
            console.warn("Google Sign-In load error:", error);
            return null;
        }

        try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();

            if (userInfo.data?.idToken) {
                const { data, error } = await supabase.auth.signInWithIdToken({
                    provider: 'google',
                    token: userInfo.data.idToken,
                });

                if (error) throw error;
                return data;
            } else {
                throw new Error('No ID token present!');
            }
        } catch (error: any) {
            if (statusCodes && error.code === statusCodes.SIGN_IN_CANCELLED) {
                console.log('User canceled Google Sign-In');
                return null;
            } else if (statusCodes && error.code === statusCodes.IN_PROGRESS) {
                console.log('Google Sign-In in progress');
                return null;
            } else if (statusCodes && error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                throw new Error('Play Services not available or outdated');
            } else {
                console.error("Google Sign Error:", error);
                // Safe check for invariant error string if standard error properties aren't enough
                if (error.toString().includes("invariant") || error.toString().includes("TurboModuleRegistry")) {
                    alert("Google Sign-In requires a custom dev client. It does not work in Expo Go.");
                } else {
                    alert("Google Sign-In failed. See logs.");
                }
                return null;
            }
        }
    },

    async signOut() {
        try {
            await supabase.auth.signOut();
            try {
                const { GoogleSignin } = getGoogleSignin();
                if (GoogleSignin) {
                    await GoogleSignin.revokeAccess();
                }
            } catch (e) {
                // Ignore google revoke error in expo go
            }
        } catch (error) {
            console.error('Error signing out:', error);
            throw error;
        }
    },

    async getSession() {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        return session;
    }
};
