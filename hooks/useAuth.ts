import { supabase } from '@/utils/supabase';
import { Session, User } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

interface AuthState {
    user: User | null;
    session: Session | null;
    loading: boolean;
    error: Error | null;
}

/**
 * Custom hook for authentication management
 * Handles anonymous authentication and session persistence
 */
export function useAuth() {
    const [state, setState] = useState<AuthState>({
        user: null,
        session: null,
        loading: true,
        error: null,
    });

    useEffect(() => {
        // Check for existing session
        supabase.auth.getSession().then(({ data: { session }, error }) => {
            if (error) {
                // The 'error' from getSession is of type AuthError | null, which is compatible with Error | null
                setState(prev => ({ ...prev, error, loading: false }));
                return;
            }

            if (session) {
                setState({
                    user: session.user,
                    session,
                    loading: false,
                    error: null,
                });
            } else {
                // No session, sign in anonymously
                signInAnonymously();
            }
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setState({
                    user: session?.user ?? null,
                    session,
                    loading: false,
                    error: null,
                });
            }
        );

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const signInAnonymously = async () => {
        try {
            const { data, error } = await supabase.auth.signInAnonymously();

            if (error) {
                // The 'error' from signInAnonymously is of type AuthError | null
                setState(prev => ({ ...prev, error, loading: false }));
                return;
            }

            setState({
                user: data.user,
                session: data.session,
                loading: false,
                error: null,
            });
        } catch (error) {
            setState(prev => ({
                ...prev,
                error: error as Error,
                loading: false,
            }));
        }
    };

    const signOut = async () => {
        try {
            await supabase.auth.signOut();
            setState({
                user: null,
                session: null,
                loading: false,
                error: null,
            });
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    return {
        user: state.user,
        session: state.session,
        loading: state.loading,
        error: state.error,
        signOut,
    };
}
