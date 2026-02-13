import { LinearGradient } from 'expo-linear-gradient';
import { Heart, Share2 } from 'lucide-react-native';
import React from 'react';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';

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

export default function QuoteCard({ quote, isLiked, onLike, onShare, height }: QuoteCardProps) {
  const { width } = Dimensions.get('window');

  return (
    <View style={{ width, height }} className="justify-center items-center bg-[#0F0F0F] relative">
      <LinearGradient
        colors={['transparent', 'rgba(255,255,255,0.05)', 'transparent']}
        style={StyleSheet.absoluteFillObject}
      />
      
      <View className="px-8 items-center w-full z-10">
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

      <View className="absolute right-6 bottom-32 gap-6 items-center z-20">
        <Pressable onPress={onLike} className="items-center justify-center p-3 rounded-full bg-[#1A1A1A]">
          <Heart 
            size={28} 
            color={isLiked ? "#EF4444" : "#FFF"} 
            fill={isLiked ? "#EF4444" : "transparent"} 
          />
        </Pressable>
        <Pressable onPress={onShare} className="items-center justify-center p-3 rounded-full bg-[#1A1A1A]">
          <Share2 size={28} color="#FFF" />
        </Pressable>
      </View>
    </View>
  );
}
