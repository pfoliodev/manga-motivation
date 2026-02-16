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
                    created_at?: string
                    updated_at?: string
                }
            }
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
