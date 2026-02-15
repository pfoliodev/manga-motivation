/**
 * Repository interface for Favorite operations
 */
export interface FavoriteRepository {
    /**
     * Get all favorite quote IDs for a user
     */
    getFavorites(userId: string): Promise<string[]>;

    /**
     * Add a quote to favorites
     */
    addFavorite(userId: string, quoteId: string): Promise<void>;

    /**
     * Remove a quote from favorites
     */
    removeFavorite(userId: string, quoteId: string): Promise<void>;

    /**
     * Check if a quote is favorited by a user
     */
    isFavorite(userId: string, quoteId: string): Promise<boolean>;
}
