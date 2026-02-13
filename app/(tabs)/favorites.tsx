import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { useFocusEffect } from 'expo-router';
import { BookOpen, Quote as QuoteIcon, X } from 'lucide-react-native';
import React, { useCallback, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Modal,
  Pressable,
  Text,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import QuoteCard from '@/components/QuoteCard';
import quotesData from '@/data/quotes.json';

// Type definition matching the one in QuoteCard and quotes.json
interface Quote {
  id: string;
  text: string;
  author: string;
  source: string;
  category: string;
  aura_level?: number;
}

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  
  const windowHeight = Dimensions.get('window').height;

  // Load favorites when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [])
  );

  const loadFavorites = async () => {
    try {
      const stored = await AsyncStorage.getItem('favorites');
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load favorites:', e);
    }
  };

  const toggleFavorite = async (id: string) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      let newFavorites = [...favorites];
      if (newFavorites.includes(id)) {
        newFavorites = newFavorites.filter(favId => favId !== id);
      } else {
        newFavorites.push(id);
      }
      setFavorites(newFavorites);
      await AsyncStorage.setItem('favorites', JSON.stringify(newFavorites));
    } catch (e) {
      console.error('Failed to toggle favorite:', e);
    }
  };

  const handleCardPress = (quote: Quote) => {
    setSelectedQuote(quote);
    setModalVisible(true);
  };

  // Filter quotes based on favorites
  const favoriteQuotes = quotesData.filter(quote => favorites.includes(quote.id));

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
            onPress={() => toggleFavorite(item.id)}
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

      {favorites.length === 0 ? (
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
                isLiked={favorites.includes(selectedQuote.id)}
                onLike={() => toggleFavorite(selectedQuote.id)}
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
