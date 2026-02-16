import { useQuotes } from '@/hooks/useQuotes';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Brain, Flame, Sparkles, Target } from 'lucide-react-native';
import React, { useMemo } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

const { width: WINDOW_WIDTH } = Dimensions.get('window');

interface Category {
    id: string;
    name: string;
    description: string;
    icon: React.ReactNode;
    gradient: readonly [string, string, ...string[]];
}

const categoryConfigs: Category[] = [
    {
        id: 'stoicisme',
        name: 'Stoïcisme',
        description: 'Sagesse et maîtrise de soi',
        icon: <Brain size={32} color="#FFF" />,
        gradient: ['#667eea', '#764ba2'] as const,
    },
    {
        id: 'mental',
        name: 'Mental',
        description: 'Force intérieure et résilience',
        icon: <Sparkles size={32} color="#FFF" />,
        gradient: ['#f093fb', '#f5576c'] as const,
    },
    {
        id: 'discipline',
        name: 'Discipline',
        description: 'Persévérance et détermination',
        icon: <Target size={32} color="#FFF" />,
        gradient: ['#4facfe', '#00f2fe'] as const,
    },
    {
        id: 'ambition',
        name: 'Ambition',
        description: 'Rêves et conquêtes',
        icon: <Flame size={32} color="#FFF" />,
        gradient: ['#fa709a', '#fee140'] as const,
    },
];

export default function CategoriesScreen() {
    const router = useRouter();
    const { quotes, getQuotesByCategory } = useQuotes();

    // Calculate quote counts dynamically
    const categories = useMemo(() => {
        return categoryConfigs.map(config => ({
            ...config,
            quoteCount: getQuotesByCategory(config.name).length,
        }));
    }, [quotes, getQuotesByCategory]);

    const handleCategoryPress = (categoryId: string) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        router.push(`/category/${categoryId}`);
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#0F0F0F', '#1A1A1A', '#0F0F0F']}
                style={StyleSheet.absoluteFillObject}
            />

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <Animated.View
                    entering={FadeInUp.duration(600).delay(100)}
                    style={styles.header}
                >
                    <Text style={styles.title}>Catégories</Text>
                    <Text style={styles.subtitle}>
                        Explore les quotes par thème
                    </Text>
                </Animated.View>

                {/* Categories Grid */}
                <View style={styles.grid}>
                    {categories.map((category, index) => (
                        <Animated.View
                            key={category.id}
                            entering={FadeInDown.duration(600).delay(200 + index * 100)}
                            style={styles.cardWrapper}
                        >
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => handleCategoryPress(category.id)}
                                style={styles.card}
                            >
                                <LinearGradient
                                    colors={category.gradient}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={styles.cardGradient}
                                >
                                    {/* Icon Container */}
                                    <View style={styles.iconContainer}>
                                        {category.icon}
                                    </View>

                                    {/* Content */}
                                    <View style={styles.cardContent}>
                                        <Text style={styles.categoryName}>{category.name}</Text>
                                        <Text style={styles.categoryDescription}>
                                            {category.description}
                                        </Text>
                                    </View>

                                    {/* Quote Count Badge */}
                                    <View style={styles.badge}>
                                        <Text style={styles.badgeText}>{category.quoteCount}</Text>
                                    </View>

                                    {/* Decorative Elements */}
                                    <View style={styles.decorativeCircle1} />
                                    <View style={styles.decorativeCircle2} />
                                </LinearGradient>
                            </TouchableOpacity>
                        </Animated.View>
                    ))}
                </View>

                {/* Stats Section */}
                <Animated.View
                    entering={FadeInUp.duration(600).delay(800)}
                    style={styles.statsContainer}
                >
                    <LinearGradient
                        colors={['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.02)']}
                        style={styles.statsGradient}
                    >
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{quotes.length}</Text>
                            <Text style={styles.statLabel}>Total Quotes</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{categories.length}</Text>
                            <Text style={styles.statLabel}>Catégories</Text>
                        </View>
                    </LinearGradient>
                </Animated.View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0F0F0F',
    },
    scrollContent: {
        paddingTop: 60,
        paddingBottom: 40,
        paddingHorizontal: 20,
    },
    header: {
        marginBottom: 32,
    },
    title: {
        fontSize: 42,
        fontWeight: '800',
        color: '#FFF',
        marginBottom: 8,
        letterSpacing: -1,
    },
    subtitle: {
        fontSize: 16,
        color: '#888',
        letterSpacing: 0.5,
    },
    grid: {
        gap: 16,
        marginBottom: 32,
    },
    cardWrapper: {
        width: '100%',
    },
    card: {
        borderRadius: 24,
        overflow: 'hidden',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    cardGradient: {
        padding: 24,
        minHeight: 140,
        position: 'relative',
        overflow: 'hidden',
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        backdropFilter: 'blur(10px)',
    },
    cardContent: {
        flex: 1,
    },
    categoryName: {
        fontSize: 28,
        fontWeight: '700',
        color: '#FFF',
        marginBottom: 6,
        letterSpacing: -0.5,
    },
    categoryDescription: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.9)',
        letterSpacing: 0.3,
    },
    badge: {
        position: 'absolute',
        top: 20,
        right: 20,
        backgroundColor: 'rgba(255,255,255,0.25)',
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 20,
        backdropFilter: 'blur(10px)',
    },
    badgeText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFF',
    },
    decorativeCircle1: {
        position: 'absolute',
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'rgba(255,255,255,0.1)',
        top: -40,
        right: -40,
    },
    decorativeCircle2: {
        position: 'absolute',
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255,255,255,0.05)',
        bottom: -20,
        left: -20,
    },
    statsContainer: {
        marginTop: 16,
        borderRadius: 20,
        overflow: 'hidden',
    },
    statsGradient: {
        flexDirection: 'row',
        padding: 24,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        borderRadius: 20,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statValue: {
        fontSize: 36,
        fontWeight: '800',
        color: '#FFF',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 13,
        color: '#888',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    statDivider: {
        width: 1,
        backgroundColor: 'rgba(255,255,255,0.1)',
        marginHorizontal: 20,
    },
});
