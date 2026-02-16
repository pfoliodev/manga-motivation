import { Database } from '@/types/database.types';
import { supabase } from '../../utils/supabase';

export const userService = {
    async updateProfile(updates: Database['public']['Tables']['profiles']['Update']) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not logged in');

        const { error } = await supabase
            .from('profiles')
            // @ts-expect-error - profiles table exists in database but types may not be fully synced
            .update(updates)
            .eq('id', user.id);

        if (error) throw error;
    },

    async getProfile(): Promise<{
        id: string;
        email: string | null;
        full_name: string | null;
        avatar_url: string | null;
        notifications_enabled: boolean;
        notification_time: string;
        created_at: string;
        updated_at: string;
    } | null> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return null;

        // @ts-ignore - profiles table exists in database
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        if (error) {
            console.error('Error fetching profile:', error);
            return null;
        }
        return data;
    }
};
