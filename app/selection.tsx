import { useQuotes } from '@/hooks/useQuotes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Brain, Check, Flame, Sparkles, Target } from 'lucide-react-native';
import React, { useState } from 'react';
import { Dimensions, Pressable, ScrollView, Text, View } from 'react-native';
import Animated, {
    FadeIn,
    FadeOut,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withSpring,
    withTiming
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - 48) / 2; // 16px padding on each side (32) + 16px gap (16) = 48

interface Category {
    id: string;
    name: string;
    description: string;
    icon: React.ElementType;
    color: string;
}

const CATEGORIES: Category[] = [
    {
        id: 'stoicisme',
        name: 'Stoïcisme',
        description: 'Sagesse et maîtrise de soi',
        icon: Brain,
        color: '#667eea',
    },
    {
        id: 'mental',
        name: 'Mental',
        description: 'Force intérieure et résilience',
        icon: Sparkles,
        color: '#f5576c',
    },
    {
        id: 'discipline',
        name: 'Discipline',
        description: 'Persévérance et détermination',
        icon: Target,
        color: '#4facfe',
    },
    {
        id: 'ambition',
        name: 'Ambition',
        description: 'Rêves et conquêtes',
        icon: Flame,
        color: '#fee140',
    },
];

const CategoryCard = ({
    category,
    isSelected,
    onPress,
    count
}: {
    category: Category;
    isSelected: boolean;
    onPress: () => void;
    count: number;
}) => {
    const scale = useSharedValue(1);
    const iconRotate = useSharedValue(0);
    const iconScale = useSharedValue(1);

    React.useEffect(() => {
        if (isSelected) {
            iconScale.value = withRepeat(
                withTiming(1.2, { duration: 1000 }),
                -1,
                true
            );
        } else {
            iconScale.value = withTiming(1);
        }
    }, [isSelected]);

    const animatedCardStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
        borderColor: isSelected ? category.color : '#222',
        borderWidth: isSelected ? 2 : 1,
        backgroundColor: '#121212',
        opacity: isSelected ? 1 : 0.9, // Higher opacity for better visibility
        // Glow effect
        shadowColor: category.color,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: isSelected ? 0.5 : 0,
        shadowRadius: isSelected ? 15 : 0,
        elevation: isSelected ? 10 : 0,
    }));

    const animatedIconStyle = useAnimatedStyle(() => ({
        transform: [
            { rotate: `${iconRotate.value}deg` },
            { scale: iconScale.value }
        ],
    }));

    const handlePress = async () => {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        // Trigger animations
        scale.value = withSequence(
            withSpring(1.05, { damping: 10, stiffness: 200 }),
            withSpring(1, { damping: 10, stiffness: 200 })
        );

        if (!isSelected) {
            iconRotate.value = withSequence(
                withTiming(15, { duration: 100 }),
                withTiming(-15, { duration: 100 }),
                withTiming(0, { duration: 100 })
            );
        }

        onPress();
    };

    const Icon = category.icon;

    return (
        <Pressable
            onPress={handlePress}
            style={{ width: COLUMN_WIDTH, marginBottom: 16 }}
        >
            <Animated.View
                style={[animatedCardStyle, { borderRadius: 20, padding: 20, height: 160, justifyContent: 'space-between' }]}
                className="overflow-hidden"
            >
                {isSelected && (
                    <View
                        className="absolute -right-[2px] -top-[2px] w-9 h-9 items-center justify-center rounded-bl-2xl"
                        style={{
                            backgroundColor: category.color,
                        }}
                    >
                        <Check size={14} color="black" strokeWidth={4} />
                    </View>
                )}

                <View className="flex-row justify-between items-start">
                    <Animated.View style={animatedIconStyle}>
                        <Icon
                            size={32}
                            color={isSelected ? category.color : '#666'}
                            strokeWidth={1.5}
                        />
                    </Animated.View>

                    <View className="bg-white/5 px-2 py-1 rounded-md border border-white/10">
                        <Text className="text-white/40 text-[10px] font-bold">
                            {count}
                        </Text>
                    </View>
                </View>

                <View>
                    <Text className="text-white font-black text-xl italic uppercase tracking-tighter">
                        {category.name}
                    </Text>
                    <Text className="text-white/40 text-[10px] font-bold uppercase tracking-widest mt-1">
                        {category.description}
                    </Text>
                </View>

                {/* Subtle glow if selected */}
                {isSelected && (
                    <View
                        className="absolute inset-0 opacity-10"
                        style={{ backgroundColor: category.color }}
                    />
                )}
            </Animated.View>
        </Pressable>
    );
};

export default function SelectionScreen() {
    const router = useRouter();
    const { quotes, getQuotesByCategory } = useQuotes();
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    // Calculate quote counts dynamically
    const categoriesWithCounts = CATEGORIES.map(cat => ({
        ...cat,
        count: getQuotesByCategory(cat.id === 'stoicisme' ? 'Stoïcisme' : cat.name).length
    }));

    React.useEffect(() => {
        console.log('SelectionScreen mounted');
    }, []);

    const toggleSelection = (id: string) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(i => i !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const handleConfirm = async () => {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        // Convert IDs to Category Names for the filtering logic in useQuotes (it currently uses .name)
        const selectedNames = CATEGORIES
            .filter(c => selectedIds.includes(c.id))
            .map(c => c.name);

        await AsyncStorage.setItem('preferred_categories', JSON.stringify(selectedNames));

        // Navigate to username step
        router.push('/onboarding/username');
    };

    const isAnySelected = selectedIds.length > 0;

    return (
        <View className="flex-1 bg-[#050505]">
            <StatusBar style="light" />
            <SafeAreaView className="flex-1">
                <ScrollView
                    className="flex-1 px-6"
                    contentContainerStyle={{ paddingBottom: 40 }}
                >
                    {/* --- HEADER --- */}
                    <View className="mt-8 mb-10">
                        <Text className="text-[#FFD700] text-xs font-black uppercase tracking-[4px] mb-2">
                            Le choix du guerrier
                        </Text>
                        <Text className="text-white text-4xl font-black italic tracking-tighter leading-[40px]">
                            DÉTERMINE{"\n"}TA VOIE
                        </Text>
                        <Text className="text-white/50 text-base font-medium mt-4">
                            Quelle force guidera tes pas aujourd'hui ?
                        </Text>
                    </View>

                    {/* --- GRID --- */}
                    <View className="flex-row flex-wrap justify-between">
                        {categoriesWithCounts.map((category) => (
                            <CategoryCard
                                key={category.id}
                                category={category}
                                isSelected={selectedIds.includes(category.id)}
                                onPress={() => toggleSelection(category.id)}
                                count={category.count}
                            />
                        ))}
                    </View>
                </ScrollView>

                {/* --- FOOTER / BUTTON --- */}
                {isAnySelected && (
                    <Animated.View
                        className="px-6 pb-8"
                        entering={FadeIn.duration(300)}
                        exiting={FadeOut.duration(200)}
                    >
                        <Pressable
                            onPress={handleConfirm}
                            className="w-full active:scale-[0.98]"
                        >
                            <LinearGradient
                                colors={['#FFD700', '#FFA500']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={{ borderRadius: 16, paddingVertical: 20, alignItems: 'center', shadowColor: '#FFD700', shadowRadius: 15, shadowOpacity: 0.3, elevation: 5 }}
                            >
                                <Text className="text-black text-lg font-black uppercase tracking-[2px] italic">
                                    Sceller mon destin
                                </Text>
                            </LinearGradient>
                        </Pressable>
                    </Animated.View>
                )}
            </SafeAreaView>
        </View>
    );
}
