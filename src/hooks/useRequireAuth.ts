import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';

export function useRequireAuth() {
    const { isGuest, loading } = useAuth();
    const router = useRouter();

    return (action?: () => void) => {
        if (loading) return; // Prevent action while checking auth status

        if (isGuest) {
            // Redirect to Paywall / Auth Modal
            router.push('/paywall');
        } else {
            // Execute the protected action
            if (action) {
                action();
            }
        }
    };
}
