import { Quote } from '@/types/database.types';
import { supabase } from '@/utils/supabase';
import { QuoteRepository } from './QuoteRepository';

/**
 * Supabase implementation of QuoteRepository
 */
export class SupabaseQuoteRepository implements QuoteRepository {
    async getAllQuotes(): Promise<Quote[]> {
        const { data, error } = await supabase
            .from('quotes')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching quotes:', error);
            throw new Error('Failed to fetch quotes');
        }

        return this.mapToQuotes(data || []);
    }

    async getQuoteById(id: string): Promise<Quote | null> {
        const { data, error } = await supabase
            .from('quotes')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching quote:', error);
            return null;
        }

        return this.mapToQuote(data);
    }

    async getQuotesByCategory(category: string): Promise<Quote[]> {
        const { data, error } = await supabase
            .from('quotes')
            .select('*')
            .eq('category', category)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching quotes by category:', error);
            throw new Error('Failed to fetch quotes by category');
        }

        return this.mapToQuotes(data || []);
    }

    /**
     * Map database row to Quote domain model
     */
    private mapToQuote(row: any): Quote {
        return {
            id: row.id,
            text: row.text,
            author: row.author,
            source: row.source,
            category: row.category,
            aura_level: row.aura_level,
            background_image: row.background_image,
        };
    }

    /**
     * Map array of database rows to Quote domain models
     */
    private mapToQuotes(rows: any[]): Quote[] {
        return rows.map(row => this.mapToQuote(row));
    }
}

// Export singleton instance
export const quoteRepository = new SupabaseQuoteRepository();
