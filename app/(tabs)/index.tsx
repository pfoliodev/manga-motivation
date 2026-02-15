import QuoteCard from '@/components/QuoteCard';
import { useFavorites } from '@/hooks/useFavorites';
import { useQuotes } from '@/hooks/useQuotes';
import * as Notifications from 'expo-notifications';
import React, { useEffect, useRef } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  RefreshControl,
  StatusBar,
  Text,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function FeedScreen() {
  const { quotes, loading, error, refreshing, refresh } = useQuotes();
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const flatListRef = useRef<FlatList>(null);
  const windowHeight = Dimensions.get('window').height;

  const insets = useSafeAreaInsets();

  // Tab bar height calculation: 49 is the default iOS tab bar height
  const tabBarHeight = 49 + insets.bottom;
  const ITEM_HEIGHT = windowHeight - tabBarHeight;

  useEffect(() => {
    checkInitialNotification();

    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      const quoteId = response.notification.request.content.data.quoteId as string;
      if (quoteId) {
        scrollToQuote(quoteId);
      }
    });

    return () => subscription.remove();
  }, []);

  const checkInitialNotification = async () => {
    const response = await Notifications.getLastNotificationResponseAsync();
    if (response) {
      const quoteId = response.notification.request.content.data.quoteId as string;
      if (quoteId) {
        // Add a small delay to ensure list is rendered
        setTimeout(() => scrollToQuote(quoteId), 500);
      }
    }
  };

  const scrollToQuote = (quoteId: string) => {
    const index = quotes.findIndex(q => q.id === quoteId);
    if (index !== -1 && flatListRef.current) {
      flatListRef.current.scrollToIndex({ index, animated: true });
    }
  };

  // Loading state
  if (loading && quotes.length === 0) {
    return (
      <View className="flex-1 bg-[#0F0F0F] justify-center items-center">
        <StatusBar barStyle="light-content" />
        <ActivityIndicator size="large" color="#FFF" />
        <Text className="text-gray-400 mt-4">Chargement des citations...</Text>
      </View>
    );
  }

  // Error state
  if (error && quotes.length === 0) {
    return (
      <View className="flex-1 bg-[#0F0F0F] justify-center items-center px-8">
        <StatusBar barStyle="light-content" />
        <Text className="text-red-500 text-center text-lg mb-4">
          Erreur de chargement
        </Text>
        <Text className="text-gray-400 text-center">
          {error.message}
        </Text>
        <Text className="text-gray-500 text-center mt-4 text-sm">
          Vérifiez votre configuration Supabase dans le fichier .env
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#0F0F0F]">
      <StatusBar barStyle="light-content" />
      <FlatList
        ref={flatListRef}
        data={quotes}
        renderItem={({ item }) => (
          <QuoteCard
            quote={item}
            isLiked={isFavorite(item.id)}
            onLike={() => toggleFavorite(item.id)}
            onShare={() => console.log('Share')}
            height={ITEM_HEIGHT}
          />
        )}
        keyExtractor={item => item.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        decelerationRate="fast"
        snapToAlignment="start"
        snapToInterval={ITEM_HEIGHT}
        getItemLayout={(data, index) => (
          { length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index }
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
            tintColor="#FFF"
            colors={['#FFF']}
          />
        }
      />
    </View>
  );
}
