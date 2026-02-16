import { useAuth } from '@/src/context/AuthContext';
import { User } from 'lucide-react-native';
import React from 'react';
import { Image, Text, View } from 'react-native';

interface UserAvatarProps {
    size?: number;
    color?: string;
}

export function UserAvatar({ size = 24, color = '#666' }: UserAvatarProps) {
    const { user, isGuest } = useAuth();

    // If guest, show default user icon
    if (isGuest || !user) {
        return (
            <View pointerEvents="none">
                <User color={color} size={size} />
            </View>
        );
    }

    // Get user avatar URL from metadata
    const avatarUrl = user.user_metadata?.avatar_url || user.user_metadata?.picture;

    // Get user initials from name or email
    const getInitials = () => {
        const name = user.user_metadata?.full_name || user.user_metadata?.name || user.email;
        if (!name) return '?';

        const parts = name.split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    // If user has avatar, show image
    if (avatarUrl) {
        return (
            <View
                style={{
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                    overflow: 'hidden',
                    borderWidth: 1,
                    borderColor: color,
                }}
            >
                <Image
                    source={{ uri: avatarUrl }}
                    style={{ width: size, height: size }}
                    resizeMode="cover"
                />
            </View>
        );
    }

    // Otherwise show initials in a circle
    return (
        <View
            style={{
                width: size,
                height: size,
                borderRadius: size / 2,
                backgroundColor: color === '#fff' ? '#007AFF' : '#2A2A2A',
                borderWidth: 1,
                borderColor: color,
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Text
                style={{
                    color: color === '#fff' ? '#fff' : color,
                    fontSize: size * 0.4,
                    fontWeight: 'bold',
                }}
            >
                {getInitials()}
            </Text>
        </View>
    );
}
