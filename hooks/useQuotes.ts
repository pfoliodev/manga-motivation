import { quoteRepository } from '@/repositories/SupabaseQuoteRepository';
import { Quote } from '@/types/database.types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

const CACHE_KEY = 'quotes_cache';
const CACHE_TIMESTAMP_KEY = 'quotes_cache_timestamp';
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

interface QuotesState {
    quotes: Quote[];
    loading: boolean;
    error: Error | null;
    refreshing: boolean;
}

/**
 * Custom hook for managing quotes
 * Implements caching strategy with AsyncStorage for better performance
 */
export function useQuotes() {
    const [state, setState] = useState<QuotesState>({
        quotes: [],
        loading: true,
        error: null,
        refreshing: false,
    });

    // Load quotes from cache or fetch from Supabase
    const loadQuotes = useCallback(async (forceRefresh = false) => {
        try {
            let allQuotes: Quote[] = [];

            // Check cache first
            if (!forceRefresh) {
                const cachedQuotes = await getCachedQuotes();
                if (cachedQuotes) {
                    console.log('📦 Données chargées depuis le CACHE');
                    allQuotes = cachedQuotes;
                }
            }

            // Fetch from Supabase if not in cache or force refresh
            if (allQuotes.length === 0) {
                console.log('🌐 Récupération des données depuis SUPABASE...');
                allQuotes = await quoteRepository.getAllQuotes();
                console.log(`✅ ${allQuotes.length} citations récupérées de Supabase`);
                await cacheQuotes(allQuotes);
            }

            // Apply filtering based on preferred categories (stored in AsyncStorage during onboarding)
            const preferredStr = await AsyncStorage.getItem('preferred_categories');
            let finalQuotes = allQuotes;

            if (preferredStr) {
                const preferredNames: string[] = JSON.parse(preferredStr);
                if (preferredNames.length > 0) {
                    finalQuotes = allQuotes.filter(q => preferredNames.includes(q.category));
                    console.log(`🎯 Filtrage appliqué : ${finalQuotes.length}/${allQuotes.length} citations correspondent à tes voies.`);
                }
            }

            setState({
                quotes: finalQuotes,
                loading: false,
                error: null,
                refreshing: false,
            });
        } catch (error) {
            console.error('Error loading quotes:', error);
            setState(prev => ({
                ...prev,
                error: error as Error,
                loading: false,
                refreshing: false,
            }));
        }
    }, []);

    // Pull-to-refresh handler
    const refresh = useCallback(async () => {
        setState(prev => ({ ...prev, refreshing: true }));
        await loadQuotes(true);
    }, [loadQuotes]);

    // Get quotes by category
    const getQuotesByCategory = useCallback((category: string) => {
        return state.quotes.filter(quote => quote.category === category);
    }, [state.quotes]);

    // Get quote by ID
    const getQuoteById = useCallback((id: string) => {
        return state.quotes.find(quote => quote.id === id);
    }, [state.quotes]);

    // Load quotes on mount
    useEffect(() => {
        loadQuotes();
    }, [loadQuotes]);

    return {
        quotes: state.quotes,
        loading: state.loading,
        error: state.error,
        refreshing: state.refreshing,
        refresh,
        getQuotesByCategory,
        getQuoteById,
    };
}

// Helper: Get cached quotes if still valid
async function getCachedQuotes(): Promise<Quote[] | null> {
    try {
        const [cachedData, timestamp] = await Promise.all([
            AsyncStorage.getItem(CACHE_KEY),
            AsyncStorage.getItem(CACHE_TIMESTAMP_KEY),
        ]);

        if (!cachedData || !timestamp) {
            return null;
        }

        const cacheAge = Date.now() - parseInt(timestamp, 10);
        if (cacheAge > CACHE_DURATION) {
            return null;
        }

        return JSON.parse(cachedData);
    } catch (error) {
        console.error('Error reading cache:', error);
        return null;
    }
}

// Helper: Cache quotes
async function cacheQuotes(quotes: Quote[]): Promise<void> {
    try {
        await Promise.all([
            AsyncStorage.setItem(CACHE_KEY, JSON.stringify(quotes)),
            AsyncStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString()),
        ]);
    } catch (error) {
        console.error('Error caching quotes:', error);
    }
}
