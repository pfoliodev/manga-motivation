import { useFavorites } from '@/hooks/useFavorites';
import { useQuotes } from '@/hooks/useQuotes';
import * as Haptics from 'expo-haptics';
import { useFocusEffect } from 'expo-router';
import { BookOpen, Quote as QuoteIcon, X } from 'lucide-react-native';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Modal,
  Pressable,
  Text,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import QuoteCard from '@/components/QuoteCard';
import { Quote } from '@/types/database.types';

import { useAuth } from '@/src/context/AuthContext';
import { useRouter } from 'expo-router';

export default function FavoritesScreen() {
  const { isGuest } = useAuth();
  const router = useRouter();
  const { quotes, loading: quotesLoading } = useQuotes();
  const { favorites, toggleFavorite, isFavorite, loading: favoritesLoading } = useFavorites();
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const windowHeight = Dimensions.get('window').height;

  // Refresh favorites when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      // Favorites are already loaded via the hook
    }, [])
  );

  if (isGuest) {
    return (
      <SafeAreaView className="flex-1 bg-[#0F0F0F] justify-center items-center px-8">
        <BookOpen size={64} color="#333" />
        <Text className="text-white text-2xl font-bold text-center mt-8 mb-4">
          Vos Favoris
        </Text>
        <Text className="text-gray-400 text-center text-base mb-8 leading-6">
          Connectez-vous pour sauvegarder et retrouver vos citations préférées sur tous vos appareils.
        </Text>
        <Pressable
          onPress={() => router.push('/paywall')}
          className="bg-white px-8 py-4 rounded-full active:opacity-90"
        >
          <Text className="text-black font-bold text-base uppercase tracking-wider">
            Se connecter
          </Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const handleToggleFavorite = async (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await toggleFavorite(id);
  };

  const handleCardPress = (quote: Quote) => {
    setSelectedQuote(quote);
    setModalVisible(true);
  };

  // Filter quotes based on favorites
  const favoriteQuotes = quotes.filter(quote => favorites.includes(quote.id));

  const renderItem = ({ item }: { item: Quote }) => (
    <Pressable
      onPress={() => handleCardPress(item)}
      className="flex-1 bg-[#1A1A1A] rounded-2xl p-4 m-2 justify-between min-h-[160px]"
      style={({ pressed }) => ({
        opacity: pressed ? 0.9 : 1,
        transform: [{ scale: pressed ? 0.98 : 1 }]
      })}
    >
      <View>
        <View className="flex-row justify-between items-start mb-2">
          <QuoteIcon size={16} color="#4B5563" />
          <Pressable
            onPress={() => handleToggleFavorite(item.id)}
            hitSlop={10}
            className="bg-[#2A2A2A] rounded-full p-1"
          >
            <X size={14} color="#9CA3AF" />
          </Pressable>
        </View>

        <Text
          numberOfLines={4}
          className="text-white text-sm font-serif italic opacity-90 mb-3 leading-5"
        >
          "{item.text}"
        </Text>
      </View>

      <View>
        <Text className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">
          {item.author}
        </Text>
        <View className="flex-row items-center space-x-1">
          <BookOpen size={10} color="#666" />
          <Text className="text-[#666] text-[10px] uppercase tracking-wider ml-1">
            {item.source}
          </Text>
        </View>
      </View>
    </Pressable>
  );

  const EmptyState = () => (
    <View className="flex-1 justify-center items-center px-8">
      <Text className="text-gray-500 text-center text-lg leading-7 font-serif italic">
        Aucune aura capturée pour le moment. Swipe pour en trouver.
      </Text>
    </View>
  );

  const LoadingState = () => (
    <View className="flex-1 justify-center items-center">
      <ActivityIndicator size="large" color="#FFF" />
      <Text className="text-gray-400 mt-4">Chargement...</Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-[#0F0F0F]" edges={['top']}>
      <View className="px-4 py-4">
        <Text className="text-white text-2xl font-bold tracking-tight">
          Favoris
        </Text>
        <Text className="text-gray-500 text-sm mt-1">
          Votre collection de sagesse
        </Text>
      </View>

      {(quotesLoading || favoritesLoading) && favoriteQuotes.length === 0 ? (
        <LoadingState />
      ) : favorites.length === 0 ? (
        <EmptyState />
      ) : (
        <FlatList
          data={favoriteQuotes}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          numColumns={2}
          contentContainerStyle={{ padding: 8, paddingBottom: 100 }}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Full Screen Modal for Quote View */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 bg-[#0F0F0F]">
          {selectedQuote && (
            <View style={{ flex: 1 }}>
              <QuoteCard
                quote={selectedQuote}
                isLiked={isFavorite(selectedQuote.id)}
                onLike={() => handleToggleFavorite(selectedQuote.id)}
                onShare={() => console.log('Share')}
                height={windowHeight}
              />

              {/* Close Button Overlay */}
              <Pressable
                onPress={() => setModalVisible(false)}
                className="absolute top-12 left-6 bg-[#1A1A1A] p-2 rounded-full z-50"
              >
                <X size={24} color="white" />
              </Pressable>
            </View>
          )}
        </View>
      </Modal>
    </SafeAreaView>
  );
}
