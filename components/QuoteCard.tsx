import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import * as Sharing from 'expo-sharing';
import { Heart, Share2 } from 'lucide-react-native';
import React, { useRef } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withSpring } from 'react-native-reanimated';
import { captureRef } from 'react-native-view-shot';
import { useRequireAuth } from '../src/hooks/useRequireAuth';

interface Quote {
  id: string;
  text: string;
  author: string;
  source: string;
  category: string;
}

interface QuoteCardProps {
  quote: Quote;
  isLiked?: boolean;
  onLike?: () => void;
  onShare?: () => void;
  height: number;
}

const { width: WINDOW_WIDTH } = Dimensions.get('window');

export default function QuoteCard({ quote, isLiked, onLike, onShare, height }: QuoteCardProps) {
  const { width } = Dimensions.get('window');
  const scale = useSharedValue(1);
  const viewRef = useRef<View>(null);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const requireAuth = useRequireAuth();

  const handleLike = () => {
    console.log('❤️ Like pressed for quote:', quote.id);
    requireAuth(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      scale.value = withSequence(
        withSpring(1.2, { damping: 10, stiffness: 200 }),
        withSpring(1, { damping: 10, stiffness: 200 })
      );

      onLike?.();
    });
  };

  const handleShare = async () => {
    console.log('📤 Share pressed for quote:', quote.id);
    requireAuth(async () => {
      try {
        if (viewRef.current) {
          const uri = await captureRef(viewRef, {
            format: 'png',
            quality: 0.9,
          });

          await Sharing.shareAsync(uri);
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
      } catch (error) {
        console.error('Error sharing quote:', error);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }

      onShare?.();
    });
  };

  return (
    <View style={{ width, height }} className="bg-[#0F0F0F] relative" pointerEvents="box-none">
      <View
        ref={viewRef}
        style={{ width, height }}
        className="justify-center items-center bg-[#0F0F0F]"
        pointerEvents="box-none"
      >
        <LinearGradient
          colors={['transparent', 'rgba(255,255,255,0.05)', 'transparent']}
          style={StyleSheet.absoluteFillObject}
          pointerEvents="none"
        />

        <View className="px-8 items-center w-full z-10" pointerEvents="none">
          <Text className="text-white text-3xl font-serif text-center leading-10 mb-8 tracking-wide italic opacity-90">
            "{quote.text}"
          </Text>
          <Text className="text-gray-400 text-lg font-sans uppercase tracking-widest mb-1">
            {quote.author}
          </Text>
          <Text className="text-[#333] text-xs font-sans uppercase tracking-widest">
            {quote.source}
          </Text>
        </View>

        <Text
          className="absolute bottom-8 text-[#333] text-[10px] font-sans uppercase tracking-widest opacity-60"
          pointerEvents="none"
        >
          AURA : Manga & Motivation
        </Text>
      </View>

      <View
        className="absolute right-6 bottom-32 gap-6 items-center"
        style={{ zIndex: 9999 }}
        pointerEvents="box-none"
      >
        <TouchableOpacity
          onPress={() => {
            console.log('❤️ HEART CLICKED');
            handleLike();
          }}
          activeOpacity={0.7}
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
          style={{ backgroundColor: '#1A1A1A', padding: 12, borderRadius: 30 }}
        >
          <Animated.View style={animatedStyle} pointerEvents="none">
            <Heart
              size={28}
              color={isLiked ? "#EF4444" : "#FFF"}
              fill={isLiked ? "#EF4444" : "transparent"}
            />
          </Animated.View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            console.log('📤 SHARE CLICKED');
            handleShare();
          }}
          activeOpacity={0.7}
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
          style={{ backgroundColor: '#1A1A1A', padding: 12, borderRadius: 30 }}
        >
          <View pointerEvents="none">
            <Share2 size={28} color="#FFF" />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}
