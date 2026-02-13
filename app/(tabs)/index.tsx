import QuoteCard from '@/components/QuoteCard';
import quotesData from '@/data/quotes.json';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import * as Notifications from 'expo-notifications';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, FlatList, StatusBar, View } from 'react-native';

export default function FeedScreen() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const flatListRef = useRef<FlatList>(null);
  const windowHeight = Dimensions.get('window').height;
  
  // Try to get tab bar height, fallback to 60 if hook fails (e.g. outside nav)
  let tabBarHeight = 60;
  try {
    tabBarHeight = useBottomTabBarHeight();
  } catch (e) {
    // Ignore error if not inside bottom tab navigator immediately
  }

  const ITEM_HEIGHT = windowHeight - tabBarHeight;

  useEffect(() => {
    loadFavorites();
    checkInitialNotification();
    
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      const quoteId = response.notification.request.content.data.quoteId;
      if (quoteId) {
        scrollToQuote(quoteId);
      }
    });
    
    return () => subscription.remove();
  }, []);

  const checkInitialNotification = async () => {
    const response = await Notifications.getLastNotificationResponseAsync();
    if (response) {
      const quoteId = response.notification.request.content.data.quoteId;
      if (quoteId) {
        // Add a small delay to ensure list is rendered
        setTimeout(() => scrollToQuote(quoteId), 500);
      }
    }
  };

  const scrollToQuote = (quoteId: string) => {
    const index = quotesData.findIndex(q => q.id === quoteId);
    if (index !== -1 && flatListRef.current) {
      flatListRef.current.scrollToIndex({ index, animated: true });
    }
  };

  const loadFavorites = async () => {
    try {
      const stored = await AsyncStorage.getItem('favorites');
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const toggleFavorite = async (id: string) => {
    try {
      let newFavorites = [...favorites];
      if (newFavorites.includes(id)) {
        newFavorites = newFavorites.filter(favId => favId !== id);
      } else {
        newFavorites.push(id);
      }
      setFavorites(newFavorites);
      await AsyncStorage.setItem('favorites', JSON.stringify(newFavorites));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <View className="flex-1 bg-[#0F0F0F]">
      <StatusBar barStyle="light-content" />
      <FlatList
        ref={flatListRef}
        data={quotesData}
        renderItem={({ item }) => (
          <QuoteCard
            quote={item}
            isLiked={favorites.includes(item.id)}
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
      />
    </View>
  );
}
