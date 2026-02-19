import { usePowerLevel } from '@/hooks/usePowerLevel';
import { quoteRepository } from '@/repositories/SupabaseQuoteRepository';
import { Quote } from '@/types/database.types';
import { Lock, Search, Sparkles } from 'lucide-react-native';
import React, { useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    Pressable,
    SafeAreaView,
    ScrollView,
    StatusBar,
    Text,
    TextInput,
    View
} from 'react-native';
import Animated, {
    FadeInDown,
    FadeInRight,
    Layout,
    useAnimatedStyle,
    useSharedValue,
    withSpring
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - 48) / 2;

interface CollectionCardProps {
    quote: Quote;
    isUnlocked: boolean;
    index: number;
}

const CollectionCard = ({ quote, isUnlocked, index }: CollectionCardProps) => {
    const cardScale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: cardScale.value }]
    }));

    const onPressIn = () => {
        cardScale.value = withSpring(0.95);
    };

    const onPressOut = () => {
        cardScale.value = withSpring(1);
    };

    return (
        <Animated.View
            entering={FadeInDown.delay(index * 50).springify()}
            layout={Layout.springify()}
            style={{ width: COLUMN_WIDTH, height: COLUMN_WIDTH * 1.25 }}
            className="m-2"
        >
            <Animated.View
                style={[{ flex: 1 }, animatedStyle]}
                className="rounded-3xl overflow-hidden border border-white/5 bg-[#1A1A1A]"
            >
                <Pressable
                    onPressIn={onPressIn}
                    onPressOut={onPressOut}
                    className="flex-1 p-4"
                >
                    {isUnlocked ? (
                        <View className="flex-1 justify-between">
                            <View>
                                <View className="flex-row justify-between items-center mb-3">
                                    <View className="bg-red-600 px-1.5 py-0.5 rounded">
                                        <Text className="text-[8px] font-black text-white italic">NEW</Text>
                                    </View>
                                    <View className="bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
                                        <Text className="text-[#FFD700] text-[8px] font-bold uppercase tracking-widest">
                                            {quote.category}
                                        </Text>
                                    </View>
                                </View>

                                <Text
                                    className="text-white text-[13px] font-bold leading-5 italic"
                                    numberOfLines={6}
                                >
                                    "{quote.text}"
                                </Text>
                            </View>

                            <View className="pt-3 border-t border-white/5">
                                <Text className="text-white font-black text-[10px] uppercase tracking-widest mb-0.5 italic" numberOfLines={1}>
                                    {quote.author}
                                </Text>
                                <Text className="text-white/40 text-[9px] uppercase tracking-tighter" numberOfLines={1}>
                                    {quote.source}
                                </Text>
                            </View>
                        </View>
                    ) : (
                        <View className="flex-1 justify-between">
                            <View className="flex-row justify-end mb-3 opacity-20">
                                <View className="bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
                                    <Text className="text-white text-[8px] font-bold uppercase tracking-widest">
                                        {quote.category}
                                    </Text>
                                </View>
                            </View>

                            <View className="items-center justify-center py-2">
                                <View className="bg-black/40 p-3 rounded-full mb-2 border border-white/5 opacity-40">
                                    <Lock size={18} color="#555" />
                                </View>
                                <Text className="text-[#333] text-[8px] font-bold uppercase tracking-[3px]">
                                    Mystère
                                </Text>
                            </View>

                            <View className="pt-3 border-t border-white/5 opacity-20">
                                <Text className="text-white font-black text-[10px] uppercase tracking-widest mb-0.5 italic" numberOfLines={1}>
                                    {quote.author}
                                </Text>
                                <Text className="text-white/40 text-[9px] uppercase tracking-tighter" numberOfLines={1}>
                                    {quote.source}
                                </Text>
                            </View>
                        </View>
                    )}
                </Pressable>
            </Animated.View>
        </Animated.View>
    );
};

export default function AuraDexScreen() {
    const { profile, seenQuoteIds, loading: profileLoading } = usePowerLevel();
    const [allQuotes, setAllQuotes] = useState<Quote[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchQuotes();
    }, []);

    const fetchQuotes = async () => {
        try {
            const data = await quoteRepository.getAllQuotes();
            setAllQuotes(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const unlockedCount = useMemo(() => {
        return allQuotes.filter(q => seenQuoteIds.has(q.id)).length;
    }, [allQuotes, seenQuoteIds]);

    const categoryStats = useMemo(() => {
        const stats: Record<string, { total: number, unlocked: number }> = {};
        allQuotes.forEach(q => {
            if (!stats[q.category]) {
                stats[q.category] = { total: 0, unlocked: 0 };
            }
            stats[q.category].total++;
            if (seenQuoteIds.has(q.id)) {
                stats[q.category].unlocked++;
            }
        });
        return Object.entries(stats).sort((a, b) => b[1].total - a[1].total);
    }, [allQuotes, seenQuoteIds]);

    const progress = allQuotes.length > 0 ? unlockedCount / allQuotes.length : 0;

    const filteredQuotes = useMemo(() => {
        if (!searchQuery) return allQuotes;
        return allQuotes.filter(q =>
            q.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
            q.source.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [allQuotes, searchQuery]);

    if (loading || profileLoading) {
        return (
            <View className="flex-1 bg-[#0F0F0F] items-center justify-center">
                <ActivityIndicator color="#FFD700" size="large" />
            </View>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-[#0F0F0F]">
            <StatusBar barStyle="light-content" />

            <View className="px-6 pt-4 pb-2">
                <View className="flex-row items-center justify-between mb-2">
                    <View>
                        <Text className="text-white text-3xl font-black italic uppercase tracking-tighter">
                            AuraDex
                        </Text>
                        <Text className="text-white/40 text-xs">
                            Collectionne tes inspirations
                        </Text>
                    </View>
                    <View className="bg-[#1A1A1A] p-3 rounded-2xl border border-white/5">
                        <Sparkles size={20} color="#FFD700" />
                    </View>
                </View>

                {/* Progress Bar Container */}
                <View className="bg-[#1A1A1A] rounded-2xl p-4 mt-2 border border-white/5">
                    <View className="flex-row justify-between items-end mb-2">
                        <Text className="text-white/80 text-[10px] font-bold uppercase tracking-widest">
                            Progression de l'âme
                        </Text>
                        <Text className="text-[#FFD700] text-sm font-black italic">
                            {unlockedCount} / {allQuotes.length}
                        </Text>
                    </View>
                    <View className="h-2 w-full bg-black/50 rounded-full overflow-hidden">
                        <Animated.View
                            entering={FadeInRight}
                            style={{
                                width: `${progress * 100}%`,
                                height: '100%',
                                backgroundColor: '#FFD700',
                            }}
                            className="rounded-full"
                        />
                    </View>
                </View>

                {/* Category Stats Section */}
                <View className="mt-8 mb-4 flex-row items-center">
                    <View className="w-1 h-4 bg-[#FFD700] rounded-full mr-3" />
                    <Text className="text-white/60 text-[10px] font-black uppercase tracking-[2px]">
                        Maîtrise des catégories
                    </Text>
                </View>

                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    className="-mx-6 px-6"
                    contentContainerStyle={{ paddingRight: 40 }}
                >
                    {categoryStats.map(([category, { total, unlocked }]) => (
                        <View
                            key={category}
                            className="bg-[#1A1A1A] border border-white/10 rounded-2xl px-5 py-4 mr-3 min-w-[120px]"
                        >
                            <Text className="text-white/40 text-[8px] font-bold uppercase tracking-widest mb-1.5">
                                {category}
                            </Text>
                            <View className="flex-row items-end justify-between mb-3">
                                <Text className="text-white text-lg font-black italic leading-none">
                                    {Math.round((unlocked / total) * 100)}<Text className="text-[10px] text-white/40 font-bold ml-0.5">%</Text>
                                </Text>
                                <Text className="text-[#FFD700] text-[10px] font-bold italic mb-0.5">
                                    {unlocked}<Text className="text-white/20">/{total}</Text>
                                </Text>
                            </View>

                            {/* Mini progress bar */}
                            <View className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden">
                                <View
                                    style={{ width: `${(unlocked / total) * 100}%` }}
                                    className="h-full bg-[#FFD700] rounded-full"
                                />
                            </View>
                        </View>
                    ))}
                </ScrollView>

                {/* Search Bar */}
                <View className="flex-row items-center bg-[#1A1A1A] rounded-xl px-4 py-2 mt-6 border border-white/5">
                    <Search size={16} color="#666" />
                    <TextInput
                        placeholder="Rechercher un héros ou un manga..."
                        placeholderTextColor="#666"
                        className="flex-1 ml-3 text-white text-xs h-8"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
            </View>

            <FlatList
                data={filteredQuotes}
                numColumns={2}
                keyExtractor={item => item.id}
                contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
                renderItem={({ item, index }) => (
                    <CollectionCard
                        quote={item}
                        isUnlocked={seenQuoteIds.has(item.id)}
                        index={index}
                    />
                )}
            />
        </SafeAreaView>
    );
}
