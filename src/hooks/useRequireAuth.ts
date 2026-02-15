import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';

export function useRequireAuth() {
    const { isGuest, loading } = useAuth();
    const router = useRouter();

    return (action?: () => void) => {
        if (loading) {
            console.log('⏳ Auth Check in progress (loading: true), ignoring click');
            return;
        }

        if (isGuest) {
            console.log('🛡️ Auth Required: Redirecting to /paywall');
            router.push('/paywall');
        } else {
            console.log('✅ Auth Verified: Executing action');
            if (action) {
                action();
            }
        }
    };
}
