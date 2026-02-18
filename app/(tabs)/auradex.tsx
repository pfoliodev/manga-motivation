import { usePowerLevel } from '@/hooks/usePowerLevel';
import { quoteRepository } from '@/repositories/SupabaseQuoteRepository';
import { Quote } from '@/types/database.types';
import { LinearGradient } from 'expo-linear-gradient';
import { Lock, Search, Sparkles } from 'lucide-react-native';
import React, { useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    Image,
    Pressable,
    SafeAreaView,
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

// Map authors to local assets
const CHARACTER_IMAGES: Record<string, any> = {
    'Guts': require('../../assets/images/characters/guts.png'),
};

const SILHOUETTE_ASSET = require('../../assets/images/characters/silhouette.png');

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
            style={{ width: COLUMN_WIDTH, height: COLUMN_WIDTH * 1.4 }}
            className="m-2"
        >
            <Animated.View
                style={[{ flex: 1 }, animatedStyle]}
                className="rounded-3xl overflow-hidden border border-white/5 bg-[#1A1A1A]"
            >
                <Pressable
                    onPressIn={onPressIn}
                    onPressOut={onPressOut}
                    className="flex-1"
                >
                    {isUnlocked ? (
                        <View className="flex-1">
                            <Image
                                source={CHARACTER_IMAGES[quote.author] || { uri: 'https://via.placeholder.com/300x420/222/FFF?text=' + quote.author }}
                                className="absolute inset-0 w-full h-full"
                                resizeMode="cover"
                            />
                            <LinearGradient
                                colors={['transparent', 'rgba(0,0,0,0.8)']}
                                className="absolute inset-0"
                            />

                            {/* NEW Badge if it's new (logic can be improved with timestamp) */}
                            <View className="absolute top-3 left-3 bg-red-600 px-2 py-1 rounded-md">
                                <Text className="text-[10px] font-black text-white italic">NEW</Text>
                            </View>

                            <View className="absolute bottom-4 left-4 right-4">
                                <Text className="text-white font-black text-xs uppercase tracking-widest mb-1 italic" numberOfLines={1}>
                                    {quote.author}
                                </Text>
                                <Text className="text-white/50 text-[10px] uppercase tracking-tighter" numberOfLines={1}>
                                    {quote.source}
                                </Text>
                            </View>
                        </View>
                    ) : (
                        <View className="flex-1 items-center justify-center bg-[#0D0D0D]">
                            <Image
                                source={SILHOUETTE_ASSET}
                                className="absolute inset-0 w-full h-full opacity-20"
                                resizeMode="cover"
                            />
                            <View className="absolute inset-0 items-center justify-center">
                                <Lock size={20} color="#333" />
                                <Text className="text-[#333] text-[9px] font-bold uppercase mt-2 tracking-widest">
                                    VERROUILLÉ
                                </Text>
                            </View>

                            <View className="absolute bottom-4 left-4 right-4 opacity-30">
                                <Text className="text-white/20 text-[10px] uppercase font-bold text-center">
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
