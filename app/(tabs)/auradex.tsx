import { usePowerLevel } from '@/hooks/usePowerLevel';
import { quoteRepository } from '@/repositories/SupabaseQuoteRepository';
import { Quote } from '@/types/database.types';
import { ChevronUp, Lock, Search, Sparkles } from 'lucide-react-native';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    ImageBackground,
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

// Static mapping of background images (duplicate from QuoteCard for consistency)
const BACKGROUND_IMAGES: Record<string, any> = {
    'alley.png': require('../../assets/images/background-quotes/alley.png'),
    'arbre-monde.png': require('../../assets/images/background-quotes/arbre-monde.png'),
    'bambou-forest.png': require('../../assets/images/background-quotes/bambou-forest.png'),
    'bibliotheque-nuage.png': require('../../assets/images/background-quotes/bibliotheque-nuage.png'),
    'cascade-cachee.png': require('../../assets/images/background-quotes/cascade-cachee.png'),
    'caverne-dragon.png': require('../../assets/images/background-quotes/caverne-dragon.png'),
    'champ-lavande.png': require('../../assets/images/background-quotes/champ-lavande.png'),
    'champs-cristaux.png': require('../../assets/images/background-quotes/champs-cristaux.png'),
    'city-night-moon.png': require('../../assets/images/background-quotes/city-night-moon.png'),
    'cuisine-lemon.png': require('../../assets/images/background-quotes/cuisine-lemon.png'),
    'desert-diamants.png': require('../../assets/images/background-quotes/desert-diamants.png'),
    'house-view.png': require('../../assets/images/background-quotes/house-view.png'),
    'ile-flottante-magic.png': require('../../assets/images/background-quotes/ile-flottante-magic.png'),
    'ile-flottante.png': require('../../assets/images/background-quotes/ile-flottante.png'),
    'laverie.png': require('../../assets/images/background-quotes/laverie.png'),
    'lighthouse-cat.png': require('../../assets/images/background-quotes/lighthouse-cat.png'),
    'morning-sun.png': require('../../assets/images/background-quotes/morning-sun.png'),
    'mountain-sunset.png': require('../../assets/images/background-quotes/mountain-sunset.png'),
    'nightbiblio.png': require('../../assets/images/background-quotes/nightbiblio.png'),
    'parc-night.png': require('../../assets/images/background-quotes/parc-night.png'),
    'plage-soleil.png': require('../../assets/images/background-quotes/plage-soleil.png'),
    'portail.png': require('../../assets/images/background-quotes/portail.png'),
    'rue-restaurant.png': require('../../assets/images/background-quotes/rue-restaurant.png'),
    'sommet-colline.png': require('../../assets/images/background-quotes/sommet-colline.png'),
    'toit-upside.png': require('../../assets/images/background-quotes/toit-upside.png'),
    'train-galaxy.png': require('../../assets/images/background-quotes/train-galaxy.png'),
    'train-night.png': require('../../assets/images/background-quotes/train-night.png'),
    'under-water.png': require('../../assets/images/background-quotes/under-water.png'),
    'ville-enneige.png': require('../../assets/images/background-quotes/ville-enneige.png'),
    'poe/poe01.png': require('../../assets/images/background-quotes/poe/poe01.png'),
    'poe/poe02.png': require('../../assets/images/background-quotes/poe/poe02.png'),
    'poe/poe03.png': require('../../assets/images/background-quotes/poe/poe03.png'),
    'poe/poe04.png': require('../../assets/images/background-quotes/poe/poe04.png'),
    'poe/poe05.png': require('../../assets/images/background-quotes/poe/poe05.png'),
    'poe/poe06.png': require('../../assets/images/background-quotes/poe/poe06.png'),
    'poe/poe07.png': require('../../assets/images/background-quotes/poe/poe07.png'),
    'poe/poe08.png': require('../../assets/images/background-quotes/poe/poe08.png'),
    'poe/poe09.png': require('../../assets/images/background-quotes/poe/poe09.png'),
    'poe/poe10.png': require('../../assets/images/background-quotes/poe/poe10.png'),
    'Gemini_Generated_Image_8zdx9q8zdx9q8zdx.png': require('../../assets/images/background-quotes/Gemini_Generated_Image_8zdx9q8zdx9q8zdx.png'),
};

const CollectionCard = React.memo(({ quote, isUnlocked, index }: CollectionCardProps) => {
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

    const bgImage = quote.background_image && BACKGROUND_IMAGES[quote.background_image]
        ? BACKGROUND_IMAGES[quote.background_image]
        : null;

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
                {isUnlocked && bgImage ? (
                    <ImageBackground
                        source={bgImage}
                        className="flex-1"
                        resizeMode="cover"
                    >
                        <View className="flex-1 bg-black/60 p-4">
                            <View className="flex-1 justify-between">
                                <View>
                                    <View className="flex-row justify-between items-center mb-3">
                                        <View className="bg-red-600 px-1.5 py-0.5 rounded">
                                            <Text className="text-[8px] font-black text-white italic">NEW</Text>
                                        </View>
                                        <View className="bg-black/40 px-2 py-0.5 rounded-full border border-white/10">
                                            <Text className="text-[#FFD700] text-[8px] font-bold uppercase tracking-widest">
                                                {quote.category}
                                            </Text>
                                        </View>
                                    </View>

                                    <Text
                                        className="text-white text-[13px] font-bold leading-5 italic"
                                        numberOfLines={6}
                                        style={{ textShadowColor: 'rgba(0, 0, 0, 0.75)', textShadowOffset: { width: -1, height: 1 }, textShadowRadius: 10 }}
                                    >
                                        "{quote.text}"
                                    </Text>
                                </View>

                                <View className="pt-3 border-t border-white/20">
                                    <Text className="text-white font-black text-[10px] uppercase tracking-widest mb-0.5 italic" numberOfLines={1}>
                                        {quote.author}
                                    </Text>
                                    <Text className="text-white/60 text-[9px] uppercase tracking-tighter" numberOfLines={1}>
                                        {quote.source}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </ImageBackground>
                ) : (
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
                )}
            </Animated.View>
        </Animated.View>
    );
});

export default function AuraDexScreen() {
    const { profile, seenQuoteIds, loading: profileLoading } = usePowerLevel();
    const [allQuotes, setAllQuotes] = useState<Quote[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedSource, setSelectedSource] = useState<string | null>(null);
    const [showScrollTop, setShowScrollTop] = useState(false);
    const flatListRef = useRef<FlatList>(null);

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

    const sourceStats = useMemo(() => {
        const stats: Record<string, { total: number, unlocked: number }> = {};
        allQuotes.forEach(q => {
            if (!stats[q.source]) {
                stats[q.source] = { total: 0, unlocked: 0 };
            }
            stats[q.source].total++;
            if (seenQuoteIds.has(q.id)) {
                stats[q.source].unlocked++;
            }
        });
        return Object.entries(stats).sort((a, b) => b[1].total - a[1].total);
    }, [allQuotes, seenQuoteIds]);

    const progress = allQuotes.length > 0 ? unlockedCount / allQuotes.length : 0;

    const filteredQuotes = useMemo(() => {
        let filtered = allQuotes;

        if (selectedCategory) {
            filtered = filtered.filter(q => q.category === selectedCategory);
        }

        if (selectedSource) {
            filtered = filtered.filter(q => q.source === selectedSource);
        }

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(q =>
                q.author.toLowerCase().includes(query) ||
                q.source.toLowerCase().includes(query) ||
                q.text.toLowerCase().includes(query)
            );
        }

        // Trier pour mettre les débloquées en premier
        return [...filtered].sort((a, b) => {
            const aUnlocked = seenQuoteIds.has(a.id);
            const bUnlocked = seenQuoteIds.has(b.id);
            if (aUnlocked && !bUnlocked) return -1;
            if (!aUnlocked && bUnlocked) return 1;
            return 0;
        });
    }, [allQuotes, searchQuery, selectedCategory, selectedSource, seenQuoteIds]);

    const renderItem = React.useCallback(({ item, index }: { item: Quote, index: number }) => (
        <CollectionCard
            quote={item}
            isUnlocked={seenQuoteIds.has(item.id)}
            index={index}
        />
    ), [seenQuoteIds]);

    const getItemLayout = React.useCallback((_: any, index: number) => {
        const rowHeight = (COLUMN_WIDTH * 1.25) + 16;
        return {
            length: rowHeight,
            offset: rowHeight * Math.floor(index / 2),
            index,
        };
    }, []);

    if (loading || profileLoading) {
        return (
            <View className="flex-1 bg-[#0F0F0F] items-center justify-center">
                <ActivityIndicator color="#FFD700" size="large" />
            </View>
        );
    }

    const scrollToTop = () => {
        flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
    };

    return (
        <SafeAreaView className="flex-1 bg-[#0F0F0F]">
            <StatusBar barStyle="light-content" />

            <FlatList
                ref={flatListRef}
                data={filteredQuotes}
                numColumns={2}
                keyExtractor={item => item.id}
                contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
                onScroll={(event) => {
                    const offsetY = event.nativeEvent.contentOffset.y;
                    setShowScrollTop(offsetY > 300);
                }}
                scrollEventThrottle={16}
                ListHeaderComponent={
                    <View className="px-2 pt-4 pb-2">
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
                                    {Math.round(progress * 100)}% <Text className="text-white/20 text-[10px] ml-1">({unlockedCount} / {allQuotes.length})</Text>
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
                            className="-mx-4 px-4"
                            contentContainerStyle={{ paddingRight: 40 }}
                        >
                            {categoryStats.map(([category, { total, unlocked }]) => {
                                const isSelected = selectedCategory === category;
                                return (
                                    <Pressable
                                        key={category}
                                        onPress={() => setSelectedCategory(isSelected ? null : category)}
                                        className={`bg-[#1A1A1A] border ${isSelected ? 'border-[#FFD700]' : 'border-white/10'} rounded-2xl px-5 py-4 mr-3 min-w-[120px]`}
                                    >
                                        <Text className={`text-[8px] font-bold uppercase tracking-widest mb-1.5 ${isSelected ? 'text-[#FFD700]' : 'text-white/40'}`}>
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
                                                className={`h-full ${isSelected ? 'bg-white' : 'bg-[#FFD700]'} rounded-full`}
                                            />
                                        </View>
                                    </Pressable>
                                );
                            })}
                        </ScrollView>

                        {/* Source Stats Section */}
                        <View className="mt-6 mb-4 flex-row items-center">
                            <View className="w-1 h-4 bg-[#FFD700] rounded-full mr-3" />
                            <Text className="text-white/60 text-[10px] font-black uppercase tracking-[2px]">
                                Maîtrise des sources
                            </Text>
                        </View>

                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            className="-mx-4 px-4"
                            contentContainerStyle={{ paddingRight: 40 }}
                        >
                            {sourceStats.map(([source, { total, unlocked }]) => {
                                const isSelected = selectedSource === source;
                                return (
                                    <Pressable
                                        key={source}
                                        onPress={() => {
                                            setSelectedSource(isSelected ? null : source);
                                        }}
                                        className={`bg-[#1A1A1A] border ${isSelected ? 'border-[#FFD700]' : 'border-white/10'} rounded-2xl px-5 py-4 mr-3 min-w-[120px]`}
                                    >
                                        <Text className={`text-[8px] font-bold uppercase tracking-widest mb-1.5 ${isSelected ? 'text-[#FFD700]' : 'text-white/40'}`} numberOfLines={1}>
                                            {source}
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
                                                className={`h-full ${isSelected ? 'bg-white' : 'bg-[#FFD700]'} rounded-full`}
                                            />
                                        </View>
                                    </Pressable>
                                );
                            })}
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

                        {/* Filter Results Count */}
                        <View className="mt-4 mb-2 flex-row justify-between items-center">
                            <Text className="text-white/20 text-[10px] font-bold uppercase tracking-[2px]">
                                {filteredQuotes.length} {filteredQuotes.length > 1 ? 'résultats trouvés' : 'résultat trouvé'}
                            </Text>
                            {(selectedCategory || selectedSource || searchQuery) && (
                                <Pressable
                                    onPress={() => {
                                        setSelectedCategory(null);
                                        setSelectedSource(null);
                                        setSearchQuery('');
                                    }}
                                >
                                    <Text className="text-[#FFD700] text-[10px] font-bold uppercase tracking-widest">
                                        Réinitialiser
                                    </Text>
                                </Pressable>
                            )}
                        </View>
                    </View>
                }
                renderItem={renderItem}
                getItemLayout={getItemLayout}
                initialNumToRender={8}
                maxToRenderPerBatch={4}
                windowSize={5}
                removeClippedSubviews={true}
            />

            {showScrollTop && (
                <Animated.View
                    entering={FadeInDown}
                    className="absolute bottom-24 right-6 z-50 rounded-2xl overflow-hidden"
                    style={{ elevation: 8 }}
                >
                    <Pressable
                        onPress={scrollToTop}
                        hitSlop={12}
                        className="bg-red-600 p-4 active:opacity-80 flex-row items-center justify-center"
                    >
                        <View pointerEvents="none">
                            <ChevronUp size={24} color="white" />
                        </View>
                    </Pressable>
                </Animated.View>
            )}
        </SafeAreaView>
    );
}
