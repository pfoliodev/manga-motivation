import QuoteCard from '@/components/QuoteCard';
import { useFavorites } from '@/hooks/useFavorites';
import { usePowerLevel } from '@/hooks/usePowerLevel';
import { useQuotes } from '@/hooks/useQuotes';
import * as Notifications from 'expo-notifications';
import React, { useEffect, useRef } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  RefreshControl,
  StatusBar,
  StyleSheet,
  Text,
  View
} from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const XPGainAnimation = ({ visible, message, onAnimationComplete }: { visible: boolean; message?: string | null; onAnimationComplete: () => void }) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(0.5);

  useEffect(() => {
    if (visible) {
      // Reset values
      opacity.value = 0;
      translateY.value = 40;
      scale.value = 0.5;

      // Opacity sequence
      opacity.value = withSequence(
        withTiming(1, { duration: 100 }),
        withDelay(2000, withTiming(0, { duration: 200 }, (finished) => {
          if (finished) {
            runOnJS(onAnimationComplete)();
          }
        }))
      );

      // Scale sequence
      scale.value = withSequence(
        withSpring(1.3, { damping: 15 }),
        withSpring(1.0, { damping: 15 })
      );

      // Movement sequence
      translateY.value = withSequence(
        withSpring(0, { damping: 15 }),
        withDelay(2000, withTiming(-40, { duration: 200 }))
      );
    }
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateY: translateY.value },
      { scale: scale.value }
    ],
  }));

  if (!visible) return null;

  return (
    <View
      style={[StyleSheet.absoluteFillObject, { zIndex: 9999, justifyContent: 'flex-start', alignItems: 'center', paddingTop: '20%' }]}
      pointerEvents="none"
    >
      <Animated.View
        style={[
          animatedStyle,
          {
            shadowColor: message ? "#FF0000" : "#FFD700", // Red shadow for level up!
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.9,
            shadowRadius: message ? 30 : 20,
          }
        ]}
      >
        {message ? (
          <View>
            <Text style={{
              fontFamily: 'Bangers_400Regular',
              color: '#FFD700',
              fontSize: 52, // Epic size
              textShadowColor: 'rgba(0,0,0,0.9)',
              textShadowRadius: 15,
              letterSpacing: 4,
              textAlign: 'center'
            }}>
              {message}
            </Text>
            <Text style={{
              fontFamily: 'Bangers_400Regular',
              color: '#FFFFFF',
              fontSize: 18,
              textShadowColor: 'rgba(0,0,0,0.8)',
              textShadowRadius: 5,
              letterSpacing: 2,
              textAlign: 'center',
              marginTop: -5
            }}>
              AURA AUGMENTÉE !
            </Text>
          </View>
        ) : (
          <Text style={{
            fontFamily: 'Bangers_400Regular',
            color: '#FFD700',
            fontSize: 36,
            textShadowColor: 'rgba(0,0,0,0.8)',
            textShadowRadius: 10,
            letterSpacing: 2,
            textAlign: 'center'
          }}>
            +5 XP
          </Text>
        )}
      </Animated.View>
    </View>
  );
};

export default function FeedScreen() {
  const { quotes, loading, error, refreshing, refresh } = useQuotes();
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const { markQuoteAsSeen } = usePowerLevel(); // Add hook
  const flatListRef = useRef<Animated.FlatList<any>>(null);
  const { height: windowHeight } = Dimensions.get('window');

  // XP Animation state
  const [showXP, setShowXP] = React.useState(false);
  const [xpMessage, setXpMessage] = React.useState<string | null>(null);

  const insets = useSafeAreaInsets();

  // Tab bar height calculation: 49 is the default iOS tab bar height
  // On ajoute un petit offset pour être sûr que ça ne touche pas la nav bar
  const tabBarHeight = 49 + insets.bottom;
  const ITEM_HEIGHT = windowHeight - tabBarHeight;

  // Animation logic
  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  // Tracking viewed items
  const onViewableItemsChanged = useRef(async ({ viewableItems }: { viewableItems: any[] }) => {
    if (viewableItems.length > 0) {
      const currentItem = viewableItems[0];
      if (currentItem && currentItem.item && currentItem.item.id) {
        try {
          const result = await markQuoteAsSeen(currentItem.item.id);
          if (result && result.xpGained > 0) {
            // Reset then show animation
            setShowXP(false);

            // Show 'LEVEL UP!' only if user actually leveled up
            if (result.leveledUp) {
              setXpMessage('LEVEL UP!');
            } else {
              setXpMessage(null);
            }

            // Force a re-render/reflow before showing again
            setTimeout(() => setShowXP(true), 10);
          }
        } catch (e) {
          console.error('Error in view tracking:', e);
        }
      }
    }
  }).current;

  // Viewability config
  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50, // Consider item viewed when 50% visible
    minimumViewTime: 500, // User must look at it for 500ms
  }).current;

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
      // @ts-ignore - ScrollToIndex exists on Animated.FlatList but Typescript might complain
      flatListRef.current.scrollToIndex({ index, animated: true });
    }
  };

  // Component for animated item - VERSION AMPLIFIEE
  const AnimeQuoteItem = React.memo(({ item, index, scrollY, height }: { item: any, index: number, scrollY: any, height: number }) => {
    const animatedStyle = useAnimatedStyle(() => {
      const inputRange = [
        (index - 1) * height,
        index * height,
        (index + 1) * height
      ];

      const scale = interpolate(
        scrollY.value,
        inputRange,
        [0.8, 1, 0.8], // Plus de zoom out
        Extrapolation.CLAMP
      );

      const opacity = interpolate(
        scrollY.value,
        inputRange,
        [0, 1, 0], // Transparence totale
        Extrapolation.CLAMP
      );

      const translateY = interpolate(
        scrollY.value,
        inputRange,
        [100, 0, -100], // Plus de mouvement vertical
        Extrapolation.CLAMP
      );

      return {
        transform: [{ scale }, { translateY }],
        opacity,
      };
    });

    return (
      <Animated.View style={[{ height, justifyContent: 'center', alignItems: 'center' }, animatedStyle]}>
        <QuoteCard
          quote={item}
          isLiked={isFavorite(item.id)}
          onLike={() => toggleFavorite(item.id)}
          onShare={() => console.log('Share')}
          height={height}
          scrollY={scrollY}
          index={index}
        />
      </Animated.View>
    );
  });

  // Loading state
  if (loading && quotes.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <StatusBar barStyle="light-content" />
        <ActivityIndicator size="large" color="#FFF" />
        <Text style={styles.loadingText}>Chargement des citations...</Text>
      </View>
    );
  }

  // Error state
  if (error && quotes.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <StatusBar barStyle="light-content" />
        <Text style={styles.errorTitle}>
          Erreur de chargement
        </Text>
        <Text style={styles.errorText}>
          {error.message}
        </Text>
        <Text style={styles.errorHint}>
          Vérifiez votre configuration Supabase dans le fichier .env
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* XP Gain Animation Overlay */}
      <XPGainAnimation
        visible={showXP}
        message={xpMessage}
        onAnimationComplete={() => setShowXP(false)}
      />

      <Animated.FlatList
        ref={flatListRef}
        data={quotes}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        renderItem={({ item, index }) => (
          <AnimeQuoteItem
            item={item}
            index={index}
            scrollY={scrollY}
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
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
            tintColor="#FFF"
            colors={['#FFF']}
          />
        }
        removeClippedSubviews={true}
        initialNumToRender={1}
        maxToRenderPerBatch={2}
        windowSize={3}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F0F',
  },
  centerContainer: {
    flex: 1,
    backgroundColor: '#0F0F0F',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  loadingText: {
    color: '#9CA3AF',
    marginTop: 16,
  },
  errorTitle: {
    color: '#EF4444',
    textAlign: 'center',
    fontSize: 18,
    marginBottom: 16,
  },
  errorText: {
    color: '#9CA3AF',
    textAlign: 'center',
  },
  errorHint: {
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 16,
    fontSize: 14,
  },
});
