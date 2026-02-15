import { Quote } from '@/types/database.types';

/**
 * Repository interface for Quote operations
 * This abstraction allows us to swap data sources without changing the UI
 */
export interface QuoteRepository {
    /**
     * Get all quotes
     */
    getAllQuotes(): Promise<Quote[]>;

    /**
     * Get a single quote by ID
     */
    getQuoteById(id: string): Promise<Quote | null>;

    /**
     * Get quotes filtered by category
     */
    getQuotesByCategory(category: string): Promise<Quote[]>;
}
