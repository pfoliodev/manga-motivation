export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            quotes: {
                Row: {
                    id: string
                    text: string
                    author: string
                    source: string
                    category: string
                    aura_level: number
                    background_image: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    text: string
                    author: string
                    source: string
                    category: string
                    aura_level?: number
                    background_image?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    text?: string
                    author?: string
                    source?: string
                    category?: string
                    aura_level?: number
                    background_image?: string | null
                    created_at?: string
                }
            }
            favorites: {
                Row: {
                    id: string
                    user_id: string
                    quote_id: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    quote_id: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    quote_id?: string
                    created_at?: string
                }
            }
            profiles: {
                Row: {
                    id: string
                    email: string | null
                    full_name: string | null
                    avatar_url: string | null
                    notifications_enabled: boolean
                    notification_time: string
                    xp: number
                    level: number
                    last_login: string | null
                    streak_count: number
                    max_streak: number
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id: string
                    email?: string | null
                    full_name?: string | null
                    avatar_url?: string | null
                    notifications_enabled?: boolean
                    notification_time?: string
                    xp?: number
                    level?: number
                    last_login?: string | null
                    streak_count?: number
                    max_streak?: number
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    email?: string | null
                    full_name?: string | null
                    avatar_url?: string | null
                    notifications_enabled?: boolean
                    notification_time?: string
                    xp?: number
                    level?: number
                    last_login?: string | null
                    streak_count?: number
                    max_streak?: number
                    created_at?: string
                    updated_at?: string
                }
            }
            user_seen_quotes: {
                Row: {
                    id: string
                    user_id: string
                    quote_id: string
                    viewed_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    quote_id: string
                    viewed_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    quote_id?: string
                    viewed_at?: string
                }
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}

// Application domain types
export interface Quote {
    id: string;
    text: string;
    author: string;
    source: string;
    category: string;
    aura_level?: number;
    background_image?: string | null;
}

export interface Favorite {
    id: string;
    userId: string;
    quoteId: string;
    createdAt: string;
}

export interface UserProfile {
    id: string;
    email: string | null;
    fullName: string | null;
    avatarUrl: string | null;
    notificationsEnabled: boolean;
    notificationTime: string;
    xp: number;
    level: number;
    lastLogin: string | null;
    streakCount: number;
    maxStreak: number;
    createdAt: string;
    updatedAt: string;
}
