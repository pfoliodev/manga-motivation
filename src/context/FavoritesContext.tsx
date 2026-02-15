import { favoriteRepository } from '@/repositories/SupabaseFavoriteRepository';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

interface FavoritesState {
    favorites: string[];
    loading: boolean;
    error: Error | null;
}

interface FavoritesContextType extends FavoritesState {
    toggleFavorite: (quoteId: string) => Promise<void>;
    isFavorite: (quoteId: string) => boolean;
    refresh: () => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType>({
    favorites: [],
    loading: true,
    error: null,
    toggleFavorite: async () => { },
    isFavorite: () => false,
    refresh: async () => { },
});

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const [state, setState] = useState<FavoritesState>({
        favorites: [],
        loading: true,
        error: null,
    });

    // Load favorites from Supabase
    const loadFavorites = useCallback(async () => {
        if (!user) {
            setState({ favorites: [], loading: false, error: null });
            return;
        }

        try {
            const favorites = await favoriteRepository.getFavorites(user.id);
            setState({
                favorites,
                loading: false,
                error: null,
            });
        } catch (error) {
            console.error('Error loading favorites:', error);
            setState(prev => ({
                ...prev,
                error: error as Error,
                loading: false,
            }));
        }
    }, [user]);

    // Toggle favorite with optimistic update
    const toggleFavorite = useCallback(async (quoteId: string) => {
        if (!user) {
            console.warn('Cannot toggle favorite: user not authenticated');
            return;
        }

        const isFavorited = state.favorites.includes(quoteId);

        // Optimistic update - immediately update UI
        setState(prev => ({
            ...prev,
            favorites: isFavorited
                ? prev.favorites.filter(id => id !== quoteId)
                : [...prev.favorites, quoteId],
        }));

        try {
            if (isFavorited) {
                await favoriteRepository.removeFavorite(user.id, quoteId);
            } else {
                await favoriteRepository.addFavorite(user.id, quoteId);
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);

            // Rollback on error
            setState(prev => ({
                ...prev,
                favorites: isFavorited
                    ? [...prev.favorites, quoteId]
                    : prev.favorites.filter(id => id !== quoteId),
                error: error as Error,
            }));
        }
    }, [user, state.favorites]);

    // Check if a quote is favorited
    const isFavorite = useCallback((quoteId: string) => {
        return state.favorites.includes(quoteId);
    }, [state.favorites]);

    // Load favorites when user changes
    useEffect(() => {
        loadFavorites();
    }, [loadFavorites]);

    return (
        <FavoritesContext.Provider
            value={{
                favorites: state.favorites,
                loading: state.loading,
                error: state.error,
                toggleFavorite,
                isFavorite,
                refresh: loadFavorites,
            }}
        >
            {children}
        </FavoritesContext.Provider>
    );
}

export function useFavorites() {
    const context = useContext(FavoritesContext);
    if (!context) {
        throw new Error('useFavorites must be used within a FavoritesProvider');
    }
    return context;
}
