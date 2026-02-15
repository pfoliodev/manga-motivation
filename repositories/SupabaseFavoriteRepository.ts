import { supabase } from '@/utils/supabase';
import { FavoriteRepository } from './FavoriteRepository';

/**
 * Supabase implementation of FavoriteRepository
 * Uses RLS policies to ensure users can only access their own favorites
 */
export class SupabaseFavoriteRepository implements FavoriteRepository {
    async getFavorites(userId: string): Promise<string[]> {
        const { data, error } = await supabase
            .from('favorites')
            .select('quote_id')
            .eq('user_id', userId);

        if (error) {
            console.error('Error fetching favorites:', error);
            throw new Error('Failed to fetch favorites');
        }

        return (data || []).map(fav => fav.quote_id);
    }

    async addFavorite(userId: string, quoteId: string): Promise<void> {
        const { error } = await supabase
            .from('favorites')
            .insert({
                user_id: userId,
                quote_id: quoteId,
            });

        if (error) {
            // Ignore duplicate errors (unique constraint violation)
            if (error.code === '23505') {
                return;
            }
            console.error('Error adding favorite:', error);
            throw new Error('Failed to add favorite');
        }
    }

    async removeFavorite(userId: string, quoteId: string): Promise<void> {
        const { error } = await supabase
            .from('favorites')
            .delete()
            .eq('user_id', userId)
            .eq('quote_id', quoteId);

        if (error) {
            console.error('Error removing favorite:', error);
            throw new Error('Failed to remove favorite');
        }
    }

    async isFavorite(userId: string, quoteId: string): Promise<boolean> {
        const { data, error } = await supabase
            .from('favorites')
            .select('id')
            .eq('user_id', userId)
            .eq('quote_id', quoteId)
            .single();

        if (error) {
            // Not found is not an error in this case
            return false;
        }

        return !!data;
    }
}

// Export singleton instance
export const favoriteRepository = new SupabaseFavoriteRepository();
