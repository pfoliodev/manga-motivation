import QuoteCard from '@/components/QuoteCard';
import { useFavorites } from '@/hooks/useFavorites';
import { useQuotes } from '@/hooks/useQuotes';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Brain, Flame, Sparkles, Target } from 'lucide-react-native';
import React, { useMemo } from 'react';
import { ActivityIndicator, Dimensions, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { Extrapolation, FadeInDown, FadeInUp, interpolate, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

const { width: WINDOW_WIDTH, height: WINDOW_HEIGHT } = Dimensions.get('window');
const CARD_HEIGHT = WINDOW_HEIGHT * 0.7;
const SPACING = 20;
const ITEM_SIZE = CARD_HEIGHT + SPACING;

const QuoteItem = React.memo(({ item, index, scrollY, isLinked, onLike }: { item: any, index: number, scrollY: any, isLinked: boolean, onLike: () => void }) => {
    const animatedStyle = useAnimatedStyle(() => {
        const inputRange = [
            (index - 1) * ITEM_SIZE,
            index * ITEM_SIZE,
            (index + 1) * ITEM_SIZE
        ];

        const scale = interpolate(
            scrollY.value,
            inputRange,
            [0.9, 1, 0.9],
            Extrapolation.CLAMP
        );

        const opacity = interpolate(
            scrollY.value,
            inputRange,
            [0.3, 1, 0.3],
            Extrapolation.CLAMP
        );

        const translateY = interpolate(
            scrollY.value,
            inputRange,
            [50, 0, -50], // Parallaxe
            Extrapolation.CLAMP
        );

        return {
            transform: [{ scale }, { translateY }],
            opacity,
        };
    });

    return (
        <Animated.View style={[styles.itemContainer, animatedStyle]}>
            <QuoteCard
                quote={item}
                isLiked={isLinked}
                onLike={onLike}
                height={CARD_HEIGHT}
                scrollY={scrollY}
                index={index}
                itemSize={ITEM_SIZE}
            />
        </Animated.View>
    );
});

// Category configuration
const CATEGORY_CONFIG: Record<string, {
    name: string;
    description: string;
    gradient: readonly [string, string];
    icon: React.ReactNode;
}> = {
    stoicisme: {
        name: 'Stoïcisme',
        description: 'Sagesse et maîtrise de soi',
        gradient: ['#667eea', '#764ba2'] as const,
        icon: <Brain size={28} color="#FFF" />,
    },
    mental: {
        name: 'Mental',
        description: 'Force intérieure et résilience',
        gradient: ['#f093fb', '#f5576c'] as const,
        icon: <Sparkles size={28} color="#FFF" />,
    },
    discipline: {
        name: 'Discipline',
        description: 'Persévérance et détermination',
        gradient: ['#4facfe', '#00f2fe'] as const,
        icon: <Target size={28} color="#FFF" />,
    },
    ambition: {
        name: 'Ambition',
        description: 'Rêves et conquêtes',
        gradient: ['#fa709a', '#fee140'] as const,
        icon: <Flame size={28} color="#FFF" />,
    },
};

export default function CategoryQuotesScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const { quotes, loading, getQuotesByCategory, refresh, refreshing } = useQuotes();
    const { favorites, toggleFavorite, isFavorite } = useFavorites();

    // Get category configuration
    const categoryId = id?.toLowerCase() || '';
    const categoryConfig = CATEGORY_CONFIG[categoryId];

    const scrollY = useSharedValue(0);
    const scrollHandler = useAnimatedScrollHandler((event) => {
        scrollY.value = event.contentOffset.y;
    });

    // Filter quotes by category
    const categoryQuotes = useMemo(() => {
        if (!categoryConfig) return [];
        return getQuotesByCategory(categoryConfig.name);
    }, [quotes, categoryConfig, getQuotesByCategory]);

    if (!categoryConfig) {
        return (
            <View style={styles.container}>
                <LinearGradient
                    colors={['#0F0F0F', '#1A1A1A', '#0F0F0F']}
                    style={StyleSheet.absoluteFillObject}
                />
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>Catégorie non trouvée</Text>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Text style={styles.backButtonText}>Retour</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    if (loading) {
        return (
            <View style={styles.container}>
                <LinearGradient
                    colors={['#0F0F0F', '#1A1A1A', '#0F0F0F']}
                    style={StyleSheet.absoluteFillObject}
                />
                <ActivityIndicator size="large" color="#FFF" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#0F0F0F', '#1A1A1A', '#0F0F0F']}
                style={StyleSheet.absoluteFillObject}
            />

            {/* Header */}
            <Animated.View
                entering={FadeInUp.duration(500)}
                style={styles.header}
                pointerEvents="box-none"
            >
                <LinearGradient
                    colors={categoryConfig.gradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.headerGradient}
                    pointerEvents="box-none"
                >
                    {/* Back Button */}
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={styles.backButtonHeader}
                        activeOpacity={0.7}
                        hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                    >
                        <View pointerEvents="none">
                            <ArrowLeft size={24} color="#FFF" />
                        </View>
                    </TouchableOpacity>

                    {/* Category Info */}
                    <View style={styles.headerContent} pointerEvents="none">
                        <View style={styles.iconContainer}>
                            {categoryConfig.icon}
                        </View>
                        <Text style={styles.categoryTitle}>{categoryConfig.name}</Text>
                        <Text style={styles.categoryDescription}>{categoryConfig.description}</Text>
                        <View style={styles.countBadge}>
                            <Text style={styles.countText}>
                                {categoryQuotes.length} {categoryQuotes.length > 1 ? 'quotes' : 'quote'}
                            </Text>
                        </View>
                    </View>

                    {/* Decorative circles */}
                    <View style={styles.decorativeCircle1} pointerEvents="none" />
                    <View style={styles.decorativeCircle2} pointerEvents="none" />
                </LinearGradient>
            </Animated.View>

            {categoryQuotes.length === 0 ? (
                <Animated.View
                    entering={FadeInDown.duration(500).delay(200)}
                    style={styles.emptyContainer}
                >
                    <Text style={styles.emptyText}>Aucune quote dans cette catégorie</Text>
                </Animated.View>
            ) : (
                <Animated.FlatList
                    data={categoryQuotes}
                    keyExtractor={(item) => item.id}
                    onScroll={scrollHandler}
                    scrollEventThrottle={16}
                    renderItem={({ item, index }) => (
                        <QuoteItem
                            item={item}
                            index={index}
                            scrollY={scrollY}
                            isLinked={isFavorite(item.id)}
                            onLike={() => toggleFavorite(item.id)}
                        />
                    )}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.listContent}
                    snapToInterval={ITEM_SIZE}
                    decelerationRate="fast"
                    snapToAlignment="start"
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor="#FFF" />
                    }
                    /* Optimisations FlatList */
                    removeClippedSubviews={true}
                    initialNumToRender={2}
                    maxToRenderPerBatch={2}
                    windowSize={3}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0F0F0F',
    },
    header: {
        height: 220,
        overflow: 'hidden',
    },
    headerGradient: {
        flex: 1,
        paddingTop: 36,
        paddingHorizontal: 24,
        paddingBottom: 16,
        position: 'relative',
    },
    backButtonHeader: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    headerContent: {
        alignItems: 'center',
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 5,
    },
    categoryTitle: {
        fontSize: 26,
        fontWeight: '800',
        color: '#FFF',
        marginBottom: 2,
        textAlign: 'center',
    },
    categoryDescription: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.9)',
        textAlign: 'center',
        marginBottom: 6,
    },
    countBadge: {
        backgroundColor: 'rgba(255,255,255,0.25)',
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 16,
        marginBottom: 8,
    },
    countText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#FFF',
    },
    decorativeCircle1: {
        position: 'absolute',
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: 'rgba(255,255,255,0.1)',
        top: -50,
        right: -50,
    },
    decorativeCircle2: {
        position: 'absolute',
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(255,255,255,0.05)',
        bottom: -30,
        left: -30,
    },
    listContent: {
        paddingTop: 16,
        paddingBottom: 40,
    },
    itemContainer: {
        marginBottom: SPACING,
        alignItems: 'center',
        height: CARD_HEIGHT, // Force container height
        justifyContent: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    emptyText: {
        fontSize: 18,
        color: '#666',
        textAlign: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    errorText: {
        fontSize: 20,
        color: '#FFF',
        marginBottom: 24,
    },
    backButton: {
        backgroundColor: '#333',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    backButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },
});
